const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/devices", require(CONTROLLER_PATH).post);
router.get("/devices/:mac*?", require(CONTROLLER_PATH).get);
router.get("/data", require(CONTROLLER_PATH).test);

export default router;
