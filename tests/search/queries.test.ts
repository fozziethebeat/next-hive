import { Client } from "@elastic/elasticsearch";
import Mock from "@elastic/elasticsearch-mock";

import { getProject, getProjects } from "@lib/search/queries";

test("getStoredProjects", async () => {
  process.env.ELASTIC_INDEX = "hive-test";
  const mock = new Mock();
  const client = new Client({
    node: "http://localhost:9200",
    Connection: mock.getConnection(),
  });
  mock.add(
    {
      method: "GET",
      path: "/hive-test-projects/_search",
      querystring: { "from": "0", "size": "10"},
    },
    () => {
      return {
        body: {
          hits: [{ name: "project 1" }, { name: "project 2" }],
        },
      };
    }
  );
  const projects = await getProjects(client, {
    from: 0,
    size: 10,
  });
  expect(projects).toStrictEqual([
    { name: "project 1" },
    { name: "project 2" },
  ]);
});

test("getNoProjects", async () => {
  process.env.ELASTIC_INDEX = "hive-test";
  const mock = new Mock();
  const client = new Client({
    node: "http://localhost:9200",
    Connection: mock.getConnection(),
  });
  mock.add(
    {
      method: "GET",
      path: "/hive-test-projects/_search",
      querystring: { "from": "0", "size": "10"},
    },
    () => {
      return {
        body: {
          hits: [],
        },
      };
    }
  );
  const projects = await getProjects(client, {
    from: 0,
    size: 10,
  });
  expect(projects).toStrictEqual([]);
});

test("getStoredProject", async () => {
  process.env.ELASTIC_INDEX = "hive-test";
  const mock = new Mock();
  const client = new Client({
    node: "http://localhost:9200",
    Connection: mock.getConnection(),
  });
  mock.add(
    {
      method: "GET",
      path: "/hive-test-projects/_doc/1",
    },
    () => {
      return {
        body: { name: "project 1" },
      };
    }
  );
  const { status, message, project } = await getProject(client, "1");
  expect(status).toBe(200);
  expect(project).toStrictEqual({ name: "project 1" });
});

test("getMissingProject", async () => {
  process.env.ELASTIC_INDEX = "hive-test";
  const mock = new Mock();
  const client = new Client({
    node: "http://localhost:9200",
    Connection: mock.getConnection(),
  });
  const { status, message, project } = await getProject(client, "1");
  expect(status).toBe(404);
});
