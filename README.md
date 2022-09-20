# Node Typescript Serverless Example Microservice
Example Serverless Microservice built using Typescript, Node.js and Express

# Production

## Build
To build this package and run it in production we use [trace-pkg](https://github.com/FormidableLabs/trace-pkg) to optimize the generated files.

```
$ yarn build
```

## Deploy
Terraform scripts are provided to deploy on AWS using API Gateway, Lambda and DynamoDB

```
$ cd terraform
$ terraform init
$ terraform apply
```

## Docker
If you prefer, we also provide a containerized docker image.
For more details check the provided `Dockerfile`.

# Development

## Project Structure
```
> src              -> Source Folder
> src/api          -> API Controllers
> src/error        -> Standard Errors
> src/middleware   -> Express middlewares
> src/models       -> DB Objects definitions
> src/repositories -> DB Access Objects
> src/server       -> App Configuration
> src/service      -> Business Logic Layers
> src/utils        -> Utils functions
> tests            -> Unit and Integration Tests
> coverage         -> Jest coverage report is generated here
> build            -> Typescript build folder
> dist             -> Minified distribution package folder
> terraform        -> Terraform scripts to deploy on AWS
> package.json     -> App Manifest
```

## Run
Run app in development mode using default port `8080`
```
$ yarn dev
```

On a separate tab please run a local instance of DynamoDB using:
```
$ docker-compose up dynamodb
```

### Data
Run `seed-dynamodb.sh` to initialize with seed data from `acronyms.json`

## Docker
If you prefer, you can use `docker-compose --env-file .env.docker up` to launch both the local DynamoDB instance and the containerized version of this app.

## Lint
Lint and code style validation:

```
$ yarn lint
```

## Test
This project uses `Jest` to run test suites.

```
$ yarn test
```

### Coverage Report
Check `coverage` folder for more details.

```
 PASS  src/service/acronym/deleteAcronym.unit.ts (9.334 s)
 PASS  src/service/acronym/getAcronym.unit.ts (9.374 s)
 PASS  src/service/acronym/createAcronym.unit.ts (9.512 s)
 PASS  src/service/acronym/listAcronym.unit.ts (9.522 s)
 PASS  src/service/acronym/updateAcronym.unit.ts (9.616 s)
 PASS  tests/api/router/health.test.ts (9.508 s)
 PASS  tests/api/router/acronym.test.ts (11.522 s)
--------------------------|---------|----------|---------|---------|----------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|----------------------
All files                 |   89.42 |     82.4 |   80.64 |   89.42 |
 src                      |      90 |        0 |     100 |      90 |
  dynamodb.ts             |      90 |        0 |     100 |      90 | 5,8
 src/api/acronym          |     100 |      100 |     100 |     100 |
  acronym.router.ts       |     100 |      100 |     100 |     100 |
 src/api/acronym/request  |     100 |      100 |     100 |     100 |
  CreateAcronymRequest.ts |     100 |      100 |     100 |     100 |
  ListAcronymRequest.ts   |     100 |      100 |     100 |     100 |
  UpdateAcronymRequest.ts |     100 |      100 |     100 |     100 |
  index.ts                |     100 |      100 |     100 |     100 |
 src/api/health           |     100 |      100 |     100 |     100 |
  health.router.ts        |     100 |      100 |     100 |     100 |
 src/error                |   88.46 |    66.66 |   71.42 |   88.46 |
  errors.ts               |   88.46 |    66.66 |   71.42 |   88.46 | 21-23,28-30
 src/middleware           |   75.22 |    86.95 |   77.77 |   75.22 |
  cognito.ts              |   67.05 |     92.3 |   71.42 |   67.05 | 28,32-39,61-62,65-81
  errorHandler.ts         |     100 |    33.33 |     100 |     100 | 6-8
  validator.ts            |     100 |      100 |     100 |     100 |
 src/repositories         |   96.11 |    77.77 |     100 |   96.11 |
  acronym.ts              |   96.11 |    77.77 |     100 |   96.11 | 35-38
 src/server               |   69.89 |    22.22 |   33.33 |   69.89 |
  app.ts                  |   91.54 |    28.57 |     100 |   91.54 | 30-32,36-37,58
  local.ts                |       0 |        0 |       0 |       0 | 1-17
  serverless.ts           |       0 |        0 |       0 |       0 | 1-5
 src/service/acronym      |     100 |      100 |     100 |     100 |
  createAcronym.ts        |     100 |      100 |     100 |     100 |
  deleteAcronym.ts        |     100 |      100 |     100 |     100 |
  getAcronym.ts           |     100 |      100 |     100 |     100 |
  index.ts                |     100 |      100 |     100 |     100 |
  listAcronym.ts          |     100 |      100 |     100 |     100 |
  updateAcronym.ts        |     100 |      100 |     100 |     100 |
 src/utils                |     100 |      100 |     100 |     100 |
  loadRouters.ts          |     100 |      100 |     100 |     100 |
--------------------------|---------|----------|---------|---------|----------------------

Test Suites: 7 passed, 7 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        12.237 s, estimated 13 s
Ran all test suites.
✨  Done in 13.11s.
```