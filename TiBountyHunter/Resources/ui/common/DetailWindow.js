Ti.Geolocation.purpose = 'Tracking down criminals';
var DetailWindow = function(/*Object*/_bounty, /*Tab object reference*/containingTab) {
	var win = Ti.UI.createWindow({
		title : _bounty.title,
		barColor : '#6d0a0c',
		backgroundColor : 'transparent',
		backgroundImage : '/images/grain.png',
		layout : 'vertical'
	});
	
	

	win.add(Ti.UI.createLabel({
		text : (_bounty.captured) ? 'Busted' : 'At Large',
		top : 10,
		textAlign : 'center',
		font : {
			fontWeight : 'bold',
			fontSize : 18
		},
		color : '#fff',
		height : Ti.UI.SIZE
	}));
	
	var imgView = Ti.UI.createImageView({
		image:(_bounty.url)? _bounty.url : '/images/burglar.png',
		height:80,
		width:60,
		top:10
	});
	win.add(imgView);
	
	var photoButton = Ti.UI.createButton({
		title:'Photo',
		top:10,
		height:Ti.UI.SIZE,
		width:200
	});
	photoButton.addEventListener('click', function(){
		var db = require('/lib/db');
		if(Ti.Media.isCameraSupported){
			Ti.Media.ShowCamera({
				success:function(event){
					var image = event.media;
					imgView.image=image;
					
					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'photo' + _bounty.id +'.png');
					f.write(image);
					db.addPhoto(_bounty.id, f.nativePath);
				},
				cancel:function(){},
				error:function(){
					var a = Ti.UI.createAlertDialog({title:'Camera Error'});
					if(error.code == Ti.Media.NO_CAMERA){
						a.setMessage('Camera Error Details');
					}else{
						a.setMessage('Unexpected Error: '+ error.code);
					}
					a.show();
				},
				saveToPhotoGallery:true,
				allowEditing:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
			});
		}
	})
	win.add(photoButton);

	if (!_bounty.captured) {
		var captureButton = Ti.UI.createButton({
			title : 'Capture',
			top : 10,
			height : Ti.UI.SIZE,
			width : 200
		});
		captureButton.addEventListener('click', function(){
			var db =require('/lib/db');
			db.bust(_bounty.id);
			var net =require('/lib/network');
			net.bustFugitive(Ti.Platform.macaddress, function(_data){
				Ti.UI.createAlertDialog({
					message:_data.message
				}).show();
				
				if(Ti.Platform.osname == 'android'){
					setTimeout(function(){
						win.close();
					}, 2000);
				}else {
					win.close();
				}
				
			})
		});
		win.add(captureButton);
	}
	var deleteButton = Ti.UI.createButton({
		title : 'Delete',
		top : 10,
		height : Ti.UI.SIZE,
		width : 200
	});
	deleteButton.addEventListener('click', function(){
		var db= require('/lib/db');
		db.del(_bounty.id);
		win.close();
	});
	win.add(deleteButton);
	return win;
}

module.exports = DetailWindow;
