const router = require("express").Router();
import { basename } from "path";

const CONTROLLER_PATH = "../controller/" + basename(__filename);

router.get("/users", require(CONTROLLER_PATH).getUsers);
router.put("/user/:id", require(CONTROLLER_PATH).updateUser);
router.delete("/user/:id", require(CONTROLLER_PATH).deleteUser);

export default router;
