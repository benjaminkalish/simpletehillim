var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const tehilimObject = require('../tehilimObject');
var path = require('path');
const cors = require('cors');
// const app = express();

let tehilim;

(async () => {
  const tehilimArr = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'psalms.json')));
  const text = tehilimArr.text;
  tehilim = text.map((x, i) => { return tehilimObject(x, i); });
})();

router.use(cors());

// /* GET home page. */
// router.get('/', function (req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get('/perek/:num', function (req, res, next) {
  const perek = Number(req.params.num);
  if (perek < 1 || perek > 150 || isNaN(perek)) {
    return next('no such perek');
  }
    res.json(tehilim[perek - 1]);
});

router.get('/month/:num', function (req, res, next) {
  const day = Number(req.params.num);
  if (day < 1 || day > 30) {
    next('invalid day of month');
  }
  else {
    if (day === 25) {
      res.json({
        test: tehilim[118].text.slice(0, 96),
        dayMonth: 25,
        dayWeek: 6,
        sefer: 5
      });

    }
    else if (day === 26) {
      res.json({
        text: tehilim[118].text.slice(96),
        dayMonth: 26,
        dayWeek: 6,
        sefer: 5
      });
    }
    else {
      res.json(tehilim.filter((x) => x.dayMonth === day));
    }
  }
});

router.get('/week/:num', function (req, res, next) {
  const day = Number(req.params.num);
  if (day >= 1 && day <= 7){
    res.json(tehilim.filter(x => x.dayWeek === day));
  }
  next('invalid day of week');
});

router.get('/sefer/:num', function (req, res, next) {
  const sefer = Number(req.params.num);
  if (sefer >= 1 && sefer <= 5){
    res.json(tehilim.filter(x => x.sefer === sefer));
  }
  next('invalid day of week');
});

module.exports = router;