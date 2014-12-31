var menus = {
  '2015/1/5': {
    breakfast: '納豆ごはん',
    lunch: 'そば',
    dinner: '手巻き寿司',
    others: []
  },
  '2015/1/10': {
    breakfast: null,
    lunch: 'パスタ',
    dinner: '茄子カレー',
    others: []
  }
};

function MenuDao() {

};
// MenuDao.prototype.findByDate = function(year, month, date, cb) {
//   cb({
//     breakfast: null,
//     lunch: null,
//     dinner: null,
//     others: []
//   });
// }

MenuDao.prototype.findByDate = function(year, month, date) {
  return menus[year + '/' + month + '/' + date] || {
    breakfast: '',
    lunch: '',
    dinner: '',
    others: []
  };
};
MenuDao.prototype.save = function(year, month, date, data) {
  menus[year + '/' + month + '/' + date] = data;
  return data;
};

module.exports = MenuDao;