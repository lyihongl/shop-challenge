import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
const UploadImageModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions style={{ padding: "16px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button>
              Choose file
              <input type="file" hidden />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button>Upload</Button>
          </Grid>
          <Grid item>
            <Button onClick={onClose}>Cancel</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

export default UploadImageModal;
