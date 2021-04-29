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
import fs from "fs";
import {
  ListObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { exec } from "child_process";
import { ImageResolver } from "./resolvers/images";
import { graphqlUploadExpress } from "graphql-upload";

const main = async () => {
  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA37M3RY6GDTI3HVO7",
      secretAccessKey: "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",
    },
  });
  // const data = await s3Client.send(
  //   new ListObjectsCommand({ Bucket: "shop-challenge" })
  // );
  // console.log(data);
  const img = fs.createReadStream("./test.jpg");
  // console.log(img);
  // await fs.readFile("./test.jpg", (err, data) => {
  //   console.log(data);
  // });
  let uploadParams: PutObjectCommandInput = {
    Bucket: "shop-challenge",
    Key: "test.jpg",
    ACL: "public-read",
    Body: img,
    // GrantRead: 'true',
  };

  const obj = new PutObjectCommand(uploadParams);
  console.log(obj);
  // const data = await s3Client.send(obj);
  // console.log(data)
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
    resolvers: [UserResolver, ImageResolver],
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
  app.use(graphqlUploadExpress({ maxFieldSize: 1000000000000000, maxFiles: 10 }));
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000);
};

main();
