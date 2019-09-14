const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/actuators", require(CONTROLLER_PATH).postActuator);
router.get("/actuators/:name*?", require(CONTROLLER_PATH).getActuator);

export default router;
