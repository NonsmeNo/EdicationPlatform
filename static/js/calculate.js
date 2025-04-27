document.addEventListener('DOMContentLoaded', function() {


	//инициализация
	const simple_btn = el('btn');
	const save_btn = el('savebtn');
	const clear_btn = el('clearbtn');


	const width = 1000;
	const height = 500;
	const functions_print = el('functions');

	let func_cnt = 0;

	const max_funcs = 5;

	const colors = [
		'#01AB9F',
		'#FF7A5A',
		'#FFB85F',
		'#9A80F6',
		'#82AFFB'
	];

	let adds_func = [];

	x_left = -10;
	x_right = 10;
	y_down = x_left;
	y_up = x_right;


	const param_btn = el('param_btn');
	const circle_centre_btn = el('circle_centre_btn');
	const ellipse_centre_btn = el('ellipse_centre_btn');
	const ellipse_focus_btn = el('ellipse_focus_btn');


	const f1 = el('f1');
	const f2 = el('f2');
	const f3 = el('f3');
	const f4 = el('f4');
	const f5 = el('f5');
	const btns = el('btns');

	//на старте
	const canv = el('canvas');
	const ctx = canv.getContext('2d');
	drow_start();
	drow_axes();

	//СОБЫТИЯ
	//добавление блока и отрисовка графика
	document.querySelector("select").addEventListener('change', (e) => {
		if (e.target.value == 'simple') {
			f1.style.display = 'block';
			f2.style.display = 'none';
			f3.style.display = 'none';
			f4.style.display = 'none';
			f5.style.display = 'none';
		}
		else if (e.target.value == 'param') {
			f1.style.display = 'none';
			f2.style.display = 'block';
			f3.style.display = 'none';
			f4.style.display = 'none';
			f5.style.display = 'none';
		}
		else if (e.target.value == 'centre_circle') {
			f1.style.display = 'none';
			f2.style.display = 'none';
			f3.style.display = 'block';
			f4.style.display = 'none';
			f5.style.display = 'none';
		}
		else if (e.target.value == 'centre_ellips') {
			f1.style.display = 'none';
			f2.style.display = 'none';
			f3.style.display = 'none';
			f4.style.display = 'block';
			f5.style.display = 'none';
		}
		else if (e.target.value == 'focus_ellips') {
			f1.style.display = 'none';
			f2.style.display = 'none';
			f3.style.display = 'none';
			f4.style.display = 'none';
			f5.style.display = 'block';
		}
	  })

	//графики
	simple_btn.addEventListener('click', () => {

		if (func_cnt < max_funcs)
		{
			creat_block_func(1);
			str_func = el('func').value;
			draw_graph(str_func, colors[func_cnt]);
			if (func_cnt == 0) {
				drow_axes();
				btns.style.display = 'block';
			}
			func_cnt += 1;
		} else {
			message_max();
		}
	});

	param_btn.addEventListener('click', () => {

		if (func_cnt < max_funcs)
		{
			creat_block_func(2);
			str_func1 = el('func1').value;
			str_func2 = el('func2').value;
			min_t = el('min_t').value;
			max_t = el('max_t').value;
			draw_parametric(str_func1, str_func2, min_t, max_t, colors[func_cnt]);
			if (func_cnt == 0) {
				drow_axes();
				btns.style.display = 'block';
			}

			func_cnt += 1;
		} else {
			message_max();
		}
	});

	circle_centre_btn.addEventListener('click', () => {

		if (func_cnt < max_funcs)
		{
			creat_block_func(3);
			str_func1 = el('x_centre').value + '+' + el('radius').value + '*sin(t)';
			str_func2 = el('y_centre').value + '+' + el('radius').value + '*cos(t)';
			draw_parametric(str_func1, str_func2, 0, 10, colors[func_cnt]);
			if (func_cnt == 0) {
				drow_axes();
				btns.style.display = 'block';
			}

			func_cnt += 1;
		} else {
			message_max();
		}
	});

	ellipse_centre_btn.addEventListener('click', () => {

		if (func_cnt < max_funcs)
		{
			creat_block_func(4);
			str_func1 = el('x_centre_ellips').value + '+' + el('ellips_a').value + '*sin(t)';
			str_func2 = el('y_centre_ellips').value + '+' + el('ellips_b').value + '*cos(t)';
			draw_parametric(str_func1, str_func2, 0, 10, colors[func_cnt]);
			if (func_cnt == 0) {
				drow_axes();
				btns.style.display = 'block';
			}

			func_cnt += 1;
		} else {
			message_max();
		}
	});


	ellipse_focus_btn.addEventListener('click', () => {
		if (func_cnt < max_funcs)
		{
			creat_block_func(5);
			if (func_cnt == 0) {
				drow_axes();
				btns.style.display = 'block';
			}
			func_cnt += 1;
		} else {
			message_max();
		}
	});



	//сохранить
	save_btn.addEventListener('click', () => {
		if (adds_func.length) {
			redrawing();
			ctx.globalCompositeOperation = 'destination-over';
			ctx.fillStyle = "#FAEBD7";
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (window.navigator.msSaveBlob) {
				window.navigator.msSaveBlob(canv.msToBlob(), "image.png");
			} else {
				const a = document.createElement("a");
				document.body.appendChild(a);
				a.href = canv.toDataURL("image/png");
				a.download = "image.png";
				a.click();
				document.body.removeChild(a);
			}
			ctx.fillStyle = "black";
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.globalCompositeOperation = 'source-over';
			redrawing();
		} else {
			alert('Нельзя сохранить пустую картинку!');
		}

	});

	//стереть все
	clear_btn.addEventListener('click', () => {
		clear_canv();
		btns.style.display = 'none';
	});


	//изменение размера графика
	  window.addEventListener("wheel", (ev) => {

		if ((x_right > 1) && (ev.deltaY < 0)) {
			x_left += 1;
			x_right -= 1;
			redrawing();

		}

		if (ev.deltaY > 0) {
			x_left -= 1;
			x_right += 1;

			redrawing();
		}
	});

	//**************************** */


	//ФУНКЦИИ
	function creat_block_func(type) {
		let func_block = document.createElement('div');
		let block_color = document.createElement('div');
		let input_func = document.createElement('div');
		func_block.classList.add('func_block');
		func_block.id = `b${func_cnt}`;
		block_color.classList.add('color_func');
		block_color.style.background = colors[func_cnt];

		functions_print.append(func_block);
		func_block.append(block_color);

		input_func.classList.add('input_func');

		if (type == 1) {
			str_func = el('func').value;
			input_func.innerHTML += `F(x) = ${str_func}`;
			adds_func.push('1'+str_func);
			func_block.append(input_func);
		} else if (type == 2) {
			str_func1 = el('func1').value;
			str_func2 = el('func2').value;
			min_t = el('min_t').value;
			max_t = el('max_t').value;
			input_func.innerHTML += `x(t) = ${str_func1}<br>y(t) = ${str_func2}<br>${min_t}⩽t⩽${max_t}<br>`;
			adds_func.push('2' + str_func1 + '%' + str_func2 + '%' + min_t + '%' + max_t);
			func_block.append(input_func);
		} else if (type == 3) {
			radius = el('radius').value;
			x_centre = el('x_centre').value;
			y_centre = el('y_centre').value;
			input_func.innerHTML += `Окружность с радиусом ${radius}<br> и центром (${x_centre}, ${y_centre})`;
			adds_func.push('3' + radius + '%' + x_centre + '%' + y_centre);
			func_block.append(input_func);
		} else if (type == 4) {
			ellips_a = el('ellips_a').value;
			ellips_b = el('ellips_b').value;
			x_centre_ellips = el('x_centre_ellips').value;
			y_centre_ellips = el('y_centre_ellips').value;
			input_func.innerHTML += `Эллипс с полуосями: a = ${ellips_a}, b = ${ellips_b}<br> и центром (${x_centre_ellips}, ${y_centre_ellips})`;
			adds_func.push('4' + ellips_a + '%' + ellips_b + '%' + x_centre_ellips + '%' + y_centre_ellips);
			func_block.append(input_func);
		} else if (type == 5) {
			x = el('x_ellips').value;
			y = el('y_ellips').value;
			x_f1 = el('x_f1').value;
			x_f2 = el('x_f2').value;
			y_f1 = el('y_f1').value;
			y_f2 = el('y_f2').value;
		input_func.innerHTML += `Эллипс с фокусами: f1 = (${x_f1}, ${y_f1}) f2 = (${x_f2}, ${y_f2})<br> и точкой (${x}, ${y})`;
		adds_func.push('5' + calc_ellipse_axes (x, y, x_f1, y_f1, x_f2, y_f2));
		func_block.append(input_func);
	}

	}

	function redrawing() {
		ctx.clearRect(0, 0, canv.width, canv.height);
			drow_axes();
			adds_func.forEach((str, index) => {
				if (str[0] == '1') {
					draw_graph(str.slice(1), colors[index]);
				} else if (str[0] == '2') {
					str1 = str.split('%')[0];
					str2 = str.split('%')[1];
					min_t = str.split('%')[2];
					max_t = str.split('%')[3];
					draw_parametric(str1.slice(1), str2, min_t, max_t, colors[index]);
				} else if (str[0] == '3') {
					str1 = str.split('%')[0];
					str_func1 = str.split('%')[1] + '+' + str1.slice(1) + '*sin(t)';
					str_func2 = str.split('%')[2] + '+' + str1.slice(1) + '*cos(t)';
					draw_parametric(str_func1, str_func2, 0, 10, colors[index]);
				}
				else if (str[0] == '4') {
					str1 = str.split('%')[0];
					str_func1 = str.split('%')[2] + '+' + str1.slice(1) + '*sin(t)';
					str_func2 = str.split('%')[3] + '+' + str.split('%')[1] + '*cos(t)';
					draw_parametric(str_func1, str_func2, 0, 10, colors[index]);
				}
				else if (str[0] == '5') {
					str1 = str.split('%')[0];
					str_func1 = str1.slice(1) + '*sin(t)';
					str_func2 = str.split('%')[1] + '*cos(t)';
					draw_parametric(str_func1, str_func2, 0, 10, colors[index]);
				}
			});
	}

	function el(id){
		return document.getElementById( id );
	}


	function clear_canv(){
		ctx.clearRect(0, 0, canv.width, canv.height);
		functions_print.innerHTML = "";
		func_cnt = 0;
		adds_func.length = 0;

	}


	function drow_axes(){
		//рисуем ось Х
		y0_canv = y2canv(0)
		ctx.beginPath();
		ctx.moveTo(0, y0_canv);
		ctx.lineTo(width, y0_canv);
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke();

		//рисуем ось Y
		x0_canv = x2canv(0);
		ctx.beginPath();
		ctx.moveTo( x0_canv, 0);
		ctx.lineTo( x0_canv, height);
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}

	function message_max () {
		alert('максимальное число графиков - 5, пожалуйста, очистите доску');
	}

	function calc_ellipse_axes (x, y, x_f1, y_f1, x_f2, y_f2) {
		x = Number(x);
		y = Number(y);
		x_f1 = Number(x_f1);
		y_f1 = Number(y_f1);
		x_f2 = Number(x_f2);
		y_f2 = Number(y_f2);

		if (y_f1 != y_f2) { //вертикальный
			c = y_f2;
			a1 = sqrt((-c*c+y*y+x*x + sqrt(2*x*x*y*y-2*c*c*y*y+pow(y, 4)+pow(x, 4)+pow(c, 4)+2*x*x*c*c))/2);
			b1 = sqrt(c*c + a1*a1);
			str_func1 = 0 + '+' + a1 + '*sin(t)';
			str_func2 = 0 + '+' + b1 + '*cos(t)';
			draw_parametric(str_func1, str_func2, 0, 10, colors[func_cnt]);
			return (String(a1) + '%' + String(b1));
		} else if (x_f1 != x_f2) { //горизонтальный

			c = x_f2;
			a1 = sqrt((c*c+y*y+x*x + sqrt(2*x*x*y*y+2*c*c*y*y+pow(y, 4)+pow(x, 4)+pow(c, 4)-2*x*x*c*c))/2);
			b1 = sqrt(abs(c*c - a1*a1));
			str_func1 = 0 + '+' + a1 + '*sin(t)';
			str_func2 = 0 + '+' + b1 + '*cos(t)';
			draw_parametric(str_func1, str_func2, 0, 10, colors[func_cnt]);
			return (String(a1) + '%' + String(b1));
		}
	}



	function draw_graph(str, color) {

		y_down = x_left;
		y_up = x_right;
		step = 0.01;

		x = x_left; //устанавливаем перо на начальную точку
		y = eval(str);
		x_canv = x2canv(x);
		y_canv = y2canv(y);

		ctx.beginPath(); //первоначальные параметры
		ctx.moveTo(x_canv, y_canv);
		ctx.lineWidth = 2;
		ctx.strokeStyle = color;
		f = 1;

		for(i = 0; i < x_right * 2; i += 0.01){ //рендеринг графика
			x = Number(x) + step;
			y = eval(str);
			if (y <= y_up * 2 && y >= y_down * 2) {
				x_canv = x2canv(x);
				y_canv = y2canv(y);
				if (f == 0) {
					ctx.beginPath();
					ctx.moveTo(x_canv, y_canv);
					f = 1;
				}
				ctx.lineTo(x_canv, y_canv);
			}
			else {
				if (f==1) {
					ctx.stroke();
					f = 0;
				}
			}
		}
		if (f==1) {
			ctx.stroke();
		}
	}

	function draw_parametric(str1, str2, min_t, max_t, color) {
		y_down = x_left;
		y_up = x_right;
		min_t = Number(min_t);
		max_t = Number(max_t);
		let step = 0.01;

		t = min_t;
		let x = eval(str1); //устанавливаем перо на начальную точку
		let y = eval(str2);
		var x_canv = x2canv(x);
		var y_canv = y2canv(y);

		ctx.beginPath(); //первоначальные параметры
		ctx.moveTo(x_canv, y_canv);
		ctx.lineWidth = 2;
		ctx.strokeStyle = color;

		for(t = min_t; t <= max_t; t += step){ //рендеринг графика
			x = eval(str1);
			y = eval(str2);
			x_canv = x2canv(x);
			y_canv = y2canv(y);
			ctx.lineTo(x_canv, y_canv);
		}
		ctx.stroke();
	}


	function x2canv(x) {
		return (x-x_left)*width/(x_right - x_left);
	}

	function y2canv(y) {
		return height - (y-y_down)*height/(y_up - y_down);
	}


	function canv2x(x_canv) {
		x = Number(x_left) + x_canv*(x_right - x_left)/width;
		return x.toString().substr(0,5);
	}

	function canv2y(y_canv) {
		y = Number(y_down) + (Number(height) - y_canv)*(y_up - y_down)/height;
		return y.toString().substr(0,5);
	}


	//базовые объекты canvas при загрузке страницы
	function drow_start() {
		ctx.font = "16px Arial";

		canv.addEventListener("mousemove", ev => {
			var cRect = canv.getBoundingClientRect();  // прямоугольник канвы
			var x_canv = Math.round(ev.clientX - cRect.left);  //из абсолютных координат получаем координаты канвы
			var y_canv = Math.round(ev.clientY - cRect.top);
			var X = canv2x(x_canv);
			var Y = canv2y(y_canv);

			ctx.clearRect(width-100,10, 70, 70);
			ctx.fillText("X: "+X, width-100, 30);
			ctx.fillText("Y: "+Y, width-100, 50);
		});
	}



	//группа математических функций
	function abs(x){
		return Math.abs(x);
	}

	function acos(x){
		return Math.acos(x);
	}

	function acosh(x){
		return Math.acosh(x);
	}

	function asin(x){
		return Math.asin(x);
	}

	function asinh(x){
		return Math.asinh(x);
	}

	function atan(x){
		return Math.atan(x);
	}

	function cos(x){
		return Math.cos(x);
	}

	function exp(x){
		return Math.exp(x);
	}

	function log(x){
		return Math.log(x);
	}

	function sign(x){
		return Math.sign(x);
	}

	function sin(x){
		return Math.sin(x);
	}

	function sqrt(x){
		return Math.sqrt(x);
	}

	function tan(x){
		return Math.tan(x);
	}

	function pow(a, b){
		return Math.pow(a, b);
	}


	function cosh(x){
		return Math.cosh(x);
	}

});