var MenuDao = require('./menu-dao.js');
var Calendar = require('./calendar.js');
var Detail = require('./detail.js');

var menuDao = new MenuDao();

var App = React.createClass({
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
      <div className="app">
        <header><h1>こんだて君<small> beta</small></h1></header>
        <main className="app-main">
          <Calendar show={this.state.show} selected={this.state.selected} onSelect={this.onSelect} onChangeMonth={this.onChangeMonth}/>
          <Detail show={this.state.selected} onChangeData={this.saveData}/>
        </main>
      </div>
    );
  }
});

React.render(
  <App></App>,
  document.getElementById('app-container')
);