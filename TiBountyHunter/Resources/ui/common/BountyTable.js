var BountyTableView = function(/*Boolean*/ _captured){
	var tv = Ti.UI.createTableView({
		backgroundColor:'transparent'
	});
	
	function populateData(){
		var db =require('/lib/db');
		var results =db.list(_captured);
		tv.setData(results);
	}
	Ti.App.addEventListener('databaseUpdated', populateData);
	populateData();
	
	return tv;
};

module.exports = BountyTableView;
