// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateInterviewQuestions } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate-questions', protect, generateInterviewQuestions);

module.exports = router;
