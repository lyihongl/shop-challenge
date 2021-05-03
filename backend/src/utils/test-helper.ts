import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { graphql } from "graphql";
import { buildSchema } from "type-graphql";
import { ImageResolver } from "../resolvers/images";
import { SearchTagResolver } from "../resolvers/searchTag";
import { UserResolver } from "../resolvers/user";
import { testConfig } from "../mikro-orm.config";
import { Maybe } from "graphql/jsutils/Maybe";

const testDbConnection = () => {
  return MikroORM.init({ ...testConfig, driver: PostgreSqlDriver });
};

interface Options {
  source: string;
  variableValues: Maybe<{
    [key: string]: any;
  }>;

}
const gCall = async ({ source, variableValues }: Options) => {
  const schema = await buildSchema({
    resolvers: [UserResolver, ImageResolver, SearchTagResolver],
    validate: false,
  });

  return graphql({
    schema,
    source,
    variableValues,
  });
};

export { testDbConnection, gCall };
