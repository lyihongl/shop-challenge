import {
  Card,
  CardMedia,
  CardContent,
  Paper,
  Grid,
  Typography,
  makeStyles,
  CardActionArea,
  CardActions,
  Button,
} from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles({
  isPrivate: {
    backgroundColor: "rgba(216, 221, 230, 1);",
  },
});

const ImageFrame = ({
  title,
  desc,
  src,
  isPrivate,
  onDelete,
}: {
  title: string;
  desc: string;
  src: string;
  isPrivate: boolean;
  onDelete?: () => void;
}) => {
  const classes = useStyles();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <Card className={isPrivate ? classes.isPrivate : ""}>
      <div style={{ padding: "8px", maxWidth: "300px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" style={{ overflowWrap: "break-word" }}>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ width: "300px" }}>
              <img
                style={{
                  maxHeight: "auto",
                  maxWidth: "300px",
                }}
                src={src}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{desc}</Typography>
          </Grid>
        </Grid>
        {isPrivate && (
          <div>
            <Typography variant="caption">
              Only you can see this image
            </Typography>
          </div>
        )}
      </div>
      {onDelete && (
        <CardActions>
          <Button size="small" onClick={() => setConfirmDelete(true)}>
            Delete Image
          </Button>

          {confirmDelete && (
            <>
              <Button size="small" style={{ color: "red" }} onClick={onDelete}>
                Confirm Delete
              </Button>
              <Button size="small" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default ImageFrame;
