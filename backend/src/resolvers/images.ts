import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import isAuth from "../middleware/isAuth";
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
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { ResolverContext } from "src/types";
import fs, { ReadStream } from "fs";
import { PassThrough } from "stream";
import { MyImage } from "../entities/Images";

@ObjectType()
export class UploadFileResponse {
  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  encoding: string;

  @Field()
  url: string;
}

// @ObjectType()
// export class PaginatedResponse<T> {
//   @Field()
//   data: T[];

//   @Field
// }

@InputType()
export class UploadImgInput {
  @Field()
  title: string;
  @Field()
  desc: string;
  @Field()
  private: boolean;
}
// @InputType()
// export class File {
//   @Field()
//   filename: String;
//   @Field()
//   mimetype: String;
//   @Field()
//   encoding: String;
//   @Field()
//   picture: GraphQLUpload;
// }
const awsPrefix = "https://shop-challenge.s3.amazonaws.com/";

@Resolver()
export class ImageResolver {
  @UseMiddleware(isAuth)
  @Query(() => [MyImage])
  async getAllImages(@Ctx() { s3Client, em, authJwt }: ResolverContext) {
    try {
      const images = await em.find(MyImage, {
        $or: [{ isPrivate: false }, { userid: authJwt!.userid }],
      });
      await em.populate(images, ["userid"]);
      images.forEach((e) => {
        if (e.isPrivate) {
          const getObject = new GetObjectCommand({
            Bucket: "shop-challenge",
            Key: e.awsKey,
          });
          getSignedUrl(s3Client, getObject).then((url) => (e.path = url));
        }
      });
      // const url = await getSignedUrl(s3Client, getObject);
      // images[1].path = url;
      // console.log(url);
      // console.log(images);
      return images;
    } catch (e) {
      throw e;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => UploadFileResponse)
  async uploadImage(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Arg("uploadInput") uploadInput: UploadImgInput,
    @Ctx() { s3Client, em, authJwt }: ResolverContext
  ) {
    const img = em.create(MyImage, {
      userid: authJwt!.userid,
      title: uploadInput.title,
      desc: uploadInput.desc,
      isPrivate: uploadInput.private,
    });
    const awsKey = img.id + "-" + file.filename;
    img.path = awsPrefix + awsKey;
    img.awsKey = awsKey;
    await em.persistAndFlush(img);
    // console.log(img)
    const res = await new Promise<UploadFileResponse>((resolve, reject) => {
      let buffer: Buffer[] = [];
      const s = file.createReadStream();
      s.on("data", (d: Buffer) => {
        buffer.push(d);
      }).on("close", () => {
        const uploadParams: PutObjectCommandInput = {
          Bucket: "shop-challenge",
          Key: awsKey,
          ACL: uploadInput.private ? undefined : "public-read",
          Body: Buffer.concat(buffer),
        };
        const obj = new PutObjectCommand(uploadParams);
        return s3Client
          .send(obj)
          .then(() => {
            resolve({
              filename: "",
              encoding: "",
              mimetype: "",
              url: awsPrefix + awsKey,
            });
          })
          .catch((e) => {
            reject(e);
          });
      });
    });

    // const uploadStream = () => {
    //   const pass = new PassThrough();
    //   const uploadParams: PutObjectCommandInput = {
    //     Bucket: "shop-challenge",
    //     Key: "test.jpg",
    //     ACL: "public-read",
    //     Body: pass,
    //   };
    //   return {
    //     writeStream: pass,
    //     promise: s3Client.send(new PutObjectCommand(uploadParams)),
    //   };
    // };

    // file.createReadStream().pipe(writeStre)
    // const { writeStream, promise } = uploadStream();
    // const pipeline = file.createReadStream().pipe(writeStream);
    // return promise
    //   .then(() => {
    //     return "ok";
    //   })
    //   .catch((e) => {
    //     throw e;
    //   });
    // const img = file.createReadStream();
    // console.log(img);
    // return new Promise((resolve, reject) => {
    //   file
    //     .createReadStream()
    //     .pipe(createWriteStream(__dirname + `/${file.filename}`))
    //     .on("finish", () => resolve("ok"))
    //     .on("error", () => reject("nope"));
    // });
    return res;
  }
}
