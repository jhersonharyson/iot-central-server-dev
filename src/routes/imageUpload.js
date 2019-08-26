const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/posts", require(CONTROLLER_PATH).post);

export default router;
