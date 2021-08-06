import { Client } from "@elastic/elasticsearch";
import Mock from "@elastic/elasticsearch-mock";

import { handlerImpl, SetupBody } from "../../../lib/api/admin/setup";
import type { Project, ProjectChild, Task, Asset } from "../../../types";

test("adminSetupNewIndex", async () => {
  process.env.ELASTIC_INDEX = "hive-test";
  const mock = new Mock();
  const client = new Client({
    node: "http://localhost:9200",
    Connection: mock.getConnection()
  });
  const project = {
    name: "Test-Project",
  };
  const tasks = [{}, {}];
  const assets = [{}, {}];
  const setupBody = { project, tasks, assets };

  // Create Indices.
  mock.add(
    {
      method: "PUT",
      path: "/hive-test-projects",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "PUT",
      path: "/hive-test-tasks",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "PUT",
      path: "/hive-test-assets",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "PUT",
      path: "/hive-test-assignments",
    },
    () => {
      return { status: "ok" };
    }
  );

  // Index data.
  mock.add(
    {
      method: "PUT",
      path: "/hive-test-projects/_doc/*",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "POST",
      path: "/_bulk",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "POST",
      path: "/_bulk",
    },
    () => {
      return { status: "ok" };
    }
  );

  const { status, message } = await handlerImpl(client, setupBody);
  expect(status).toBe(200);
});

test("adminSetupSkipsExistingIndex", async () => {
  process.env.ELASTIC_INDEX = "hive-test";
  const mock = new Mock();
  const client = new Client({
    node: "http://localhost:9200",
    Connection: mock.getConnection(),
  });
  const project = {
    name: "Test-Project",
  };
  const tasks = [{}, {}];
  const assets = [{}, {}];
  const setupBody = { project, tasks, assets };

  mock.add(
    {
      method: "HEAD",
      path: "/hive-test-projects",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "HEAD",
      path: "/hive-test-tasks",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "HEAD",
      path: "/hive-test-assets",
    },
    () => {
      return { status: "ok" };
    }
  );
  mock.add(
    {
      method: "HEAD",
      path: "/hive-test-assignments",
    },
    () => {
      return { status: "ok" };
    }
  );

  const { status, message } = await handlerImpl(client, setupBody);
  expect(status).toBe(200);
});
