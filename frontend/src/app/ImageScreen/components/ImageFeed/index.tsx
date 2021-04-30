import { useGetAllImagesQuery } from "../../../../generated/graphql";

const ImageFeed = () => {
  const { loading, data, error } = useGetAllImagesQuery();
  console.log(data?.getAllImages);
  return (
    <>
      {data?.getAllImages.map((e) => {
        console.log("hello");
        return <img key={e.path} src={e.path} />;
      })}
    </>
  );
};

export default ImageFeed;
