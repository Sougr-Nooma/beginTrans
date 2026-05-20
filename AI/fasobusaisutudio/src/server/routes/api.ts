/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { getHealth } from "../controllers/healthController";

const router = Router();

// Health check endpoint
router.get("/health", getHealth);

export default router;
