const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/devices", require(CONTROLLER_PATH).postDevice);
router.get("/dashboard/devices", require(CONTROLLER_PATH).dashboardDevice);


router.get("/devices/all*?", require(CONTROLLER_PATH).getAllDevices);

router.get("/devices/:mac/sensors/data", require(CONTROLLER_PATH).getDeviceDataSensors);
router.get("/devices/:mac/sensors", require(CONTROLLER_PATH).getDeviceData);
router.get("/devices/:mac*?", require(CONTROLLER_PATH).getDevice);
router.put("/devices/:mac", require(CONTROLLER_PATH).updateDevice);
router.delete("/devices/:mac", require(CONTROLLER_PATH).deleteDevice);

router.get("/data/:delete*?", require(CONTROLLER_PATH).test);

export default router;
