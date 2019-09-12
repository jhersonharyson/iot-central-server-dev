const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/devices", require(CONTROLLER_PATH).postDevice);
router.get("/devices/:mac*?", require(CONTROLLER_PATH).getDevice);
router.put("/devices/:mac", require(CONTROLLER_PATH).updateDevice);
router.delete("/devices/:mac", require(CONTROLLER_PATH).deleteDevice);

router.get("/data", require(CONTROLLER_PATH).test);

export default router;
