// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateConceptExplanation } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate-explanation',protect,generateConceptExplanation);

module.exports = router;
