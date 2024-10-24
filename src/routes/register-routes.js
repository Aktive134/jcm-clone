const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parent.controller');
const upload = require('../middlewares/upload-file');
const validateFormSubmission  = require('../middlewares/validate-form');

router.post('/register', upload.fields([
  { name: 'picture_of_parent', maxCount: 1 },
  { name: 'children_images', maxCount: 5 },
  { name: 'caregiver_images', maxCount: 2 }
]), validateFormSubmission,  parentController.registerParent);

module.exports = router;
