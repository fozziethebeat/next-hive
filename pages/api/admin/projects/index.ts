import type { NextApiRequest, NextApiResponse } from "next";

import { Client } from "@elastic/elasticsearch";

import { getProjects } from "@lib/search/queries";
import { SearchOptions } from "types";

const esClient = new Client({ node: process.env.ELASTIC_HOST });

/**
 * Handles a GET request to `/api/admin/projects` to retrieve all projects.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const from = parseInt(req.query["from"] as string, 10) || 0;
  const size = parseInt(req.query["size"] as string, 10) | 10;
  const options: SearchOptions = { from, size };
  const projects = await getProjects(esClient, options);
  res.status(200).json({ projects });
}
