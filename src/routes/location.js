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
router.get("/location/occupation", require(CONTROLLER_PATH).getOccupation);
router.get("/location/:id", require(CONTROLLER_PATH).showLocation);
router.put("/location/:id/occupation", require(CONTROLLER_PATH).updateOccupation);
router.get("/location/:id/devices", require(CONTROLLER_PATH).detailDevice);
router.delete("/location", require(CONTROLLER_PATH).deleteLocation);

router.get("/dashboard/location", require(CONTROLLER_PATH).dashboardLocation);

export default router;
