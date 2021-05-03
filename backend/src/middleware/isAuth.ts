import { User } from "../entities/User";
import { ResolverContext } from "../types";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

const isAuth: Middleware<ResolverContext> = async ({ context }, next) => {
  try {
    await context.em.findOneOrFail(User, { id: context.authJwt?.userid });
  } catch (err) {
    throw new Error("not auth");
  }
  return next();
};

export default isAuth;
