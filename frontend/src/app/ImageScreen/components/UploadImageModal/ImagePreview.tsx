const ImagePreview = ({ file }: { file: File }) => {
  return <img style={{ maxHeight: "100px" }} src={URL.createObjectURL(file)} />;
};

export default ImagePreview;
