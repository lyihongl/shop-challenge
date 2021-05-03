import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { testDbConnection } from "../../utils/test-helper";
import s3Client from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";

describe("image resolver", () => {
  let orm: MikroORM<PostgreSqlDriver>;
  beforeAll(async (done) => {
    orm = await testDbConnection();
    done();
  });
  beforeEach(async (done) => {
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().createSchema();
    await orm.getSchemaGenerator().updateSchema();
    done();
  });
  afterAll(async (done) => {
    await orm.close();
    done();
  });
  test("testing before each", () => {});
});
