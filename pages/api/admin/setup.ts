import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import { Client } from "@elastic/elasticsearch";

console.log(process.env.ELASTIC_HOST);
const client = new Client({ node: process.env.ELASTIC_HOST });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  /*
  // Check if the index already exists.  End early if it does.
  const existResult = await client.indices.exists({
    index: process.env.ELASTIC_INDEX,
  });
  if (existResult.body) {
    res.status(200).json({ status: "Ready" });
    return;
  }
 */

  // Temporarily delete any index.
  try {
    await client.indices.delete({
      index: `${process.env.ELASTIC_INDEX}-projects`,
    });
    await client.indices.delete({
      index: `${process.env.ELASTIC_INDEX}-tasks`,
    });
    await client.indices.delete({
      index: `${process.env.ELASTIC_INDEX}-assets`,
    });
    await client.indices.delete({
      index: `${process.env.ELASTIC_INDEX}-assignments`,
    });
  } catch (e) {
    // Ignoring.
  }

  // Create the indices.
  try {
    // The Projects Index.
    await client.indices.create({
      index: `${process.env.ELASTIC_INDEX}-projects`,
      body: {
        mappings: {
          properties: {
            Id: {
              type: "text",
            },
            Url: {
              type: "text",
              index: false,
            },
            Description: {
              type: "text",
              index: false,
            },
          },
        },
      },
    });
    // The Tasks Index.
    await client.indices.create({
      index: `${process.env.ELASTIC_INDEX}-tasks`,
      body: {
        mappings: {
          properties: {
            Id: {
              type: "text",
            },
            Project: {
              type: "text",
            },
            Name: {
              type: "text",
            },
            Description: {
              type: "text",
              index: false,
            },
            CurrentState: {
              type: "text",
            },
            AssignmentCriteria: {
              type: "flattened",
              index: false,
            },
            CompletionCriteria: {
              properties: {
                Total: {
                  type: "integer",
                },
                Matching: {
                  type: "integer",
                },
              },
            },
          },
        },
      },
    });
    // The Assets index.
    await client.indices.create({
      index: `${process.env.ELASTIC_INDEX}-assets`,
      body: {
        mappings: {
          properties: {
            Id: {
              type: "text",
            },
            Project: {
              type: "text",
            },
            Url: {
              type: "text",
              index: false,
            },
            Name: {
              type: "text",
            },
            Metadata: {
              type: "flattened",
              index: false,
            },
            SubmittedData: {
              type: "flattened",
              index: false,
            },
            Favorited: {
              type: "boolean",
            },
            Verified: {
              type: "boolean",
            },
            Counts: {
              type: "flattened",
              index: false,
            },
          },
        },
      },
    });
    // The Assignments Index.
    await client.indices.create({
      index: `${process.env.ELASTIC_INDEX}-assignments`,
      body: {
        mappings: {
          properties: {
            Asset: {
              properties: {
                Favorited: {
                  type: "boolean",
                },
                Id: {
                  type: "text",
                  index: false,
                },
                Url: {
                  type: "text",
                  index: false,
                },
              },
            },
            Id: {
              type: "text",
              index: false,
            },
            Project: {
              type: "text",
              index: false,
            },
            State: {
              type: "text",
              index: false,
            },
            Task: {
              type: "text",
              index: false,
            },
            User: {
              type: "text",
              index: false,
            },
            SubmittedData: {
              type: "flattened",
              index: false,
            },
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.status(200).json({ status: "Could not create index" });
    return;
  }

  // Next, parse the body into the full content to be index.
  const { Project, Tasks, Assets } = req.body;

  // Next, index the one project.
  await client.index({
    index: `${process.env.ELASTIC_INDEX}-projects`,
    id: uuidv4(),
    body: {
      Project,
    },
  });

  // Next, index all tasks.
  const taskBody = Tasks.flatMap((task) => {
    task.Id = uuidv4();
    task.Project = Project.Name;
    return [
      {
        index: { _index: `${process.env.ELASTIC_INDEX}-tasks` },
      },
      task,
    ];
  });
  await client.bulk({
    body: taskBody,
  });

  // Next, index all assets.
  const assetBody = Assets.flatMap((asset) => {
    asset.Id = uuidv4();
    asset.Project = Project.Name;
    return [
      {
        index: { _index: `${process.env.ELASTIC_INDEX}-assets` },
      },
      asset,
    ];
  });
  await client.bulk({
    body: assetBody,
  });

  // All done.
  res.status(200).json({ status: "Created Index" });
}
