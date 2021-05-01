import { gql, useMutation } from "@apollo/client";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Switch,
  CircularProgress,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ShouldRefetchContext } from "../..";
import { useUploadImageMutation } from "../../../../generated/graphql";
import ImagePreview from "./ImagePreview";

type UploadResponse = {
  uploadImage: string;
};

const TEST_UPLOAD = gql`
  mutation uploadImage($file: Upload!) {
    uploadImage(file: $file) {
      filename
    }
  }
`;

const UploadImageModal = ({ onClose }: { onClose: () => void }) => {
  const [file, setFile] = useState<File | null>();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { shouldRefetch, setShouldRefetch } = useContext(ShouldRefetchContext);
  const handleImage = (acceptedFiles: File[]): void => {
    setFile(acceptedFiles[0]);
  };
  const [uploadImg] = useUploadImageMutation();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImage,
    multiple: false,
  });

  const onUpload = () => {
    setIsLoading(true);
    uploadImg({
      variables: {
        file,
        uploadInput: {
          tags: ["test", "test2"],
          title,
          desc,
          private: isPrivate,
        },
      },
    })
      .then(() => setIsLoading(false))
      .finally(() => {
        setShouldRefetch(!shouldRefetch);
        onClose();
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions style={{ padding: "16px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper
              {...getRootProps()}
              style={{ height: "100px", display: "flex", alignItems: "center" }}
            >
              <input
                {...getInputProps()}
                accept="image/x-png,image/gif,image/jpeg"
              />
              <div style={{ margin: "auto", textAlign: "center" }}>
                Drag and drop file, or click to add file
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            {file && <ImagePreview file={file} />}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              size="small"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              fullWidth
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            Keep image private:{" "}
            <Switch
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
          </Grid>
          <Grid item>
            <Button onClick={onUpload}>Upload</Button>
          </Grid>
          <Grid item>
            <Button onClick={onClose}>Cancel</Button>
          </Grid>
          <Grid item>{isLoading && <CircularProgress />}</Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

export default UploadImageModal;
