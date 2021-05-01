import { ApolloQueryResult } from "@apollo/client";
import { Grid } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { ShouldRefetchContext } from "../..";
import { SearchImages } from "./SearchImages";
import {
  Exact,
  GetAllImagesQuery,
  GetMyImagesQuery,
  MyImage,
  useDeleteImageMutation,
  useGetAllImagesQuery,
  useGetMyImagesQuery,
  User,
} from "../../../../generated/graphql";
import ImageFrame from "./ImageFrame";

interface DataType {
  awsKey: string;
  path: string;
  title: string;
  desc: string;
  isPrivate: boolean;
}

interface DataTypeTags extends DataType {
  userid?: {
    username: string;
  };
  tags?: { tag: string }[];
}

const ImageFeed = ({
  data,
  enableDelete,
}: {
  data: DataTypeTags[] | undefined;
  enableDelete: boolean;
}) => {
  const [deleteImage] = useDeleteImageMutation();
  const { shouldRefetch, setShouldRefetch } = useContext(ShouldRefetchContext);
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
                      deleteImage({ variables: { awsKey: e.awsKey } }).then(
                        () => {
                          setShouldRefetch(!shouldRefetch);
                        }
                      );
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
  const { shouldRefetch } = useContext(ShouldRefetchContext);
  useEffect(() => {
    refetch();
  }, [shouldRefetch]);

  return <ImageFeed data={data?.getAllImages} enableDelete={false} />;
};
const MyImageFeed = () => {
  const { loading, data, error, refetch } = useGetMyImagesQuery();
  const { shouldRefetch } = useContext(ShouldRefetchContext);
  useEffect(() => {
    refetch();
  }, [shouldRefetch]);

  return <ImageFeed data={data?.getMyImages} enableDelete={true} />;
};

export default ImageFeed;
export { AllImageFeed, MyImageFeed, SearchImages };
