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
    height: "380px",
  },
  normal: {
    height: "380px",
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
    <Card className={isPrivate ? classes.isPrivate : classes.normal}>
      <div style={{ padding: "8px" }}>
        <Typography variant="h4">{title}</Typography>
        <div style={{ height: "250px" }}>
          <img style={{ maxWidth: "auto", maxHeight: "250px" }} src={src} />
        </div>
        <Typography variant="body1">{desc}</Typography>
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
