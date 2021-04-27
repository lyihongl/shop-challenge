import { Request, Response } from "express";
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";

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
};
