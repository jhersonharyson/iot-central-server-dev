const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/sensors", require(CONTROLLER_PATH).postSensor);
router.get("/sensors/:mac*?", require(CONTROLLER_PATH).getSensor);
router.put("/sensors/:mac", require(CONTROLLER_PATH).updateSensor);
router.delete("/sensors/:mac", require(CONTROLLER_PATH).deleteSensor);

export default router;
