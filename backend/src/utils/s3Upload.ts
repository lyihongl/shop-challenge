import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import internal from "stream";

export interface s3UploadParams {
  Key: string;
  Body:
    | string
    | internal.Readable
    | ReadableStream<any>
    | Blob
    | Uint8Array
    | Buffer
    | undefined;
  ACL?: string | undefined;
}

const s3Upload = (client: S3Client, params: s3UploadParams) => {
  const uploadParams: PutObjectCommandInput = {
    ...params,
    Bucket: "shop-container",
  };
  client.send(new PutObjectCommand(uploadParams));
};

export default s3Upload;
