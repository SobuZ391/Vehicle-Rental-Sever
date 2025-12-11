import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getVehicles);
router.get("/:vehicleId", vehicleControllers.getVehicleById);
router.put("/:vehicleId", auth(), vehicleControllers.updateVehicle);
router.delete("/:vehicleId", auth(), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
