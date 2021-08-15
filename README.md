[![Continuous Integration](https://github.com/fozziethebeat/next-hive/actions/workflows/integration.yaml/badge.svg)](https://github.com/fozziethebeat/next-hive/actions)

## About

This package is an attempt to rewrite the [Hive Crowdsourcing](https://github.com/nytlabs/hive) platform.  This makes a suite of useful changes:

  - Updates to use Elastic Search 7.x rather than 1.x
  - Runs in Node JS (using [Next.JS](https://nextjs.org/)) rather than Go.
  - Breaks the implementation into serverless methods that are hopefully easier to run and manage.
  - Adds unittesting and continuous integration.
  - Includes more refined documentation of the API and libraries.

## Getting Started

NOTE: This guide covers just local developing on a sandbox.  Later, we'll write
how to setup a real environment.

First, as a pre-setup, you'll need a local ElasticSearch service.  We recommend
using ElasticSearch's docker setup:

```bash
docker run -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  docker.elastic.co/elasticsearch/elasticsearch:7.13.4
```

Next, run a local instance and poke around at it:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and test the various endpoints.

### Testing

We've setup unittesting with [Jest](https://jestjs.io/):

```bash
npm run test
```

### Re-creating documentation

We use [TypeDoc](https://typedoc.org/) to auto-generate documentation:

```bash
npm run doc
```

## Conversion Status

| Path | Implementation | Testing | Documentation |
| ---- | ------ | ------ | ----- |
| `/admin/setup`| :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `/admin/projects` | :x: | :x: | :x: |
| `/admin/projects/{project_id}` | :x: | :x: | :x: |
| `/admin/projects/{project_id}/assets` | :x: | :x: | :x: |
| `/admin/projects/{project_id}/assignments` | :x: | :x: | :x: |
| `/admin/projects/{project_id}/tasks` | :x: | :x: | :x: |
| `/admin/projects/{project_id}/tasks/{task_id}` | :x: | :x: | :x: |
| `/admin/projects/{project_id}/tasks/{task_id}/complete` | :x: | :x: | :x: |
| `/admin/projects/{project_id}/users` | :x: | :x: | :x: |
| `/admin/projects/{project_id}/users{user_id}` | :x: | :x: | :x: |
| `/projects/{project_id}` | :x: | :x: | :x: |
| `/projects/{project_id}/assets/{asset_id}` | :x: | :x: | :x: |
| `/projects/{project_id}/assets/{asset_id}/favorite` | :x: | :x: | :x: |
| `/projects/{project_id}/assignments/{assignment}` | :x: | :x: | :x: |
| `/projects/{project_id}/tasks` | :x: | :x: | :x: |
| `/projects/{project_id}/tasks/{task_id}` | :x: | :x: | :x: |
| `/projects/{project_id}/tasks/{task_id}/assets/{asset_id}/assignments` | :x: | :x: | :x: |
| `/projects/{project_id}/tasks/{task_id}/assignments` | :x: | :x: | :x: |
| `/projects/{project_id}/user` | :x: | :x: | :x: |
| `/projects/{project_id}/user/external` | :x: | :x: | :x: |
| `/projects/{project_id}/user/favorites` | :x: | :x: | :x: |
