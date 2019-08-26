const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.get("/", require(CONTROLLER_PATH).status);

export default router;
