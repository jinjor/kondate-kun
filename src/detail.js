var MenuDao = require('./menu-dao.js');

var menuDao = new MenuDao();

var Detail = React.createClass({
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
      <div className="detail">
        <h2>{date}</h2>
        <form className="form">
          <div><label for="breakfast">朝</label><input id="breakfast" value={data.breakfast} onChange={this.saveBreakfast.bind(this, data)}></input></div>
          <div><label for="lunch">昼</label><input id="lunch" value={data.lunch} onChange={this.saveLunch.bind(this, data)}></input></div>
          <div><label for="dinner">夜</label><input id="dinner" value={data.dinner} onChange={this.saveDinner.bind(this, data)}></input></div>
        </form>
      </div>
    );
  }
});

module.exports = Detail;
