import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./resolvers/user";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { jwt_secret } from "./constants";

const main = async () => {
  const orm = await MikroORM.init({ ...mikroConfig, driver: PostgreSqlDriver });
  await orm.getMigrator().up();
  const app = express();
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:300",
      credentials: true,
    })
  );
  app.use(cookieParser());

  const graphqlScheme = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });
  const apolloServer = new ApolloServer({
    schema: graphqlScheme,
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
      authJwt: req.cookies.authJwt
        ? jwt.verify(req.cookies.authJwt, jwt_secret)
        : null,
    }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000);
};

main();
