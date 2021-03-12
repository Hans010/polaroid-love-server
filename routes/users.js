import express from "express";
import { } from '../controllers/users';

const router = express.Router();

router.post('/signIn', signIn);
router.post('/signUp', signUp);

export default router;