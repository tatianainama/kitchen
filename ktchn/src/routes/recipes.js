var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');

var recipes = nano.db.use('recipes');
/* GET users listing. */
router.get('/', function(req, res, next) {
  recipes.list({ include_docs: true }, (err, body) => {
    if (err) {
      console.log('error');
      res.send('error', err);
    } else {
      console.log('asdf', body);
      res.send(body.rows)
    }
  })

});

module.exports = router;
