
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


var Calendar = React.createClass({
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
        return (<td className={classes} onClick={this.handleClick.bind(this, year, month, date)}>
          <div>
            <div>{date}</div>
            <div>{menu.breakfast}</div>
            <div>{menu.lunch}</div>
            <div>{menu.dinner}</div>
          </div>
        </td>);
      }.bind(this));
      return (<tr>{daysView}</tr>);
    }.bind(this));
    var caption = months[month - 1] + ' ' + year;
    return (
      <div className="calendar">
      <div className="calendar-header">
        <span className="caption">{caption}</span>
        <div className="next-prev-month">
          <button onClick={this.changeMonth.bind(this, true)}>&lt;</button>
          <button onClick={this.changeMonth.bind(this, false)}>&gt;</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          <tr>{bodyRowsView}</tr>
        </tbody>
      </table>
      </div>
    );
  }
});

module.exports = Calendar;