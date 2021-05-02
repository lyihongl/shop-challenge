import { Request, Response } from "express";
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";
import { S3Client } from "@aws-sdk/client-s3";

export type AuthJWT = {
  userid: string;
  iat: number;
  exp: number;
};

export type ResolverContext = {
  em: SqlEntityManager<PostgreSqlDriver> &
    EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
  authJwt: AuthJWT | null;
  s3Client: S3Client;
};

