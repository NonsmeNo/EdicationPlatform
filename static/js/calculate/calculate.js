document.addEventListener('DOMContentLoaded', function() {


// 🔧 ОСНОВНЫЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ

// DOM-элементы и переменные
const functions_print = document.getElementById('functions');
const funk_block_class = document.getElementById('func-block');
const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');

// Максимальное количество функций
const max_funcs = 5;
const colors = ['#01AB9F', '#FF7A5A', '#FFB85F', '#9A80F6', '#82AFFB'];
//const colors = ['#01AB9F', '#FF7A5A', '#FFB85F', '#9A80F6', '#82AFFB'];

let func_cnt = 0; // Текущее количество функций
let adds_func = []; // Сохраненные функции для перерисовки

// Границы координатной системы
let x_left = -10;
let x_right = 10;
let y_down = x_left;
let y_up = x_right;

// Скрытие блока функций при старте
funk_block_class.style.display = 'none';

// Размеры canvas
canv.width = canv.clientWidth;
canv.height = canv.clientHeight;
const width = canv.width;
const height = canv.height;

drow_start();
drow_axes();



// 📌 КНОПКИ ДОБАВЛЕНИЯ РАЗЛИЧНЫХ ФУНКЦИЙ

// Построение графика y = f(x)
document.getElementById('btn').addEventListener('click', () => {
	if (func_cnt < max_funcs) {
		creat_block_func(1);
		const str_func = el('func').textContent;
		draw_graph(str_func, colors[func_cnt]);
		if (func_cnt === 0) {
			drow_axes();
			funk_block_class.style.display = 'block';
		}
		func_cnt++;
	} else {
		message_max();
	}
});

// Построение параметрического графика
document.getElementById('param_btn').addEventListener('click', () => {
	if (func_cnt < max_funcs) {
		creat_block_func(2);
		const str_func1 = el('func1').textContent;
		const str_func2 = el('func2').textContent;
		const min_t = el('min_t').value;
		const max_t = el('max_t').value;
		draw_parametric(str_func1, str_func2, min_t, max_t, colors[func_cnt]);
		if (func_cnt === 0) {
			drow_axes();
			funk_block_class.style.display = 'block';
		}
		func_cnt++;
	} else {
		message_max();
	}
});

// Построение окружности по центру и радиусу
document.getElementById('circle_centre_btn').addEventListener('click', () => {
	if (func_cnt < max_funcs) {
		creat_block_func(3);
		const str_func1 = `${el('x_centre').value}+${el('radius').value}*sin(t)`;
		const str_func2 = `${el('y_centre').value}+${el('radius').value}*cos(t)`;
		draw_parametric(str_func1, str_func2, 0, 10, colors[func_cnt]);
		if (func_cnt === 0) {
			drow_axes();
			funk_block_class.style.display = 'block';
		}
		func_cnt++;
	} else {
		message_max();
	}
});

// Построение эллипса по центру и осям
document.getElementById('ellipse_centre_btn').addEventListener('click', () => {
	if (func_cnt < max_funcs) {
		creat_block_func(4);
		const str_func1 = `${el('x_centre_ellips').value}+${el('ellips_a').value}*sin(t)`;
		const str_func2 = `${el('y_centre_ellips').value}+${el('ellips_b').value}*cos(t)`;
		draw_parametric(str_func1, str_func2, 0, 10, colors[func_cnt]);
		if (func_cnt === 0) {
			drow_axes();
			funk_block_class.style.display = 'block';
		}
		func_cnt++;
	} else {
		message_max();
	}
});

// Построение эллипса по фокусам и точке (только визуализация)
document.getElementById('ellipse_focus_btn').addEventListener('click', () => {
	if (func_cnt < max_funcs) {
		creat_block_func(5);
		if (func_cnt === 0) {
			drow_axes();
			funk_block_class.style.display = 'block';
		}
		func_cnt++;
	} else {
		message_max();
	}
});

// 💾 КНОПКИ СОХРАНЕНИЯ И ОЧИСТКИ ГРАФИКА

document.getElementById('savebtn').addEventListener('click', () => {
	if (adds_func.length) {
		redrawing();
		ctx.globalCompositeOperation = 'destination-over';
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canv.width, canv.height);
		const a = document.createElement("a");
		a.href = canv.toDataURL("image/png");
		a.download = "image.png";
		a.click();
		ctx.clearRect(0, 0, canv.width, canv.height);
		ctx.globalCompositeOperation = 'source-over';
		redrawing();
	} else {
		alert('Нельзя сохранить пустую картинку!');
	}
});

document.getElementById('clearbtn').addEventListener('click', () => {
	ctx.clearRect(0, 0, canv.width, canv.height);
	functions_print.innerHTML = "";
	func_cnt = 0;
	adds_func.length = 0;

	funk_block_class.style.display = 'none';
	drow_start();
	drow_axes();
});



// 🔍 МАСШТАБИРОВАНИЕ ГРАФИКА

// масштабирование колесиком мыши 
canv.addEventListener("wheel", (ev) => {
	ev.preventDefault(); // отключаем прокрутку страницы

	if (ev.deltaY < 0 && x_right > 1) {
		// Приближение
		x_left += 1;
		x_right -= 1;
		redrawing();
	}

	if (ev.deltaY > 0) {
		// Отдаление
		x_left -= 1;
		x_right += 1;
		redrawing();
	}
});


let initialPinchDistance = null;
let isPinching = false;

// Функция вычисления расстояния между двумя пальцами
function getDistance(touch1, touch2) {
	const dx = touch2.clientX - touch1.clientX;
	const dy = touch2.clientY - touch1.clientY;
	return Math.sqrt(dx * dx + dy * dy);
}

// Начало пинч-жеста
canv.addEventListener("touchstart", (ev) => {
	if (ev.touches.length === 2) {
		initialPinchDistance = getDistance(ev.touches[0], ev.touches[1]);
		isPinching = true;
	}
});

// Обработка пинч-жеста
canv.addEventListener("touchmove", (ev) => {
	if (isPinching && ev.touches.length === 2) {
		const currentDistance = getDistance(ev.touches[0], ev.touches[1]);

		if (initialPinchDistance !== null) {
			const scaleFactor = currentDistance / initialPinchDistance;

			if (scaleFactor > 1.05 && x_right - x_left > 2) {
				// Пальцы разошлись → приближение
				x_left += 1;
				x_right -= 1;
				initialPinchDistance = currentDistance;
				redrawing();
			} else if (scaleFactor < 0.95 && x_right < 1000) {
				// Пальцы сошлись → отдаление
				x_left -= 1;
				x_right += 1;
				initialPinchDistance = currentDistance;
				redrawing();
			}
		}

		ev.preventDefault(); // блокируем прокрутку страницы
	}
});

// Конец касания
canv.addEventListener("touchend", (ev) => {
	if (ev.touches.length < 2) {
		isPinching = false;
		initialPinchDistance = null;
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
		latex_func = el('latex').textContent;
		const func_display = document.createElement('div');
		func_display.classList.add('mathquill-output');
		func_display.innerHTML = `F(x) = ${latex_func}`;
		const MQ = MathQuill.getInterface(2);
		MQ.StaticMath(func_display);
		input_func.append(func_display);
		func_block.append(input_func);

		orig_func = el('func').textContent;
		adds_func.push('1' + orig_func);

	} else if (type == 2) {
		str_func1 = el('func1').textContent;
		str_func2 = el('func2').textContent;
		min_t = el('min_t').value;
		max_t = el('max_t').value;
		adds_func.push('2' + str_func1 + '%' + str_func2 + '%' + min_t + '%' + max_t);

		latex_func1 = el('func1-latex').textContent;
		latex_func2 = el('func2-latex').textContent;

		const MQ = MathQuill.getInterface(2);

		// Создаём контейнер для отображения
		const func_display1 = document.createElement('div');
		const func_display2 = document.createElement('div');
		const range_display = document.createElement('div');

		func_display1.classList.add('mathquill-output');
		func_display2.classList.add('mathquill-output');
		range_display.classList.add('mathquill-output');

		// Задаём HTML с формулами
		func_display1.innerHTML = `x(t) = ${latex_func1},  `;
		func_display2.innerHTML = `y(t) = ${latex_func2},  `;
		range_display.innerHTML = `${min_t} \\le t \\le ${max_t}`;

		// Применяем MathQuill StaticMath для каждого
		MQ.StaticMath(func_display1);
		MQ.StaticMath(func_display2);
		MQ.StaticMath(range_display);

		input_func.append(func_display1);
		input_func.append(func_display2);
		input_func.append(range_display);
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



function drow_axes(){
	ctx.globalAlpha = 1.0;
	//рисуем ось Х
	y0_canv = y2canv(0)
	ctx.beginPath();
	ctx.moveTo(0, y0_canv);
	ctx.lineTo(width, y0_canv);
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = 'black';
	ctx.stroke();

	//рисуем ось Y
	x0_canv = x2canv(0);
	ctx.beginPath();
	ctx.moveTo( x0_canv, 0);
	ctx.lineTo( x0_canv, height);
	ctx.lineWidth = 0.5;
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

		ctx.clearRect(width-100, 10, 70, 70);
		ctx.fillText("X: "+X, width-100, 30);
		ctx.fillText("Y: "+Y, width-100, 50);
	});
}

// 🧮 Математические функции
function abs(x){return Math.abs(x);}
function acos(x){return Math.acos(x);}
function acosh(x){return Math.acosh(x);}
function asin(x){return Math.asin(x);}
function asinh(x){return Math.asinh(x);}
function atan(x){return Math.atan(x);}
function cos(x){return Math.cos(x);}
function exp(x){return Math.exp(x);}
function log(x){return Math.log(x);}
function sign(x){return Math.sign(x);}
function sin(x){return Math.sin(x);}
function sqrt(x){return Math.sqrt(x);}
function tan(x){return Math.tan(x);}
function pow(a,b){return Math.pow(a,b);}
function cosh(x){return Math.cosh(x);}

});