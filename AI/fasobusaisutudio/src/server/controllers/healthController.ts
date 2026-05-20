/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";

export function getHealth(req: Request, res: Response) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}
