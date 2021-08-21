import { v4 as uuidv4 } from "uuid";

import { Client } from "@elastic/elasticsearch";

import type { Project, Task, Asset, SearchOptions } from "types";

/**
 * Returns all indexed projects.
 *
 * @param client The Elasticsearch client.
 * @param options The {@link SearchOptions}.
 * @returns An array of {@link Project} results.
 */
export async function getProjects(
  client: Client,
  options: SearchOptions
): Promise<Project[]> {
  const index = `${process.env.ELASTIC_INDEX}-projects`;
  try {
    const result = await client.search({
      index: index,
      from: options.from,
      size: options.size,
    });
    return result.body.body.hits;
  } catch (e) {
    return [];
  }
  return [];
}

/**
 * Returns a single indexed project.
 *
 * @param client The Elasticsearch client.
 * @param project_id The project id.
 * @returns An object with `status`,`message`, and `project` fields.
 */
export async function getProject(
  client: Client,
  project_id: string 
) {
  const index: string = `${process.env.ELASTIC_INDEX}-projects`;
  try {
    const result = await client.get({
      index: index,
      id: project_id,
    });
    return { status: 200, message: "", project: result.body.body };
  } catch (e) {
    return { status: 404 , message: "No Project" };
  }
}
