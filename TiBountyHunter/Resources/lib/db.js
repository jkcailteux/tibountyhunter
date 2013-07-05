var db = Ti.Database.open('TiBountyHunter');
db.execute('CREATE TABLE IF NOT EXISTS fugitives(id INTEGER PRIMARY KEY, name TEXT, captured INTEGER, url TEXT);');
db.close();

exports.list=function(_captured){
	var fugitiveList = [];
	var db = Ti.Database.open('TiBountyHunter');
	var result = db.execute('SELECT * FROM fugitives WHERE captured = ? ORDER BY name ASC', (_captured) ? 1:0);
	while (result.isValidRow()){
		fugitiveList.push({
			title:result.fieldByName('name'),
			id:result.fieldByName('id'),
			hasChild:true,
			color:'#fff',
			name: result.fieldByName('name'),
			captured: (Number(result.fieldByName('captured')) ===1),
			url: result.fieldByName('url')
		});
		result.next();
	}
	result.close();
	db.close();
	
	return fugitiveList;
};

var add = function(_name){
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("INSERT INTO fugitives(name,captured) VALUES(?,?)", _name,0);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

exports.add=add;

exports.del = function(_id){
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("DELETE FROM fugitives WHERE id = ?", _id);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

exports.bust = function(_id){
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("UPDATE fugitives SET captured = 1 WHERE id = ?", _id);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

exports.addPhoto = function(_id,_url){
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("UPDATE fugitives SET url = ? WHERE id = ?", _url, _id);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

if(!Ti.App.Properties.hasProperty('seeded')){
	var net = require('lib/network');
	net.getFugitives(function(data){
		for(var i =0;i<data.length;i++){
			add(data[i].name);
		}
		Ti.App.Properties.setString('seeded','yuppers');
	});
}


