const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/locations", require(CONTROLLER_PATH).postLocation);
router.get("/locations/:name*?", require(CONTROLLER_PATH).getLocation);
router.put("/locations/:name", require(CONTROLLER_PATH).updateLocation);
router.delete("/locations/:name", require(CONTROLLER_PATH).deleteLocation);

export default router;
