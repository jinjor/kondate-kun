var MenuDao = require('./menu-dao.js');

var menuDao = new MenuDao();

var Detail = React.createClass({
  saveName: function(data, menu, e) {
    menu.name = e.target.value;
    this.props.onChangeData(data);
  },
  saveFav: function(data, menu) {
    menu.fav = !menu.fav;
    this.props.onChangeData(data);
  },
  render: function() {
    var data = menuDao.findByDate(this.props.show.year, this.props.show.month, this.props.show.date);
    var date = this.props.show.month + '月' + this.props.show.date + '日の食卓';
    var cx = React.addons.classSet;
    var breakfastFavClass = cx({
      'fav': true,
      'favored': !!data.breakfast.fav
    });
    var lunchFavClass = cx({
      'fav': true,
      'favored': !!data.lunch.fav
    });
    var dinnerFavClass = cx({
      'fav': true,
      'favored': !!data.dinner.fav
    });
    return (
      <section className="detail">
        <h2>{date}</h2>
        <form className="form">
          <div>
            <label htmlFor="breakfast">朝</label>
            <input id="breakfast" value={data.breakfast.name} onChange={this.saveName.bind(this, data, data.breakfast)}></input>
            <span onClick={this.saveFav.bind(this, data, data.breakfast)} className={breakfastFavClass}>★</span>
          </div>
          <div>
            <label htmlFor="lunch">昼</label>
            <input id="lunch" value={data.lunch.name} onChange={this.saveName.bind(this, data, data.lunch)}></input>
            <span onClick={this.saveFav.bind(this, data, data.lunch)} className={lunchFavClass}>★</span>
          </div>
          <div><label htmlFor="dinner">夜</label>
            <input id="dinner" value={data.dinner.name} onChange={this.saveName.bind(this, data, data.dinner)}></input>
            <span onClick={this.saveFav.bind(this, data, data.dinner)} className={dinnerFavClass}>★</span>
          </div>
        </form>
      </section>
    );
  }
});

module.exports = Detail;
