import { ApolloQueryResult } from "@apollo/client";
import { Grid } from "@material-ui/core";
import { useState } from "react";
import {
  Exact,
  GetAllImagesQuery,
  GetMyImagesQuery,
  useDeleteImageMutation,
  useGetAllImagesQuery,
  useGetMyImagesQuery,
} from "../../../../generated/graphql";
import ImageFrame from "./ImageFrame";

interface DataType {
  awsKey: string;
  path: string;
  title: string;
  desc: string;
  isPrivate: boolean;
}

const ImageFeed = ({
  data,
  enableDelete,
  refetch,
}: {
  data: DataType[] | undefined;
  enableDelete: boolean;
  refetch: () => void;
}) => {
  const [deleteImage] = useDeleteImageMutation();
  return (
    <Grid container spacing={2}>
      {data?.map((e) => {
        return (
          <Grid key={e.awsKey} item>
            <ImageFrame
              src={e.path}
              title={e.title}
              desc={e.desc}
              isPrivate={e.isPrivate}
              onDelete={
                enableDelete
                  ? () => {
                      deleteImage({ variables: { awsKey: e.awsKey } });
                      refetch();
                    }
                  : undefined
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const AllImageFeed = () => {
  const { loading, data, error, refetch } = useGetAllImagesQuery();
  refetch();

  return (
    <ImageFeed
      data={data?.getAllImages}
      enableDelete={false}
      refetch={() => refetch()}
    />
  );
};
const MyImageFeed = () => {
  const { loading, data, error, refetch } = useGetMyImagesQuery();
  refetch();

  return (
    <ImageFeed
      data={data?.getMyImages}
      enableDelete={true}
      refetch={() => {
        console.log("calling refetch");
        refetch();
      }}
    />
  );
};

export default ImageFeed;
export { AllImageFeed, MyImageFeed };
