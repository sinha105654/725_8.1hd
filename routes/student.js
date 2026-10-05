const express = require('express');

const router = express.Router();

router.get('/student', (req, res) => {
  res.json({
    name: 'Yousuf Sinha',
    studentId: 's226032987'
  });
});

module.exports = router;
