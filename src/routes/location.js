const router = require("express").Router();
import { basename } from "path";

import { imageUpload } from "../utils/imageUpload";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.get("/locations", require(CONTROLLER_PATH).getAllLocations);
router.post("/location", imageUpload, require(CONTROLLER_PATH).postLocation);

export default router;
