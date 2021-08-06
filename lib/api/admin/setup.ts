import { v4 as uuidv4 } from "uuid";

import { Client } from "@elastic/elasticsearch";

import type { Project, Task, Asset } from "@types";

export interface SetupBody {
  project: Project;
  tasks: Task[];
  assets: Asset[];
}

export async function handlerImpl(client: Client, setupBody: SetupBody) {
  const indices = [
    `${process.env.ELASTIC_INDEX}-projects`,
    `${process.env.ELASTIC_INDEX}-tasks`,
    `${process.env.ELASTIC_INDEX}-assets`,
    `${process.env.ELASTIC_INDEX}-assignments`,
  ];

  // Check if the index already exists.  End early if it does.
  const allIndicesExist = await indices.reduce(async (exists, index) => {
    const existResult = await client.indices.exists({
      index: index,
    });
    return exists && existResult.body;
  }, true);
  if (allIndicesExist) {
    return { status: 200, message: "Indices Already Created" };
  }

  // Temporarily delete any index.
  await indices.forEach(async (index) => {
    try {
      await client.indices.delete({
        index: index,
      });
    } catch (e) {
      // Ignoring.
    }
  });

  // Create the indices.
  try {
    // The Projects Index.
    await client.indices.create({
      index: `${process.env.ELASTIC_INDEX}-projects`,
      body: {
        mappings: {
          properties: {
            id: {
              type: "text",
            },
            url: {
              type: "text",
              index: false,
            },
            description: {
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
            id: {
              type: "text",
            },
            project: {
              type: "text",
            },
            name: {
              type: "text",
            },
            description: {
              type: "text",
              index: false,
            },
            currentState: {
              type: "text",
            },
            assignmentCriteria: {
              type: "flattened",
              index: false,
            },
            completionCriteria: {
              properties: {
                total: {
                  type: "integer",
                },
                matching: {
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
            id: {
              type: "text",
            },
            project: {
              type: "text",
            },
            url: {
              type: "text",
              index: false,
            },
            name: {
              type: "text",
            },
            metadata: {
              type: "flattened",
              index: false,
            },
            submittedData: {
              type: "flattened",
              index: false,
            },
            favorited: {
              type: "boolean",
            },
            verified: {
              type: "boolean",
            },
            counts: {
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
            asset: {
              properties: {
                favorited: {
                  type: "boolean",
                },
                id: {
                  type: "text",
                  index: false,
                },
                url: {
                  type: "text",
                  index: false,
                },
              },
            },
            id: {
              type: "text",
              index: false,
            },
            project: {
              type: "text",
              index: false,
            },
            state: {
              type: "text",
              index: false,
            },
            task: {
              type: "text",
              index: false,
            },
            user: {
              type: "text",
              index: false,
            },
            submittedData: {
              type: "flattened",
              index: false,
            },
          },
        },
      },
    });
  } catch (e) {
    return { status: 400, message: "Could not create index" };
  }

  // Next, parse the body into the full content to be index.

  // Next, index the one project.
  await client.index({
    index: `${process.env.ELASTIC_INDEX}-projects`,
    id: uuidv4(),
    body: setupBody.project,
  });

  // Next, index all tasks.
  const taskBody = setupBody.tasks.flatMap((task) => {
    task.id = uuidv4();
    task.project = setupBody.project.name;
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
  const assetBody = setupBody.assets.flatMap((asset) => {
    asset.id = uuidv4();
    asset.project = setupBody.project.name;
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
  return { status: 200, message: "Created Index" };
}
