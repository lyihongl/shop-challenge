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
import { S3Client } from "@aws-sdk/client-s3";
import { ImageResolver } from "./resolvers/images";
import { graphqlUploadExpress } from "graphql-upload";
import { SearchTagResolver } from "./resolvers/searchTag";

const main = async () => {
  if (
    process.env.AWS_ACCESS_KEY === undefined ||
    process.env.AWS_SECRET === undefined ||
    process.env.S3_REGION === undefined ||
    process.env.S3_BUCKET === undefined
  ) {
    throw new Error("Missing environment variables for aws");
  }
  console.log(process.env.S3_BUCKET);
  const s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET!,
    },
  });
  const orm = await MikroORM.init({ ...mikroConfig, driver: PostgreSqlDriver });
  await orm.getMigrator().up();
  const app = express();
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser());

  const graphqlScheme = await buildSchema({
    resolvers: [UserResolver, ImageResolver, SearchTagResolver],
    validate: false,
  });
  const apolloServer = new ApolloServer({
    schema: graphqlScheme,
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
      s3Client,
      authJwt: req.cookies.authJwt
        ? jwt.verify(req.cookies.authJwt, jwt_secret)
        : null,
    }),
    uploads: false,
  });
  // cosplay [name of service i forget] with 25mb file limit
  app.use(graphqlUploadExpress({ maxFileSize: 2.5e7, maxFiles: 10 }));
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000);
};

main();
