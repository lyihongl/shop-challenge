import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { testConfig } from "../mikro-orm.config";

export const testDbConnection = () => {
  return MikroORM.init({ ...testConfig, driver: PostgreSqlDriver });
};
