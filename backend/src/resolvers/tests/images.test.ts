import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { testDbConnection, gCall } from "../../utils/test-helper";
import util from "util";
import { ImageResolver } from "../images";
import s3Client from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { ResolverContext } from "../../types";
import { NextFn } from "type-graphql";
import * as isAuth from "../../middleware/isAuth";
import { User } from "../../entities/User";
import argon2 from "argon2";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    send: jest.fn(),
  };
});

jest.mock("../../middleware/isAuth", () => {
  return {
    default: jest.fn(),
  };
});

const DELETE_IMAGE = `
mutation deleteImage($awsKey: String!){
    deleteImage(awsKey: $awsKey)
}
`;

describe("image resolver", () => {
  let orm: MikroORM<PostgreSqlDriver>;
  let testUser;
  beforeAll(async (done) => {
    orm = await testDbConnection();
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().createSchema();
    await orm.getSchemaGenerator().updateSchema();
    // testUser = orm.em.create(User, {
    //   username: "test",
    //   password: argon2.hash("test"),
    // });
    // await orm.em.persistAndFlush(testUser);
    done();
  });
  beforeEach(async (done) => {
    done();
  });
  afterAll(async (done) => {
    await orm.close();
    done();
  });
  test("testing", async () => {
    console.log(
      util.inspect(
        await gCall({
          source: DELETE_IMAGE,
          variableValues: {
            awsKey: "test",
          },
        }),
        { showHidden: false, depth: null }
      )
    );
  });
});
