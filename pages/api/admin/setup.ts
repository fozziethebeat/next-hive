import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import { Client } from "@elastic/elasticsearch";

import { handlerImpl, SetupBody } from "../../../lib/api/admin/setup";

const esClient = new Client({ node: process.env.ELASTIC_HOST });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const setupBody: SetupBody = req.body;
  const { status, message } = await handlerImpl(esClient, setupBody);
  res.status(status).json({ status: message });
}
