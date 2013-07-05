function ApplicationWindow(/*Boolean*/ _captured){
	var AddWindow = require('ui/common/AddWindow');
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage:'/images/grain.png',
		title: (_captured) ? 'Captured' : 'Fugitives',
		barColor: '#6d0a0c',
		activity:{
			onCreateOptionsMenu: function(e){
				var menu = e.menu;
				var m1 = menu.add({title:'add'});
				m1.addEventListener('click', function(e){
					self.containingTab.open(new AddWindow);
				});
			}
		}
	});
	var BountyTable = require('/ui/common/BountyTable');
	var BountyTable = new BountyTable(_captured);
	
	BountyTable.addEventListener('click', function(_e){
		var DetailWindow = require('ui/common/DetailWindow');
		self.containingTab.open(new DetailWindow(_e.rowData, self.containingTab));
	});
	
	self.add(BountyTable);
	
	if(Ti.Platform.osname === 'iphone'){
		var b = Titanium.UI.createButton({
			title:'add',
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		b.addEventListener('click', function(){
			self.containingTab.open(new AddWindow);
		});
		self.setRightNavButton(b);
	}
	
	return self;
};

module.exports = ApplicationWindow;
