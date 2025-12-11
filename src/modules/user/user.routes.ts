import express from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userControllers.createUser);
router.get("/", logger, auth(), userControllers.getUser);
router.get("/:userId", auth(), userControllers.getSingleUser);
router.put("/:userId", auth(), userControllers.updateUser);
router.delete("/:userId", auth(), userControllers.deleteUser);

export const userRoutes = router;
