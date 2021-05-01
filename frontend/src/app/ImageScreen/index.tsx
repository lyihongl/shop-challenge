import {
  Button,
  Grid,
  Dialog,
  AppBar,
  Tab,
  Tabs,
  Box,
  Typography,
} from "@material-ui/core";
import { createContext, useState } from "react";
import UploadImageModal from "./components/UploadImageModal";
import {
  MyImageFeed,
  AllImageFeed,
  SearchImages,
} from "./components/ImageFeed";

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const ShouldRefetchContext = createContext({
  shouldRefetch: false,
  setShouldRefetch: (b: boolean) => {},
});

const ImageScreen = () => {
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState(0);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const handleClose = (): void => {
    setOpenModal(false);
  };
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  return (
    <ShouldRefetchContext.Provider value={{ shouldRefetch, setShouldRefetch }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button onClick={() => setOpenModal(true)}>Upload Image</Button>
        </Grid>
        <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
          <UploadImageModal onClose={handleClose} />
        </Dialog>
      </Grid>
      <AppBar position="static">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="simple tabs example"
        >
          <Tab label="All Images" {...a11yProps(0)} />
          <Tab label="My Images" {...a11yProps(1)} />
          <Tab label="Search Images" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <AllImageFeed />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <MyImageFeed />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <SearchImages/>
      </TabPanel>
    </ShouldRefetchContext.Provider>
  );
};

export default ImageScreen;
