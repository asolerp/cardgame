const express = require('express');
const router = express.Router();
const db = require('../db/database')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ hola: "hola"})
});

router.get('/api/card/:option_id', (req, res) => {
  const optionId = parseInt(req.params.option_id).toString()
  const card = db[optionId]
  res.send(card)
})

module.exports = router;
