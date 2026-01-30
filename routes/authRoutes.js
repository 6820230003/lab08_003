// const express = require('express');
import express from "express"
const router = express.Router();


import { register, login ,refresh } from '../controllers/authControllers.js';

router.post('/register',register);
router.post('/login',login);
router.post('/refresh',refresh);

export default router;