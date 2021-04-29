import { Button, Grid, Dialog } from "@material-ui/core";
import { useState } from "react";
import UploadImageModal from "./components/UploadImageModal";

const ImageScreen = () => {
  const [openModal, setOpenModal] = useState(false);
  const handleClose = (): void => {
    setOpenModal(false);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button onClick={() => setOpenModal(true)}>Upload Image</Button>
      </Grid>
      <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
        <UploadImageModal onClose={handleClose} />
      </Dialog>
    </Grid>
  );
};

export default ImageScreen;
