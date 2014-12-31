(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MenuDao = require('./menu-dao.js');
var Calendar = require('./calendar.js');
var Detail = require('./detail.js');

var menuDao = new MenuDao();

var App = React.createClass({displayName: "App",
  getInitialState: function() {
    return {
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
    this.setState({
      show: {
        year: year,
        month: month
      },
      selected: this.state.selected
    });
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
    console.log('App#render');
    return (
      React.createElement("div", {className: "app"}, 
        React.createElement("header", null, React.createElement("h1", null, "こんだて君", React.createElement("small", null, " beta"))), 
        React.createElement("main", {className: "app-main"}, 
          React.createElement(Calendar, {show: this.state.show, selected: this.state.selected, onSelect: this.onSelect, onChangeMonth: this.onChangeMonth}), 
          React.createElement(Detail, {show: this.state.selected, onChangeData: this.saveData})
        )
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('app-container')
);
},{"./calendar.js":2,"./detail.js":3,"./menu-dao.js":4}],2:[function(require,module,exports){

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
    console.log(this.props.show);
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
    var bodyRowsView = bodyRows.map(function(week) {
      var daysView = week.map(function(date) {

        var selected = selectedYear === year && selectedMonth === month && selectedDate === date;
        var cx = React.addons.classSet;
        var classes = cx({
          'date': true,
          'selected': selected
        });
        var menu = menuDao.findByDate(year, month, date);
        return (React.createElement("td", {className: classes, onClick: this.handleClick.bind(this, year, month, date)}, 
          React.createElement("div", null, 
            React.createElement("div", null, date), 
            React.createElement("div", null, menu.breakfast), 
            React.createElement("div", null, menu.lunch), 
            React.createElement("div", null, menu.dinner)
          )
        ));
      }.bind(this));
      return (React.createElement("tr", null, daysView));
    }.bind(this));
    var caption = months[month - 1] + ' ' + year;
    return (
      React.createElement("div", {className: "calendar"}, 
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
    data.breakfast = e.target.value;
    this.props.onChangeData(data);
  },
  saveLunch: function(data, e) {
    data.lunch = e.target.value;
    this.props.onChangeData(data);
  },
  saveDinner: function(data, e) {
    data.dinner = e.target.value;
    this.props.onChangeData(data);
  },
  render: function() {
    var data = menuDao.findByDate(this.props.show.year, this.props.show.month, this.props.show.date);
    var date = this.props.show.month + '月' + this.props.show.date + '日の食卓';
    return (
      React.createElement("div", {className: "detail"}, 
        React.createElement("h2", null, date), 
        React.createElement("form", {className: "form"}, 
          React.createElement("div", null, React.createElement("label", {for: "breakfast"}, "朝"), React.createElement("input", {id: "breakfast", value: data.breakfast, onChange: this.saveBreakfast.bind(this, data)})), 
          React.createElement("div", null, React.createElement("label", {for: "lunch"}, "昼"), React.createElement("input", {id: "lunch", value: data.lunch, onChange: this.saveLunch.bind(this, data)})), 
          React.createElement("div", null, React.createElement("label", {for: "dinner"}, "夜"), React.createElement("input", {id: "dinner", value: data.dinner, onChange: this.saveDinner.bind(this, data)}))
        )
      )
    );
  }
});

module.exports = Detail;

},{"./menu-dao.js":4}],4:[function(require,module,exports){
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
},{}]},{},[1]);
