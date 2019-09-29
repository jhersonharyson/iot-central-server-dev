const router = require("express").Router();
import { basename } from "path";

import { imageUpload } from "../utils/imageUpload";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.get("/locations", require(CONTROLLER_PATH).getAllLocations);
router.post(
  "/location_with_upload",
  imageUpload,
  require(CONTROLLER_PATH).postLocation
);
router.post("/location", require(CONTROLLER_PATH).postLocation);
router.put("/location", require(CONTROLLER_PATH).updateLocation);
router.delete("/location", require(CONTROLLER_PATH).deleteLocation);

export default router;
