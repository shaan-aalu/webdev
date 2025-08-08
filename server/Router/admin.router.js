import express from 'express';
import { createAdmin } from "../Controller/admin.controller.js"

const adminrouter = express.Router();

// Create a new admin
// POST /api/admins
adminrouter.post('/createAdmin', createAdmin);

export  {adminrouter};
