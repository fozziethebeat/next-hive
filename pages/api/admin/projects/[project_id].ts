import type { NextApiRequest, NextApiResponse } from "next";

import { Client } from "@elastic/elasticsearch";

import { getProject } from "@lib/search/queries";
import { SearchOptions } from "types";

const esClient = new Client({ node: process.env.ELASTIC_HOST });

/**
 * Handles a GET request to `/api/admin/projects/{project_id}` to retrieve a
 * single project.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const project_id = req.query["project_id"] as string;
  const { status, project, message } = await getProject(esClient, project_id);
  res.status(200).json({ status, project, message });
}
