var MenuDao = require('./menu-dao.js');
var Calendar = require('./calendar.js');
var Detail = require('./detail.js');

var menuDao = new MenuDao();

var App = React.createClass({
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
    console.log('App#render');
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
      <div className="app">
        <header>
          <h1>こんだて君<small> beta</small></h1>
          <a className={calendarTabClasses} href="#calendar">カレンダー</a>
          <a className={repertoryTabClasses} href="#repertory">レパートリー</a>
        </header>
        <main className="app-main">
          <div className={calendarContentClasses}>
            <Calendar show={this.state.show} selected={this.state.selected} onSelect={this.onSelect} onChangeMonth={this.onChangeMonth}/>
            <Detail show={this.state.selected} onChangeData={this.saveData}/>
          </div>
          <div className={repertoryContentClasses}>
            repertory
          </div>
        </main>
      </div>
    );
  }
});

React.render(
  <App></App>,
  document.getElementById('app-container')
);