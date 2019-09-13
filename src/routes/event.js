const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.post("/events", require(CONTROLLER_PATH).postEvent);
router.get("/events/:name*?", require(CONTROLLER_PATH).getEvent);

export default router;
