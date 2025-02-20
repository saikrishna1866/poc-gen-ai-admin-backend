import express from 'express';
import seedQuestions from './seedQuestions.js';

const router = express.Router();
router.use('/seedQuestions', seedQuestions);

export default router;