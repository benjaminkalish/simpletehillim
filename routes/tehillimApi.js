var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const tehillimObject = require('../tehillimObject');
var path = require('path');
const cors = require('cors');
const HDate = require('@hebcal/core').HDate;

let tehillim;

(async () => {
  const tehillimArr = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'psalms.json')));
  const text = tehillimArr.text;
  tehillim = text.map((x, i) => { return tehillimObject(x, i); });
})();

router.use(cors());

router.get('/perek/:num', function (req, res, next) {
  const perek = Number(req.params.num);
  if (perek < 1 || perek > 150 || isNaN(perek)) {
    return next('no such perek');
  }
  res.json([tehillim[perek - 1]]);
});

router.get('/month/:num', function (req, res, next) {
  const day = Number(req.params.num);
  if (day < 1 || day > 30) {
    next('invalid day of month');
  }
  else {
    if (day === 25) {
      res.json([{
        test: tehillim[118].text.slice(0, 96),
        dayMonth: 25,
        dayWeek: 6,
        sefer: 5,
        perek: 118
      }]);

    }
    else if (day === 26) {
      res.json([{
        text: tehillim[118].text.slice(96),
        dayMonth: 26,
        dayWeek: 6,
        sefer: 5,
        perek: 118
      }]);
    }
    else if (day === 29) {
      const hebDay = new HDate(new Date());
      const isChaseir = hebDay.daysInMonth() === 29;
      res.json(tehillim.filter(x => x.dayMonth === day || (x.dayMonth === 30 && isChaseir)));
    }
    else {
      res.json(tehillim.filter(x => x.dayMonth === day));
    }
  }
});

router.get('/week/:num', function (req, res, next) {
  const day = Number(req.params.num);
  if (day < 1 || day > 7) {
    next('invalid day of week');
  }
  else {
    res.json(tehillim.filter(x => x.dayWeek === day));
  }
});

router.get('/sefer/:num', function (req, res, next) {
  const sefer = Number(req.params.num);
  if (sefer < 1 || sefer > 5) {
    next('invalid day of week');
  }
  else {
    res.json(tehillim.filter(x => x.sefer === sefer));
  }

});

module.exports = router;