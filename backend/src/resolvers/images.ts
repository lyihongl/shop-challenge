import {
  DeleteObjectCommand,
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
import { MyImage } from "../entities/Images";
import { MyTag } from "../entities/Tags";
import * as tf from "@tensorflow/tfjs-node";
import * as mobilenet from "@tensorflow-models/mobilenet";

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

  @Field(() => [String])
  tags: string[];
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
const awsPrefix = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/`;

const generateTags = async (
  img:
    | tf.Tensor3D
    | ImageData
    | HTMLImageElement
    | HTMLCanvasElement
    | HTMLVideoElement,
  topk?: number | undefined
) => {
  const mobilenetModel = await mobilenet.load();
  const predictions = await mobilenetModel.classify(img);
  console.log("PREDICTIONS", predictions);
  return predictions;
};

@Resolver()
export class ImageResolver {
  @UseMiddleware(isAuth)
  @Query(() => [MyImage])
  async getMyImages(@Ctx() { s3Client, em, authJwt }: ResolverContext) {
    try {
      const images = await em.find(MyImage, {
        userid: authJwt!.userid,
      });
      await em.populate(images, ["userid"]);
      // let responseImages = deepcopy(images);

      const responseImages = await Promise.all(
        images.map(
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
    } catch (e) {
      throw e;
    }
  }

  @UseMiddleware(isAuth)
  @Query(() => [MyImage])
  async getAllImages(@Ctx() { s3Client, em, authJwt }: ResolverContext) {
    try {
      const images = await em.find(MyImage, {
        $or: [{ isPrivate: false }, { userid: authJwt!.userid }],
      });
      await em.populate(images, ["userid"]);
      // let responseImages = deepcopy(images);

      const responseImages = await Promise.all(
        images.map(
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
    } catch (e) {
      throw e;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteImage(
    @Arg("awsKey") awsKey: string,
    @Ctx() { s3Client, em, authJwt }: ResolverContext
  ) {
    const image = await em.findOne(MyImage, { awsKey });
    if (authJwt?.userid && image?.userid.id === authJwt.userid) {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: awsKey })
      );

      await em.getRepository(MyImage).remove(image!).flush();
      return true;
    }
    return false;
  }
  @UseMiddleware(isAuth)
  @Mutation(() => UploadFileResponse)
  async uploadImage(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Arg("uploadInput") uploadInput: UploadImgInput,
    @Ctx() { s3Client, em, authJwt }: ResolverContext
  ) {
    // const imgData = tfnode.node.decodeImage(file.arrayB, 3);
    // console.log("a");
    // await generateTags(imgData);
    // console.log("b");
    const img = em.create(MyImage, {
      userid: authJwt!.userid,
      title: uploadInput.title,
      desc: uploadInput.desc,
      isPrivate: uploadInput.private,
    });
    const awsKey = img.id + "-" + file.filename;
    img.path = awsPrefix + awsKey;
    img.awsKey = awsKey;

    const tags = uploadInput.tags.map((tag) => {
      return em.create(MyTag, {
        imageid: img,
        tag: tag,
        userid: authJwt!.userid,
      });
    });
    console.log("prefix", awsPrefix);
    await em.persistAndFlush(img);
    await em.persistAndFlush(tags);
    const res = await new Promise<UploadFileResponse>((resolve, reject) => {
      let buffer: Buffer[] = [];
      const s = file.createReadStream();
      s.on("data", (d: Buffer) => {
        buffer.push(d);
      }).on("close", () => {
        const imgData = tf.node.decodeImage(
          Buffer.concat(buffer),
          3
        ) as tf.Tensor3D;
        generateTags(imgData);
        const uploadParams: PutObjectCommandInput = {
          Bucket: process.env.S3_BUCKET,
          Key: awsKey,
          Body: Buffer.concat(buffer),
        };
        const obj = new PutObjectCommand(uploadParams);
        console.log("aws abt to return");
        return s3Client
          .send(obj)
          .then((res) => {
            console.log("aws res", res);
            resolve({
              filename: "",
              encoding: "",
              mimetype: "",
              url: awsPrefix + awsKey,
            });
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    });

    return res;
  }
}
