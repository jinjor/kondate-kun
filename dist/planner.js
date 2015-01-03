(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MenuDao = require('./menu-dao.js');
var Calendar = require('./calendar.js');
var Detail = require('./detail.js');
var Repertory = require('./repertory.js');

var menuDao = new MenuDao();

var App = React.createClass({displayName: "App",
  componentDidMount: function() {
    window.addEventListener('hashchange', function() {
      var hash = location.hash.substring(1);
      var state = this.state;
      state.hash = hash;
      this.setState(state);
    }.bind(this));
  },
  getInitialState: function() {
    return {
      hash: location.hash.substring(1),
      show: {
        year: 2015,
        month: 1
      },
      selected: {
        year: 2015,
        month: 1,
        date: 1
      }
    };
  },
  onChangeMonth: function(year, month) {
    var state = this.state;
    state.show = {
      year: year,
      month: month
    };
    this.setState(state);
  },
  onSelect: function(year, month, date) {
    this.setState({
      show: this.state.show,
      selected: {
        year: year,
        month: month,
        date: date
      }
    });
  },
  saveData: function(data) {
    data = menuDao.save(this.state.selected.year, this.state.selected.month, this.state.selected.date, data);
    this.setState(this.state);
  },
  render: function() {
    var cx = React.addons.classSet;
    var active = function(page, _default) {
      if(_default && this.state.hash === '') {
        return true;
      }
      return this.state.hash === page;
    }.bind(this);
    var calendarTabClasses = cx({
      'header-tab': true,
      'active': active('calendar', true)
    });
    var repertoryTabClasses = cx({
      'header-tab': true,
      'active': active('repertory')
    });
    var calendarContentClasses = cx({
      'header-tab-content-calendar': true,
      'hidden': !active('calendar', true)
    });
    var repertoryContentClasses = cx({
      'header-tab-content-repertory': true,
      'hidden': !active('repertory')
    });
    return (
      React.createElement("div", {className: "app"}, 
        React.createElement("header", null, 
          React.createElement("h1", null, "こんだて君", React.createElement("small", null, " beta")), 
          React.createElement("a", {className: calendarTabClasses, href: "#calendar"}, "カレンダー"), 
          React.createElement("a", {className: repertoryTabClasses, href: "#repertory"}, "レパートリー")
        ), 
        React.createElement("main", {className: "app-main"}, 
          React.createElement("div", {className: calendarContentClasses}, 
            React.createElement(Calendar, {show: this.state.show, selected: this.state.selected, onSelect: this.onSelect, onChangeMonth: this.onChangeMonth}), 
            React.createElement(Detail, {show: this.state.selected, onChangeData: this.saveData})
          ), 
          React.createElement("div", {className: repertoryContentClasses}, 
            React.createElement(Repertory, null)
          )
        )
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('app-container')
);
},{"./calendar.js":2,"./detail.js":3,"./menu-dao.js":4,"./repertory.js":5}],2:[function(require,module,exports){

var MenuDao = require('./menu-dao.js');

var menuDao = new MenuDao();

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


var Calendar = React.createClass({displayName: "Calendar",
  handleClick: function(year, month, date) {
    this.props.onSelect(year, month, date);
  },
  changeMonth: function(prev) {
    var year = this.props.show.year;
    var month = this.props.show.month + (prev ? -1 : 1);
    if(month === 0) {
      month = 12;
      year--;
    } else  if(month === 13) {
      month = 1;
      year++;
    }
    this.props.onChangeMonth(year, month);
  },
  render: function() {

    var year = this.props.show.year;
    var month = this.props.show.month;

    var selectedYear = this.props.selected.year;
    var selectedMonth = this.props.selected.month;
    var selectedDate = this.props.selected.date;

    var bodyRows = [[1,2,3,4,5,6,7], [8,9,10,11,12,13,14], [15,16,17,18,19,20,21], [22,23,24,25,26,27,28]];
    var bodyRowsView = bodyRows.map(function(week, i) {
      var daysView = week.map(function(date) {
        var selected = selectedYear === year && selectedMonth === month && selectedDate === date;
        var cx = React.addons.classSet;
        var classes = cx({
          'date': true,
          'selected': selected
        });
        var menu = menuDao.findByDate(year, month, date);
        var key = year + '/' + month + '/' + date;

        return (
        React.createElement("td", {key: key, className: classes, onClick: this.handleClick.bind(this, year, month, date)}, 
          React.createElement("div", null, 
            React.createElement("div", null, date), 
            React.createElement("div", null, menu.breakfast.name), 
            React.createElement("div", null, menu.lunch.name), 
            React.createElement("div", null, menu.dinner.name)
          )
        ));
      }.bind(this));
      var key = year + '/' + month + '/' + i;

      return (React.createElement("tr", {key: key}, daysView));
    }.bind(this));
    var caption = months[month - 1] + ' ' + year;
    return (
      React.createElement("section", {className: "calendar"}, 
      React.createElement("div", {className: "calendar-header"}, 
        React.createElement("span", {className: "caption"}, caption), 
        React.createElement("div", {className: "next-prev-month"}, 
          React.createElement("button", {onClick: this.changeMonth.bind(this, true)}, "<"), 
          React.createElement("button", {onClick: this.changeMonth.bind(this, false)}, ">")
        )
      ), 
      React.createElement("table", null, 
        React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null, "Sun"), 
            React.createElement("th", null, "Mon"), 
            React.createElement("th", null, "Tue"), 
            React.createElement("th", null, "Wed"), 
            React.createElement("th", null, "Thu"), 
            React.createElement("th", null, "Fri"), 
            React.createElement("th", null, "Sat")
          )
        ), 
        React.createElement("tbody", null, 
          React.createElement("tr", null, bodyRowsView)
        )
      )
      )
    );
  }
});

module.exports = Calendar;
},{"./menu-dao.js":4}],3:[function(require,module,exports){
var MenuDao = require('./menu-dao.js');

var menuDao = new MenuDao();

var Detail = React.createClass({displayName: "Detail",
  saveBreakfast: function(data, e) {
    data.breakfast.name = e.target.value;
    this.props.onChangeData(data);
  },
  saveLunch: function(data, e) {
    data.lunch.name = e.target.value;
    this.props.onChangeData(data);
  },
  saveDinner: function(data, e) {
    data.dinner.name = e.target.value;
    this.props.onChangeData(data);
  },
  render: function() {
    var data = menuDao.findByDate(this.props.show.year, this.props.show.month, this.props.show.date);
    var date = this.props.show.month + '月' + this.props.show.date + '日の食卓';
    return (
      React.createElement("section", {className: "detail"}, 
        React.createElement("h2", null, date), 
        React.createElement("form", {className: "form"}, 
          React.createElement("div", null, 
            React.createElement("label", {htmlFor: "breakfast"}, "朝"), 
            React.createElement("input", {id: "breakfast", value: data.breakfast.name, onChange: this.saveBreakfast.bind(this, data)})
          ), 
          React.createElement("div", null, 
            React.createElement("label", {htmlFor: "lunch"}, "昼"), 
            React.createElement("input", {id: "lunch", value: data.lunch.name, onChange: this.saveLunch.bind(this, data)})
          ), 
          React.createElement("div", null, React.createElement("label", {htmlFor: "dinner"}, "夜"), React.createElement("input", {id: "dinner", value: data.dinner.name, onChange: this.saveDinner.bind(this, data)}))
        )
      )
    );
  }
});

module.exports = Detail;

},{"./menu-dao.js":4}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
var MenuDao = require('./menu-dao.js');

var menuDao = new MenuDao();

var Repertory = React.createClass({displayName: "Repertory",
  render: function() {
    var repertories = menuDao.getAllRepertory();
    var repertoryViewList = repertories.map(function(repertory) {
      return (React.createElement("li", {key: repertory.name}, repertory.name, "(", repertory.days.length, ")"));
    });
    return (
      React.createElement("section", {className: "repertory"}, 
        React.createElement("h2", null, "レパートリー"), 
        React.createElement("ul", null, 
        repertoryViewList
        )
      )
    );
  }
});

module.exports = Repertory;

},{"./menu-dao.js":4}]},{},[1]);
