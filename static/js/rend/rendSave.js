document.addEventListener('DOMContentLoaded', function() {


const canv = el('canvas');
const btnShowGraph = el('btnShowGraph');
const btnShowAnsw = el('btnShowAnsw');
const answer = el('answer');
const template_id = el('template-id').value;
const colors = ['#01AB9F', '#FF7A5A', '#EE82EE', '#9A80F6', '#82AFFB'];

let randomNumber = Math.floor(Math.random() * 5);
select_color = colors[randomNumber];

canv.style.display = 'none';
answer.style.display = 'none';

// Координатная система
x_left = -10;
x_right = 10;
y_down = x_left;
y_up = x_right;

// подготовка canvas
canv.style.display = 'block';
canv.width = canv.clientWidth;
canv.height = canv.clientHeight;
const width = canv.width;
const height = canv.height;
canv.style.display = 'none';

const ctx = canv.getContext('2d');
drow_start();
drow_axes();


// сам пример
const example_task = el('task-task').value;

// красивый вывод задания
const task_latex = el('task-latex').value;

const MQ = MathQuill.getInterface(2)
const outputDiv = document.getElementById("output");
const mathField = MQ.StaticMath(outputDiv);
mathField.latex(task_latex);



// СОБЫТИЯ

// Отображение ответа при нажатии кнопки
btnShowAnsw.addEventListener('click', () => {
    if (answer.style.display == 'none'){
        answer.style.display = 'block';
        if (template_id == 1 || template_id == 2 || template_id == 3) {
            findXLinear(example_task, template_id);
        } else if (template_id == 4 || template_id == 5) {
            ex = example_task.replace('^2', '*x');
            findXQuad(ex, template_id);
        } else if (template_id == 6 || template_id == 7) {
            findXTrig(example_task, template_id);
        }
        btnShowAnsw.textContent = 'Скрыть ответ';
    }
    else {
        answer.style.display = 'none';
        btnShowAnsw.textContent = 'Показать ответ';
    }
});


// Отображение графика при нажатии кнопки
btnShowGraph.addEventListener('click', () => {

    // Показать canvas
    if (canv.style.display == 'none'){
        canv.style.display = 'block';
        btnShowGraph.textContent = 'Скрыть график';
        
        let str_graph = getGraphEquation();

        drow_axes();
        draw_graph(str_graph, select_color);

    }
    else {
        canv.style.display = 'none';
        btnShowGraph.textContent = 'Показать график';
    }

});

// Масштабирование графика
canv.addEventListener("wheel", (ev) => {
    ev.preventDefault(); // отключаем прокрутку страницы

    // Приближение
    if (ev.deltaY < 0 && x_right > 1) {
        x_left += 1;
        x_right -= 1;
        ctx.clearRect(0, 0, canv.width, canv.height);
        drow_axes(); // рисуем оси

        let str_graph = getGraphEquation();
        
        draw_graph(str_graph, select_color); // перерисовываем нужный график
    }

    // Отдаление
    if (ev.deltaY > 0) {
        x_left -= 1;
        x_right += 1;
        ctx.clearRect(0, 0, canv.width, canv.height);
        drow_axes(); // рисуем оси

        let str_graph = getGraphEquation();

        draw_graph(str_graph, select_color); // перерисовываем нужный график
    }
});

function getGraphEquation() {
    let str_graph = "";

    if (template_id == 1 || template_id == 2 || template_id == 3) {
        str_graph = convertEquation(example_task);
    } else if (template_id == 4 || template_id == 5) {
        str_graph = example_task.replace('^2', '*x');
        str_graph = str_graph.replace('=0', '');
    } else if (template_id == 6 || template_id == 7) {
        str_graph = convertEquation(example_task);
    }

    return str_graph;
}



// Масштабирование графика пальцами
let initialPinchDistance = null;

function getDistance(touches) {
  const [touch1, touch2] = touches;
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx*dx + dy*dy);
}

canv.addEventListener("touchstart", (ev) => {
  if (ev.touches.length === 2) {
    initialPinchDistance = getDistance(ev.touches);
    ev.preventDefault();
  }
});

canv.addEventListener("touchmove", (ev) => {
  if (ev.touches.length === 2 && initialPinchDistance !== null) {
    ev.preventDefault();

    const currentDistance = getDistance(ev.touches);
    const diff = currentDistance - initialPinchDistance;

    if (Math.abs(diff) > 10) { // порог чтобы не реагировать на мелкие движения

      if (diff > 0 && x_right > 1) {
        // Приближение (пальцы раздвигаются)
        x_left += 1;
        x_right -= 1;
      } else if (diff < 0) {
        // Отдаление (пальцы сближаются)
        x_left -= 1;
        x_right += 1;
      }

      ctx.clearRect(0, 0, canv.width, canv.height);
      drow_axes();

      let str_graph = getGraphEquation();
      draw_graph(str_graph, select_color);

      initialPinchDistance = currentDistance; // обновляем начальное расстояние
    }
  }
});

canv.addEventListener("touchend", (ev) => {
  if (ev.touches.length < 2) {
    initialPinchDistance = null; // сбрасываем при уходе пальцев
  }
});





// ФУНКЦИИ

// Решение линейных уравнений
function findXLinear(eq, type) {

    let a, b, c, x;


    if (type == 1) {
        let parts = eq.split('*x');
        console.log(parts)
        a = parseFloat(parts[0]);
        let bAndC = parts[1].split('=');
        b = parseFloat(bAndC[0]);
        c = parseFloat(bAndC[1]);
        x = (c - b) / a;
    } else if (type == 2) {
        let parts = eq.split('*x');
        a = parseFloat(parts[0]);
        let bb = parts[1].split('=');
        b = parseFloat(bb[1]);
        x = b / a;
    } else if (type == 3) {
        const aAndX = eq.split('(');
        const bAndC = eq.split(')');
        console.log(aAndX);
        console.log(bAndC);
        a = parseFloat(aAndX[0]);
        cc = bAndC[1].split('=');
        c = parseFloat(cc[1]);
        bb = bAndC[0].split('x');
        b = parseFloat(bb[1]);
        x = (c - a * b) / a;
    }

    // Округление до 3 знаков после запятой
    if (Number.isFinite(x) && x % 1 !== 0) {
    if (x.toString().split(".")[1]?.length > 3) {
        x = parseFloat(x.toFixed(3)); 
    }
}

    document.getElementById("answer").innerHTML = "Ответ: x = " + x;
}





// Решение квадратных уравнений

function findXQuad(eq, type) {
    let a, b, c;
    let result;

    // Если уравнение полного вида (ax^2 + bx + c = 0)
    if (type == 4) {
        // Извлекаем коэффициенты a, b и c из уравнения
        let parts = eq.split("*x");
        a = parseFloat(parts[0]); 
        b = parseFloat(parts[2]);
        c = parseFloat(parts[3].split("=")[0]);


        // Вычисляем дискриминант
        let discriminant = b * b - 4 * a * c;

        if (discriminant > 0) {
            // Два корня
            let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

            // Округление до 3 знаков после запятой
            if (Number.isFinite(x1) && x1 % 1 !== 0 && x1.toString().split(".")[1]?.length > 3) {
                x1 = parseFloat(x1.toFixed(3)); 
            }
            if (Number.isFinite(x2) && x2 % 1 !== 0 && x2.toString().split(".")[1]?.length > 3) {
                x2 = parseFloat(x2.toFixed(3)); 
            }

            result = "Ответ: x₁ = " + x1 + ", x₂ = " + x2 + ", D = " + discriminant;

        } else if (discriminant === 0) {
            // Один корень
            let x = -b / (2 * a);

            if (Number.isFinite(x) && x % 1 !== 0 && x.toString().split(".")[1]?.length > 3) {
                x = parseFloat(x.toFixed(3)); 
            }

            result = "Ответ: x = " + x + ", D = " + discriminant;

        } else {
            // Нет корней
            result = "Ответ: Нет корней";
        }

    } else if (type == 5) {
        // Уравнение неполного вида (ax^2 + b = 0 или ax^2 = 0)
        a = parseFloat(eq.split("*x")[0]);
        b = parseFloat(eq.split("*x*x")[1].split("x=")[0]);

        let x2 = -b / a;

        if (Number.isFinite(x2) && x2 % 1 !== 0 && x2.toString().split(".")[1]?.length > 3) {
            x2 = parseFloat(x2.toFixed(3)); 
        }

        result = "Ответ: x₁ = 0, x₂ = " + x2;
    }

    document.getElementById("answer").innerHTML = result;
}






// Решение тригонометрических уравнений
function findXTrig(eq) {
    const MQ = MathQuill.getInterface(2);
    const answerDiv = document.getElementById("answer");
    answerDiv.innerHTML = ""; // Очистка вывода

    const parts = eq.split("=");
    const lhs = parts[0];
    const rhs = parts[1];

    if (template_id == 6) {
        // sin(x)-тип
        const A = parseFloat(lhs.match(/(-?\d+)\*?sin\(x\)/)[1]);
        const B = parseFloat(lhs.match(/([+-]?\d+)(?!\*sin\(x\))/)[1]);
        const C = parseFloat(rhs);
        const sin_x = (C - B) / A;

        if (sin_x > 1 || sin_x < -1) {
            answerDiv.textContent = "Ответ: нет корней!";
            return;
        }

        const arcsinVal = Math.asin(sin_x);
        const x1 = arcsinVal.toFixed(2);
        const x2 = (Math.PI - arcsinVal).toFixed(2);

        const raw = sin_x;
        const formattedSin = (raw % 1 !== 0 && raw.toString().split('.')[1]?.length > 2)
            ? raw.toFixed(2)
            : raw.toString();

        const expressions = [
            `Ответ:`,
            `x = \\arcsin(${formattedSin}) + 2\\pi k`,
            `x = \\pi - \\arcsin(${formattedSin}) + 2\\pi k`,
            `x \\approx ${x1} + 2\\pi k`,
            `x \\approx ${x2} + 2\\pi k`
        ];

        expressions.forEach(expr => {
            const span = document.createElement("span");
            answerDiv.appendChild(span);
            MQ.StaticMath(span).latex(expr);
            answerDiv.appendChild(document.createElement("br"));
        });

    } else if (template_id == 7) {
        // cos(x)-тип
        const A = parseFloat(lhs.match(/(-?\d+)\*?cos\(x\)/)[1]);
        const B = parseFloat(lhs.match(/([+-]?\d+)(?!\*cos\(x\))/)[1]);
        const C = parseFloat(rhs);
        const cos_x = (C - B) / A;

        if (cos_x > 1 || cos_x < -1) {
            answerDiv.textContent = "Ответ: нет корней!";
            return;
        }

        const arccosVal = Math.acos(cos_x);
        const x1 = (Math.PI - arccosVal).toFixed(2);
        const x2 = (-Math.PI + arccosVal).toFixed(2);

        const raw = cos_x;
        const formattedCos = (raw % 1 !== 0 && raw.toString().split('.')[1]?.length > 2)
            ? raw.toFixed(2)
            : raw.toString();

        const expressions = [
            `Ответ:`,
            `x = \\pi - \\arccos(${formattedCos}) + 2\\pi k`,
            `x = -\\pi + \\arccos(${formattedCos}) + 2\\pi k`,
            `x \\approx ${x1} + 2\\pi k`,
            `x \\approx ${x2} + 2\\pi k`
        ];

        expressions.forEach(expr => {
            const span = document.createElement("span");
            answerDiv.appendChild(span);
            MQ.StaticMath(span).latex(expr);
            answerDiv.appendChild(document.createElement("br"));
        });
    }
}



// Преобразование уравнения для графика
function convertEquation(eq) {
    // Изменяем "=" на "-" или "=-" "+"
    eq =eq.replace('=', '-').replace('--', '+');

    return eq;
}





// Построение графика функции

function el(id){
    return document.getElementById( id );
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


// Рисование координатных осей
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

// Преобразование координат
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



// Подписи координат при наведении курсора
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

// Математические функции
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