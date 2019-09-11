const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/devices", require(CONTROLLER_PATH).post);
router.get("/devices", require(CONTROLLER_PATH).test);
router.get("/data", require(CONTROLLER_PATH).get);

export default router;
