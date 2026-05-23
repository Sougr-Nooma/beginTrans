/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import authRoutes from "./auth";

const router = Router();

// Health check endpoint
router.get("/health", getHealth);

// Auth endpoints for client and company
router.use("/auth", authRoutes);

export default router;
