appMain
.filter('lengthFilter', function () {
	return function(v,length) {
		length = length || 10;
		if(v && v.length > length){
			v = v.substr(0,length - 1)+'...';
		}
		return v;
	};
})
.filter('trustUrl', ['$sce', function ($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}])
.filter('formatSize', function () {
	return function(size) {
		size = size || 0;
		var fs = size, unit = 'bit';
		if(size > 1024){
			fs = (size/1024).toFixed(2);
			unit = 'kB';
			if(fs > 1024){
				fs = (fs/1024).toFixed(2);
				unit = 'MB';
				if(fs > 1024){
					fs = (fs/1024).toFixed(2);
					unit = 'GB';
				}
			}
		}
		return fs +' '+ unit;
	};
})
.filter('formatPosition', function () {
	return function(p) {
		p = p || 0;
		var d,f,m;
		d = parseInt(p);
		var tf = (p - d) * 60;
		f = parseInt(tf);
		var tm = (tf - f) * 60;
		m = tm.toFixed(2);

		return d + '°' + f + '′' + m + '″';
	};
})
.filter('formatTime', function () {
	return function(t) {
		var date = new Date();
			date.setTime(t);
		return date.format("yyyy-MM-dd hh:mm:ss");
	};
})
.filter('placeHolderLengthFilter', function () {
	return function(v,length) {
		length = length || 10;
		if(v && v.length > length){
			v = v.substr(0,3)+'...';
		}
		return v;
	};
})
;