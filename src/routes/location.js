const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.get("/locations", require(CONTROLLER_PATH).getAllLocations);

export default router;
