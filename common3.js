//元素的显示隐藏
var show = function(obj){
	obj.style.display = "block";
}

var hide = function(obj){
	obj.style.display = "none";
}

//将伪数组变成数组
function toArray(arr){
	var newArr = [];
	for(var i=0;i<arr.length;i++){
		newArr.push(arr[i]);
	}
	return newArr;
}

//兼容各浏览器，通过classname获取元素
function getClass(classname){
    if(document.getElementsByClassName){
        return toArray(document.getElementsByClassName(classname));
    }
    var arr = [];
    var parent = document.getElementsByTagName('*');
    for(var i=0;i<parent.length;i++){
        var strArr = parent[i].className.split(' ');
        if((' ' + strArr + ' ').indexOf(' '+classname + ' ') != -1){
            arr.push(parent[i]);
        }
    }
    return arr;
}

function $(str){
	/*
	 *match()方法返回一个数组，数组第一项就是str，第二项开始是括号内容的匹配结果，
	 * ?:表示不想被捕获，可提高程序运行效率
	 * #([\w-]+)  匹配ID选择器
	 * \.([\w-]+) 匹配Class选择器
	 * ([\w]+)    匹配类名选择器
	 * (\*)       匹配通配符选择器
	 * ([\w]+\[[\w-]+=[\w+]+\])   匹配具有某属性的类名选择器   div[index=100] 
	 * 除ID外，其他返回都是一个伪数组，可用ES5新方法Array.form(伪数组)转成数组，但是低版本浏览器不支持
	 * 如果一定兼容低版本浏览器，可使用自己封装的toArray()进行转换
	 * filter方法是ES5新属性，如果考虑兼容，则使用自己实现的这个方法
	 * 调用：console.log($('#box'));	console.log($('div[index=100]')[0]);
	 * */
	var val = str.match(/^(?:#([\w-]+)|\.([\w-]+)|([\w]+)|(\*)|([\w]+\[[\w-]+=[\w+]+\]))$/);
	if(val[1]) return document.getElementById(val[1]);
	if(val[2]) return getClass(val[2]);
	if(val[3]) return toArray(document.getElementsByTagName(val[3]));
	if(val[4]) return toArray(document.getElementsByTagName('*'));
	if(val[5]){
		var splitStr = val[5].match(/([\w]+)\[([\w-]+)=([\w-]+)\]/);
		var tagname = splitStr[1];
		var attrname = splitStr[2];
		var attrval = splitStr[3];
		var list = toArray(document.getElementsByTagName(tagname));
		var newList = list.filter(function(item,index){
			return item.getAttribute(attrname) == attrval;
		});
		return newList;
	}
}

/*
	函数名：生成val位随机数，包含数字和大小写字母
	参数：生成的最小和最大值
	调用：var str = randomInt(6,10);  =>  生成包含6，10的随机数
*/
function randomInt(min,max){
	return Math.round(Math.random()*(max-min) + min);
}

function randomColor(){
	return 'rgb(' + randomInt(0,255) + ',' + randomInt(0,255) + ',' + randomInt(0,255) +')';
}
//时间函数封装
var getTime = {
	string2Date:function(str){
		if(str.search(/^\d{4}\D\d{1,2}\D\d{1,2}$/) == -1){
			throw new Error('请检查String2Date格式是否正确');
		}
		var newStr = str.replace(/(\d+)\D/g,function(matched,sub1){
			return sub1+'/';
		});
		return newStr;	
	},
	isLeapYear:function(year){  //判断是否是闰年
		if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)){
			return true;
		}
		return false;
	},
	countBetweenDate: function(d1,d2){   //判断两个日期相差的天数
		if(typeof d1 === 'string'){
			d1 = string2date(d1);
		}
		if(typeof d2 === 'string'){
			d2 = string2date(d2);
		}
		return Math.abs(d1.getTime() - d2.getTime()) / (1000*3600*24);
	},
	getDayAfter:function(n){   //获得N天以后（以前）的日期
		var now = new Date();
		now.setDate(now.getDate() + n); // 时间戳
		return now;
	}

}

//获取页面的滚动距离
function scrollVal(){
	//不能是if(window.pageYOffset)   
	//因为页面一加载，pageYOffset的值为0，直接这样判断，即使浏览器支持该属性，也是返回0；
	//判断为if(0)不成立
	if(window.pageYOffset != null){
		return{
			left:window.pageXOffset,
			top:window.pageYOffset
		}
	}else if(document.compatMode == "CSS1Compat"){
		//检测是不是怪异模式  CSS1Compat不是,BackCompat是
		return{
			left:document.documentElement.scrollLeft,
			top:document.documentElement.scrollTop
		}
	}
	return{
		//剩下的肯定是怪异模式
		left:document.body.scrollLeft,
		top:document.body.scrollTop
	}
}

/*
	clcient  获取页面可视区的宽度
	参数： 无
	函数的调用：console.log(client().width);
*/

function client(){
	if(window.innerWidth != null){   //IE9+最新浏览器
		return{
			width:window.innerWidth,
			height:window.innerHeight
		}
	}else if(document.compatMode == "CSS1Compat"){   //  标准浏览器
		//检测是不是怪异模式  CSS1Compat不是,BackCompat是
		return{
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	}
	return{
		//剩下的肯定是怪异模式
		width:document.body.clientWidth,
		height:document.body.clientHeight
	}
}

	//console.log(client().width);

/*
	获取元素的样式，外联行内都可以
	标准下：getComputedStyle
	IE下：  currentStyle
	调用：  getStyle(oDiv,'width);  返回结果包含单位
*/
function getStyle(obj,attr){
	return window.getComputedStyle ? 
			window.getComputedStyle(obj)[attr] :
			 obj.currentStyle[attr]; 
}


/*
	getSelectionText()  兼容浏览器获取鼠标选中文字内容
		标准：window.getSelection
		IE： document.selection  
*/
function getSelectionText() {
        if(window.getSelection) {
       		return window.getSelection().toString();
        } else if(document.selection && document.selection.createRange) {
        	return document.selection.createRange().text;
        }
    return '';
   }

/*
	textNodeFilter(aLi);  
	作用：解决使用childNodes方法获取的子节点中包含换行文本的问题
	返回值： 返回一个
*/
function textNodeFilter(list){
	var temp = [];
	for(var i=0;i<list.length;i++){
		if(list[i].nodeType == 1){
			temp.push(list[i]);
		}
	}
	return temp;
}

//获取元素距离页面的距离
function getOffset(obj){
	var _left=0,_top = 0;
	while(obj){
		_left += obj.offsetLeft;
		_top += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return{
		left:_left,
		top:_top
	}
}
//利用sin方法实现缓冲运动
(function(){
	window.animateSin = function(obj,attrs,time,fn){
		var deg = 0;
		clearInterval(obj.timer);
		var startPoint = {};
		// 获取所有元素的初始属性值
		for(var attr in attrs){
			if(attr == 'opacity'){
				startPoint[attr] = getStyle(obj,attr) * 100;
			}else{
				startPoint[attr] = getStyle(obj,attr);
			}
		}
		obj.timer = setInterval(function(){				
			for(var attr in attrs){
				if(attr == 'opacity'){//(attrs[attr] - startPoint[attr])   计算振幅
					obj.style[attr] = ((attrs[attr] - startPoint[attr])*Math.sin(deg*Math.PI/180) + startPoint[attr])/100;
				}else{
					obj.style[attr] = (attrs[attr] - startPoint[attr])*Math.sin(deg*Math.PI/180) + startPoint[attr] + 'px';
				}
			}
			deg++;
			if(deg > 90){
				clearInterval(obj.timer);
				fn?fn():"";
			}
		},time/90);
	}
	
	function getStyle(obj,attr){
		return obj.currentStyle ? parseInt(obj.currentStyle[attr]) : parseInt(window.getComputedStyle(obj,null)[attr]);
	}
})();

//animate运动框架完整版
function animate(obj,json,fn){
    if(obj.timer) clearInterval(obj.timer);        
    var step;
    obj.timer = setInterval(function(){
        var flag = true;
        var current;
        
        for(var attr in json){
            if(attr == 'opacity'){   
            	// IE678下找不到css中的opacity,会返回NAN
                current = parseInt(getStyle(obj,attr)*100) || 0;
            }else{
                current = parseInt(getStyle(obj,attr)) || 0;   
                //属性都要给一个默认值0，否则IE下未设置的属性会返回undefined
            }
            
            step = (json[attr] - current)/10;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);

            if(attr == 'opacity'){
                if('opacity' in obj.style){   //  返回true则表明是支持opacity
                    obj.style.opacity = (current + step)/100;
                }else{   //否则是IE678
                    obj.style.filter = "alpha(opacity="+(current + step)+")";
                }
            }else if(attr == 'zIndex'){
                obj.style.zIndex = json[attr];
            }else{
                obj.style[attr] = (current + step) + 'px';
            }

            if(current != json[attr]){
                flag = false;
            }
        }
        if(flag){
            clearInterval(obj.timer);
            fn&&fn();
        }
    },10);       
}

//addEvent()绑定事件、利用函数柯里化只在页面打开的时候判断一次是不是IE
var addEvent = (function(){
	if(window.navigator.userAgent.indexOf('Trident') == -1){
		return function(obj,eventname,fn,isCapture){
			obj.addEventListener(eventname,fn,!!isCapture);
		}
	}else{
		return function(obj,eventname,fn){
			obj.attachEvent('on'+eventname,fn);
		}
	}
})();

//解绑事件
var removeEvent = (function(){
	if(window.navigator.userAgent.indexOf('Trident') == -1){
		return function(obj,eventname,fn,isCapture){
			obj.removeEventListener(eventname,fn,!!isCapture);
		}
	}else{
		return function(obj,eventname,fn){
			obj.detachEvent('on'+eventname,fn);
		}
	}
})();

//cookie的读取和设置
var Cookie = {
	get: function(key){
		var cookieStr = document.cookie;
		var list = cookieStr.split('; ');
		for(var i=0;i<list.length;i++){
			var keyvalue = list[i].split('=');
			if(keyvalue[0] === key){
				return keyvalue[1];
			}
		}
		return null;
	},
	set: function(key,value,date,path){
		var d = new Date();
		d.setDate(d.getDate()+parseInt(date));
		document.cookie = key+'='+value+';'+(date?'expires=' + d + ';':"") + (path?"path="+path+';':'');
	}
}

//对象的深拷贝
function deepClone(obj){
	if(typeof obj != 'object') return;
	
	var newObj = (obj instanceof Array) ? [] : {};
	
	for(var attr in obj){
		if(typeof obj[attr] == 'object'){
			newObj[attr] = deepClone(obj[attr]);
		}else{
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
}

//obj1为初始化对象，obj2为用户传入的对象。  现在合并两个obj
function merge(obj1,obj2){
	if(!obj2) return obj1;
	var newObj = {};
	
	for(var attr in obj1){
		newObj[attr]= obj1[attr];
	}
	for(var attr in obj2){
		newObj[attr] = obj2[attr];
	}
	return newObj;
}

//拖拽插件
/**
 * draggbale 拖拽元素
 * 2.0版本
 * 使用方式：
 * draggable(ele, {
 * 		x : false, //表示水平方向是否可拖拽
 * 		y : true, //表示垂直方向是否可拖拽
 * 		limit : true, //表示活动范围是否限制在定位父元素内
 * 		paddingLeft : 0,  //增加填充，即进一步缩小活动范围
		paddingRight :0,  //增加填充，即进一步缩小活动范围
		paddingTop : 0,  //增加填充，即进一步缩小活动范围
		paddingBottom  : 0,  //增加填充，即进一步缩小活动范围
		maringLeft : 0, //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		marginRight : 0,  //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		marginTop : 0, //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		marginBottom : 0, //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		callback : function(section, distance){
			回调函数，在拖拽过程中不断触发
			两个参数分别为：拖拽元素的可活动范围大小，拖拽元素在可活动范围内的坐标
			section包括，minLeft\maxLeft\minTop\maxTop    最大最小范围
			distance包括, x\y,运动中元素距离父元素的值
			绑定了this，回调函数中可以直接使用this来指向拖拽元素ele本身
		}
 * })
 * */
(function(){
	
	window.draggable = function(ele, _options) {
		//如果定位方式不是absolute，直接返回
		if(getStyle(ele,"position") != "absolute" && getStyle(ele,"position") != "fixed") return;
		
		var default_options = {
			x : true,
			y : true,
			limit : true,
			paddingLeft : 0,
			paddingRight :0,
			paddingTop : 0,
			paddingBottom  : 0,
			marginLeft : 0,
			marginRight : 0,
			marginTop : 0,
			marginBottom : 0,
			callback : function(){}
		};
		
		var options = merge(default_options, _options);				
		var startPoint = {
			x: getOffset(ele).left,
			y: getOffset(ele).top
		}
		
		addEvent(ele, "mousedown", function(e){
			var e = e || event;
			
			//计算鼠标和要拖拽元素的相对位置
			var mouse = {
				pageX : e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft,
				pageY : e.clientY + document.body.scrollTop || document.documentElement.scrollTop
			}
			mouse.offsetX = mouse.pageX - getOffset(ele).left + options.marginLeft;
			mouse.offsetY = mouse.pageY - getOffset(ele).top + options.marginTop;
			
			//添加移动事件
			addEvent(document, "mousemove", move);
			function move(e){
				var e = e || event;
				
				//计算鼠标当前的页面坐标pageX/Y
				var currentPos = {
					pageX : e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft,
					pageY : e.clientY + document.body.scrollTop || document.documentElement.scrollTop
				}				
				var section = {
					minLeft : options.paddingLeft - options.marginLeft,
					maxLeft : ele.offsetParent.offsetWidth - ele.offsetWidth - options.paddingRight - options.marginLeft + options.marginRight,
					minTop : options.paddingTop - options.marginTop,
					maxTop : (ele.offsetParent.offsetHeight - ele.offsetHeight) - options.paddingBottom - options.marginTop + options.marginBottom
				}
				
				if(options.limit) { //如果限定范围
					if(options.x) { //如果允许水平拖动
						ele.style.left = Math.min(section.maxLeft ,Math.max(section.minLeft, currentPos.pageX - getOffset(ele.offsetParent).left - mouse.offsetX)) + "px";
					}
					if(options.y) { //如果允许垂直拖动
						ele.style.top = Math.min(section.maxTop ,Math.max(section.minTop, currentPos.pageY - getOffset(ele.offsetParent).top - mouse.offsetY)) + "px";
					}
				} else {
					if(options.x) {
						ele.style.left = currentPos.pageX - getOffset(ele.offsetParent).left - mouse.offsetX + "px";
					}
					if(options.y) {
						ele.style.top = currentPos.pageY - getOffset(ele.offsetParent).top - mouse.offsetY + "px";
					}
				}
				window.getSelection? window.getSelection().removeAllRanges():document.selection.empty();
				options.callback.call(ele, section, {x:getOffset(ele).left - startPoint.x, y:getOffset(ele).top - startPoint.y});
			}
			addEvent(document, "mouseup", function(e){
				//document.detach("mousemove", move);
				document.removeEventListener("mousemove", move);
			});
		});		
	}	
})();

/*
 
 * 字符串模板
 * 用法：
 * 		<script id="template" type="text/html">
			<% for(var i=0;i<data.length;i++){ %>    // data与template中的data相照应
				<tr>
					<td class="warning"> <%= data[i].id %></td>
		            <td class="success"> <%= data[i].content %></td>
		            <td class="danger"> <%= data[i].comtcnt %></td>
		            <td class="info"> <%= data[i].likecnt %></td>
		            <td> <%= data[i].username %></td>
				</tr>			
			<% } %>
		</script>
		
		var htmlText = template('template',list);
		oTable.innerHTML += htmlText;
		console.log(htmlText);
	
 * */
function template(id,data){
	var str = document.getElementById(id).innerText;
	str = "log(`" + str + "`);";
	str = str.replace(/<%=(.+)%>/g,"`);log($1);log(`");
	str = str.replace(/<%(.+)%>/g,"`);$1log(`");
	//console.log(str);
	var funcstr = `
		(function(data){
			var htmlstr = "";
			function log(str){
				htmlstr += str;
			}
			${str};
			return htmlstr;
		})	
	`;
	
	var realfunc = eval(funcstr);
	return realfunc(data);
}

/**
 * ajax 的封装，
 * 调用方式
   ajax({
		type : 'jsonp',
		url : 'http://suggestion.baidu.com?wd=xd',
		jsonp_cb_name : 'cb',
		success : function(data){
			//获取数据之后做的事情
			console.log(data);
		},
		failure : function(){
			//获取失败做的处理
		}
	});
	ajax({
		type : 'post',
		url : 'http://10.9.164.141:8080/AJAX/ajaxtest',
		params : "a=2&b=3",   //post请求的参数
		success : function(data){
			//获取数据之后做的事情
			console.log(data);
		},
		failure : function(){
			//获取失败做的处理
		}
	});
	ajax({
		type : 'get',
		url : 'http://10.9.164.141:8080/AJAX/ajaxtest?active=123',
		success : function(data){
			//获取数据之后做的事情
			console.log(data);
		},
		failure : function(){
			//获取失败做的处理
		}
	});
 */

//ajax封装
function ajax({
	type='get',
	url,
	async=true,
	params="",
	jsonp_cb_name='callback',
	success=function(){},
	failure=function(){}
}){
	if(!/^https?:\/\/.+(\?.+=.+)?(&.+=.+)*$/.test(url)){
		console.error('请输入正确的url请求地址');
		return;
	}
	switch(type){
		case 'get' : ajaxGet(); break;
		case 'post' : ajaxPost(); break;
		case 'jsonp' : Jsonp(); break; 
	}
	
	function ajaxGet(url,async,success){
		var xhr = getXhr();
		xhr.open('get',url,async);
		//console.log(xhr.onload)  ==  null
		//低版本浏览器不支持onload方法
		if(xhr.onload != "undefined"){
			xhr.onload = function(){
				success(xhr.response);
			}
		}else{
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						success(xhr.responseText);
					}else{
						failure();
					}
				}
			}
		}
		xhr.send(null);
	}
	function ajaxPost(url,params,async,success){
		var xhr = getXhr();
		xhr.open('post',url,async);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		if(xhr.onload != "undefined"){
			xhr.onload = function(){
				success(xhr.response);
			}
		}else{
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						success(xhr.responseText);
					}else{
						failure();
					}
				}
			}
		}
		xhr.send(params);
	}
	function Jsonp(url,jsonpcallback,success){
		var _script = document.createElement("script");
		var callbackname = '_ajax_jsonp_callback' + new Date().getTime();
		if(/\?([^\?=]+=[^\?=]+)+$/.test(url)){
			_script.src = url + '&' + jsonp_cb_name +'='+ callbackname;				
		}else{
			_script.src = url + '?' + jsonp_cb_name +'='+ callbackname;	
		}
		document.body.appendChild(_script);			
		
		window[callbackname] = function(data){
			success(data);
			_script.remove();
			delete window[callbackname];
		}			
	}
	function getXhr(){
		var xhr = null;
		if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}else{
			return new ActiveXObject(Microsoft.XMLHTTP);//new ActiveXObject("Msxml2.XMLHTTP")
		}
	}
}

//数组ES5新增方法
//forEach  遍历数组的每一项
Array.prototype.forEach2 = function(callback,target){
	for(var i=0;i<this.length;i++){
		callback.call(target,this[i],i,this);
	}
}

//map方法，遍历->操作->返回,返回新数组，不改变原来的数组 
Array.prototype.map2 = function(callbcak){
	var temp = [];
	for(var i=0;i<this.length;i++){
		temp.push(callbcak(this[i],i,this));
	}
	return temp;
	/*用法
	 * var newArr2 = arr.map2(function(item,index,arr){
		return item+2;
	});
	console.log(newArr2);*/
}

//reduce方法  参数prev next index arr  每次返回的结果都会赋值给下一个函数的prev实现累加，不改变原始数组
Array.prototype.reduce2 = function(callback){
	if(this.length == 1) return arr[0];
	if(this.length == 0) return null;
	
	var preval = this[0];
	for(var i=1;i<this.length;i++){
		preval = callback(this[i],i,this);
	}
	return preval;
	/*var newArr2 = arr.reduce2(function(prev,next,index,arr){
		return prev+next;
	});*/
}

//数组的indexof方法,返回字符串str的下标
Array.prototype.indexOf2 = function(str){
	for(var i=0;i<this.length;i++){
		if(this[i] == str){
			return i;
		}
	}
}

//filter 过滤方法，以数组形式返回所有符合条件的项，如果都不符合，就返回空数组
Array.prototype.filter2 = function(callback){
	var temp = [];
	for(var i=0;i<this.length;i++){
		if(callback(this[i],i,this)){
			temp.push(this[i]);
		}
	}
	return temp;
	/*var newArr2 = arr.filter2(function(item,index){
		return item == 3;
	});*/
}

//some只要有一个符合条件，就返回true,  所有都不符合，就返回false
Array.prototype.some2 = function(callback){
	for(var i=0;i<this.length;i++){
		if(callback(this[i],i,this)){
			return true;
		}
	}
	return false;
}

//-------------------evrey方法，每一项都符合条件，返回true，否则返回false
Array.prototype.every2 = function(callback){
	for(var i=0;i<this.length;i++){
		if(!(callback(this[i],i,this))){
			return false;
		}
	}
	return true;
}