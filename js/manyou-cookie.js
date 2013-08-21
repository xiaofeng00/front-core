(function() {
  var set = function(name,value,expire,domain,path) {
    if (name === null) {return false;}
    var cookie = [];
    cookie.push(name + '=' + escape(value));
    cookie.push('domain=' + (domain || location.hostname));
    cookie.push('path=' + (path || location.pathname));
    var exp = new Date();
    switch (typeof expire){
      case 'number':
        exp.setTime(exp.getTime()+expire);
        cookie.push('expires=' + exp.toGMTString());
        break;
      case 'string':
        var unit_switch = 'ymdhis';
        var unit;
        var unit_arr = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds'];
        var regexp = new RegExp('(\\d+)(['+unit_switch+'])', 'img');
        var match;
        while (match = regexp.exec(expire)){
          unit = unit_arr[unit_switch.indexOf(match[2])];
          exp['set'+unit](exp['get'+unit]() + parseInt(match[1]));
        }
        cookie.push('expires=' + exp.toGMTString());
        break;
    }

    document.cookie = cookie.join(';');
    return true;
  };

  var get = function(name) {
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return decodeURIComponent(arr[2]); return null;
  };

  var del = function (name,domain,path) {
    if(name!=null){
      setCookie(name,'', -1,domain,path);
    }
  };

  var user_id = function() {
    return get('user_id') || null;
  };

  MANYOU.cookie = {
    set: set,
    get: get,
    del: del,
    user_id: user_id
  };

}());
