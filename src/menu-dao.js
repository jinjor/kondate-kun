var repertories = {
  '手巻き寿司': { fav: true, name: '手巻き寿司'  },
  'パスタ': { fav: true, name: 'パスタ'  },
  '茄子カレー': { fav: true, name: '茄子カレー'  }
};

var days = {
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
MenuDao.prototype.getAllRepertory = function() {
  var _menus = {};
  Object.keys(repertories).forEach(function(name) {
    var data = repertories[name];
    _menus[name] = data;//TODO clone
    _menus[name].days = [];
  });
  Object.keys(days).forEach(function(date) {
    var data = days[date];
    ['breakfast', 'lunch', 'dinner'].forEach(function(key) {
      var name = data[key];
      if(name) {
        if(!_menus[name]) {
          _menus[name] = (this._findMenuDetailOrDefault(name));
          _menus[name].days = [];
        }
        _menus[name].days.push(date);
      }
    }.bind(this));
    return data;
  }.bind(this));
  return Object.keys(_menus).map(function(name) {
    return _menus[name];
  });
};
MenuDao.prototype._findMenuDetailOrDefault = function(name) {
  return repertories[name] || {fav: false, name: name};
};
MenuDao.prototype.findByDate = function(year, month, date) {
  var day = days[year + '/' + month + '/' + date] || {
    breakfast: '',
    lunch: '',
    dinner: '',
    others: []
  };
  var data = {};
  ['breakfast', 'lunch', 'dinner'].forEach(function(key) {
    data[key] = this._findMenuDetailOrDefault(day[key]);
  }.bind(this));
  data.others = day.others;
  return data;
};
MenuDao.prototype._saveMenu = function(menu) {
  if(menu.fav) {
    repertories[menu.name] = menu;
  } else {
    delete repertories[menu.name];
  }
};
MenuDao.prototype._saveDay = function(year, month, date, data) {
  days[year + '/' + month + '/' + date] = data;
};
MenuDao.prototype.save = function(year, month, date, data) {
  this._saveMenu(data.breakfast);
  this._saveMenu(data.lunch);
  this._saveMenu(data.dinner);
  this._saveDay(year, month, date, {
    breakfast: data.breakfast.name,
    lunch: data.lunch.name,
    dinner: data.dinner.name,
    others: data.others
  });
  return data;
};

module.exports = MenuDao;