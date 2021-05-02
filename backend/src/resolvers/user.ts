import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import jwt from "jsonwebtoken";
import { ResolverContext } from "../types";
import { User } from "../entities/User";
import { jwt_secret, __prod__ } from "../constants";
import isAuth from "../middleware/isAuth";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  me(@Ctx() { authJwt, res }: ResolverContext) {
    const token = jwt.sign(
      {
        userid: authJwt!.userid,
      },
      jwt_secret,
      { expiresIn: 60 * 60 * 24 * 30 }
    );

    res.cookie("authJwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: __prod__,
      sameSite: "lax",
      httpOnly: true,
      domain: "localhost",
      path: "/",
    });
    return authJwt!.userid;
  }
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, res }: ResolverContext
  ) {
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.constraint === "user_username_unique") {
        return {
          errors: [
            {
              field: "username",
              message: err.detail,
            },
          ],
        };
      }
    }
    console.log("user", user)
    const token = jwt.sign(
      {
        userid: user.id,
      },
      jwt_secret,
      { expiresIn: 60 * 60 * 24 * 30 }
    );

    res.cookie("authJwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: __prod__,
      sameSite: "lax",
      httpOnly: true,
      domain: "localhost",
      path: "/",
    });

    return { user };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { res, em }: ResolverContext
  ) {
    const user = await em.findOne(User, {
      username: options.username,
    });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "user does not exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "wrong password",
          },
        ],
      };
    }
    const token = jwt.sign(
      {
        userid: user.id,
      },
      jwt_secret,
      { expiresIn: 60 * 60 * 24 * 30 }
    );

    res.cookie("authJwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: __prod__,
      sameSite: "lax",
      httpOnly: true,
      domain: "localhost",
      path: "/",
    });

    return { user };
  }
}
