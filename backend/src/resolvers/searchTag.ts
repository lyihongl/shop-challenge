import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { ResolverContext } from "../types";
import { MyImage } from "../entities/Images";
import isAuth from "../middleware/isAuth";
import { LoadStrategy } from "@mikro-orm/core";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Resolver()
export class SearchTagResolver {
  @UseMiddleware(isAuth)
  @Query(() => [MyImage])
  async searchByTag(
    @Arg("searchQuery", () => [String]) searchQuery: string[],
    @Arg("isOr") isOr: boolean,
    @Ctx() { em, s3Client }: ResolverContext
  ) {
    console.log(searchQuery);
    // const tags = await em.find(MyTag, {
    //   $
    // })
    const tags = await em.find(
      MyImage,
      {
        $and: [
          { isPrivate: false },
          {
            $or: searchQuery.map((e) => {
              return {
                tags: { tag: { $like: `%${e}%` } },
              };
            }),
          },
        ],
      },
      {
        strategy: LoadStrategy.JOINED,
      }
    );
    await em.populate(tags, ["tags"]);
    await em.populate(tags, ["userid"]);
    if (!isOr) {
      console.log("newTags");
      const newTags: MyImage[] = [];
      tags.forEach((img) => {
        let imgTags: string[] = [];
        for (let i = 0; i < img.tags.length; i++) {
          imgTags.push(img.tags[i].tag);
        }
        for (let i = 0; i < searchQuery.length; i++) {
          if (!imgTags.includes(searchQuery[i])) {
            return;
          }
        }
        newTags.push(img);
      });
      return newTags;
    }
    const responseImages = await Promise.all(
      tags.map(
        (e) =>
          new Promise<MyImage>((resolve, reject) => {
            const getObject = new GetObjectCommand({
              Bucket: process.env.S3_BUCKET,
              Key: e.awsKey,
            });

            getSignedUrl(s3Client, getObject)
              .then((url) => {
                resolve({
                  ...e,
                  path: url,
                });
              })
              .catch((err) => reject(err));
          })
      )
    );
    return responseImages;
  }
}
