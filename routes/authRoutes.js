// const express = require('express');
import express from "express"
const router = express.Router();


import { register } from '../controllers/authControllers.js';

router.post('/register',register);

export default router;