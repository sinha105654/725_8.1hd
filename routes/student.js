const express = require('express');

const router = express.Router();

router.get('/student', (req, res) => {

  res.json({
    name: 'Juhar Rafid',
    studentId: 's225654261'
  });

});

module.exports = router;