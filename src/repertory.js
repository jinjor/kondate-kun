var MenuDao = require('./menu-dao.js');

var menuDao = new MenuDao();

var Repertory = React.createClass({
  render: function() {
    var repertories = menuDao.getAllRepertory();
    var repertoryViewList = repertories.map(function(repertory) {
      return (<li key={repertory.name}>{repertory.name}({repertory.days.length})</li>);
    });
    return (
      <section className="repertory">
        <h2>レパートリー</h2>
        <ul>
        {repertoryViewList}
        </ul>
      </section>
    );
  }
});

module.exports = Repertory;
