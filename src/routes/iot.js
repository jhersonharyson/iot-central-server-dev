const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/iot", require(CONTROLLER_PATH).post);
router.get("/iot", require(CONTROLLER_PATH).test);
router.get("/data", require(CONTROLLER_PATH).get);

export default router;
