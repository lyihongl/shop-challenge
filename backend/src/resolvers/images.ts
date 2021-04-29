import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import isAuth from "../middleware/isAuth";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { ResolverContext } from "src/types";
import fs, { ReadStream } from "fs";
import { PassThrough } from "stream";

export type UploadFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

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

@Resolver()
export class ImageResolver {
  //   @UseMiddleware(isAuth)
  @Mutation(() => String)
  async uploadImage(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Ctx() { s3Client }: ResolverContext
  ) {
    // console.log(file);

    // const stream = new PassThrough()
    // const stream2 = new PassThrough();
    const res = await new Promise((resolve, reject) => {
      let buffer: Buffer[] = [];
      const s = file.createReadStream();
      s.on("data", (d: Buffer) => {
        buffer.push(d);
      }).on("close", () => {
        const uploadParams: PutObjectCommandInput = {
          Bucket: "shop-challenge",
          Key: file.filename,
          ACL: "public-read",
          Body: Buffer.concat(buffer),
        };
        const obj = new PutObjectCommand(uploadParams);
        return s3Client
          .send(obj)
          .then(() => {
            resolve("ok");
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
