const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.get("/auth/iot/:mac", require(CONTROLLER_PATH).iot);
router.post("/auth/signin", require(CONTROLLER_PATH).signin);
router.post("/auth/signup", require(CONTROLLER_PATH).signup);
router.get("/auth/users", require(CONTROLLER_PATH).users);
router.get("/auth/verify", require(CONTROLLER_PATH).verify);

export default router;
