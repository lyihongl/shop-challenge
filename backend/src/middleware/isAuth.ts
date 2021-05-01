import { User } from "../entities/User";
import { ResolverContext } from "src/types";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

const isAuth: Middleware<ResolverContext> = async ({ context }, next) => {
  // if (context.authJwt) {
  try {
    await context.em.findOneOrFail(User, { id: context.authJwt?.userid });
  } catch (err) {
    throw new Error("not auth");
  }
  // } else {
  //   throw new Error("not auth");
  // }
  return next();
};

export default isAuth;
