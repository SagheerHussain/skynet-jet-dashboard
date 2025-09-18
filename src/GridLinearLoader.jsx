// imports add karo
import { LinearProgress } from "@mui/material";
import { GridOverlay } from "@mui/x-data-grid";

// custom overlay
const GridLinearLoader = () => (
  <GridOverlay>
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

export default GridLinearLoader;
