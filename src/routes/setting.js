const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/settings", require(CONTROLLER_PATH).postSetting);
router.get("/settings/:name*?", require(CONTROLLER_PATH).getSetting);
router.put("/settings/:name", require(CONTROLLER_PATH).updateSetting);
router.delete("/settings/:name", require(CONTROLLER_PATH).deleteSetting);

export default router;
