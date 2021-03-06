import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { MyImage } from "./entities/Images";
import { MyTag } from "./entities/Tags";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User, MyImage, MyTag],
  dbName: "dev",
  host: process.env.POSTGRES_HOST,
  type: "postgresql",
  user: "postgres",
  password: "postgres",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

export const testConfig = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User, MyImage, MyTag],
  dbName: "test",
  host: process.env.POSTGRES_HOST,
  type: "postgresql",
  user: "postgres",
  password: "postgres",
  port: 5433,
} as Parameters<typeof MikroORM.init>[0];
