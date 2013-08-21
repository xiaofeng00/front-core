$.holdReady(true);

var MANYOU = {
  IE_HACK: eval('!-[1,]'),
  plugin: {}
};

MANYOU.template = function (s){
	// 清理模板空白符
	var i = s.length;
	while (i-- && /\s/.test(s.charAt(i))){}
	s =  s.slice(0, i+1).replace(/[\r\n]+\s*/mg, '')

	// 解析模板
	.replace(/[\r\t\n]/g, ' ')			// 替换 换行/回车/制表符 为 空格
	.split('<#').join('\t')					// 替换全部 <# 为 \t
	.replace(/((?:^|#>)[^\t]*)'/g, '$1\r')	// 临时模板中非脚本部分内的 ' 为 \r

	.replace(/\t=@(.*?)#>/g, "',o.$1,'")		// 分离 变量字符串
	.replace(/\t=(.*?)#>/g, "',$1,'")		// 分离 变量字符串
	.replace(/\t(.*?)#>/g, function($0, $1){

		var arr_string = [];
		var i = 0;

		// 保留字符串到 arr_string
		$1 = $1.replace(/"(?:[^\\"]+|\\.)*"/g, function($0){
			arr_string[i++] = $0;
			return '""';
		}).replace(/'(?:[^\\']+|\\.)*'/g, function($0){
			arr_string[i++] = $0;
			return "''";
		});

		// 解析 @ 为局部变量
		$1 = $1.split('@').join('o.');

		if (i) {
			i = 0;
			function restore(){
				return arr_string[i++];
			}
			$1 = $1.replace(/""/g, restore).replace(/''/g, restore);
		}

		return "\t" + $1 + "#>";
	})		// 分离 变量字符串

	.split('\t').join("');")				// 分隔模板中的字符串部分和脚本部分
	.split('#>').join("p.push('")			// 同上
	.split('\r').join("\\'");				// 还原模板中字符串部分的单引号 '

	return new Function("o", "var p=[];p.push('" + s + "');return p.join('');");
};
 
$.holdReady(false);
