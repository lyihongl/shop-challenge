import { ResolverContext } from "src/types";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

const isAuth: Middleware<ResolverContext> = ({ context }, next) => {
  console.log(context.req.cookies);
  if (!context.authJwt) {
    throw new Error("not auth");
  }
  return next();
};

export default isAuth;
