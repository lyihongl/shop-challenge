import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { ResolverContext } from "../types";
import { MyImage } from "../entities/Images";
import isAuth from "../middleware/isAuth";
import { ConstraintViolationException, LoadStrategy } from "@mikro-orm/core";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MyTag } from "../entities/Tags";
import deepcopy from "deepcopy";

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
    if (isOr) {
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
    } else {
      let tagMap: Record<string, Set<string>> = {};
      await Promise.all(
        searchQuery.map(
          (tag) =>
            new Promise((resolve, reject) => {
              console.log(tag);
              em.find(MyTag, {
                tag: { $like: `%${tag}%` },
              }).then((res) => {
                res.forEach((img) => {
                  if (!tagMap[tag]) {
                    tagMap[tag] = new Set();
                  }
                  tagMap[tag].add(img.imageid.id);
                });
                resolve(null);
              });
            })
        )
      );
      // console.log(tagMap);
      let intersected = [...tagMap[searchQuery[0]]];
      for (let key in tagMap) {
        if (key !== searchQuery[0]) {
          intersected = intersected.filter((x) => tagMap[key].has(x));
        }
      }
      const tags = await em.find(MyImage, {
        id: { $in: intersected },
      });
      await em.populate(tags, ["tags"]);
      await em.populate(tags, ["userid"]);
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
}
