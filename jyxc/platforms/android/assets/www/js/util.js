var imgLoad = function (url, callback) {
	var img = new Image();
	img.src = url;
	if (img.complete) {
		callback(img.width, img.height);
	} else {
		img.onload = function () {
			callback(img.width, img.height);
			img.onload = null;
		};
	};
};

function imageShow(w, h){
	$('.icimg').width = (w/10).toFixed(0);
	$('.icimg').height = (h/10).toFixed(0);
}

Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1,
		"d+" : this.getDate(), 
		"h+" : this.getHours(), 
		"m+" : this.getMinutes(), 
		"s+" : this.getSeconds(), 
		"q+" : Math.floor((this.getMonth()+3)/3), 
		"S" : this.getMilliseconds() 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
};


(function(exp){
	'use strict';
	var util = {};

	function S4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};

	util.guid = function() {
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};

	util.genId = function() {
		return util.guid().replace(/\-/g, '');
	};

	exp.appUtil = util;

})(window);

(function(exp){
	'use strict';
	var util = {};

	util.newDate = function(str){
		return new Date(str.replace(/-/g,'/'));
	};

	util.year = function(str){
		return util.newDate(str).getFullYear();
	};

	util.month = function(str){
		return util.newDate(str).getMonth() + 1;
	};

	util.day = function(str){
		return util.newDate(str).getDate();
	};

	util.week = function(str){
		var w = util.newDate(str).getDay();
		if(!w){
			w = 7;
		}
		return w;
	};

	util.currentDate = function(){
		return new Date();
	};

	util.currentYear = function(){
		return util.currentDate().getFullYear();
	};

	util.currentMonth = function(){
		return util.currentDate().getMonth() + 1;
	};

	util.currentDay = function(){
		return util.currentDate().getDate();
	};

	util.currentWeek = function(){
		var w = util.currentDate().getDay();
		if(!w){
			w = 7;
		}
		return w;
	};

	// 月第一天
	util.monthFirstDay = function(year, month){
		var fd = util.newDate(year + '-' + month + '-01');
		return fd;
	};

	// 月第一天周几
	util.monthFirstDayWeek = function(year, month){
		return util.monthFirstDay(year, month).getDay();
	};

	// 月最后一天
	util.monthLastDay = function(year, month){
		var ld = new Date(year, month, 0);
		return ld;
	};

	// 月最后一天周几
	util.monthLastDayWeek = function(year, month){
		return util.monthLastDay(year, month).getDay();
	};

	exp.appDate = util;
})(window);