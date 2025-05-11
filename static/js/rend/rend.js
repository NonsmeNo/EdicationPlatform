document.addEventListener('DOMContentLoaded', function() {


// 🔧 ОСНОВНЫЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ
const canv = el('canvas');
const btnShowGraph = el('btnShowGraph');
const btnShowAnsw = el('btnShowAnsw');
const answer = el('answer');
const template_value = el('template-value');
const template_latex = el('template-latex');
const template_id = el('template-id').value;
const colors = ['#01AB9F', '#FF7A5A', '#EE82EE', '#9A80F6', '#82AFFB'];

// 👻 НАСТРОЙКА НАЧАЛЬНОГО ОТОБРАЖЕНИЯ ЭЛЕМЕНТОВ
canv.style.display = 'none';
answer.style.display = 'none';

// 📐 КООРДИНАТНАЯ СИСТЕМА
x_left = -10;
x_right = 10;
y_down = x_left;
y_up = x_right;

// 🖼️ ПОДГОТОВКА CANVAS
canv.style.display = 'block';
canv.width = canv.clientWidth;
canv.height = canv.clientHeight;
const width = canv.width;
const height = canv.height;
canv.style.display = 'none';

const ctx = canv.getContext('2d');
drow_start();
drow_axes();



// 🧪 ГЕНЕРАЦИЯ ЗАДАНИЯ
const example_task = create_task();
document.getElementById("output").innerHTML = example_task;


// -----------------------------------
// СОБЫТИЯЯ
// 💾 СОХРАНЕНИЕ ЗАДАНИЯ НА СЕРВЕР

const SaveButton = el('btnSave');
if (btnSave) {
    SaveButton.addEventListener('click', () => {
        const task = example_task; // Переменная task_example, которую добавить в базу данных
        const theme_id = el('theme-id').value; // ID темы, к которой добавить задачу

        fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({task, theme_id, template_id}),
        })
        .then(response => response.json())
        .then(data => {
            // Обработка ответа от сервера
            console.log('Task added successfully:', data);
            alert('Задание сохранено!')
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}


// 🧠 ОТОБРАЖЕНИЕ ОТВЕТА ПРИ НАЖАТИИ КНОПКИ

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


// 📊 ОТОБРАЖЕНИЕ ГРАФИКА ПРИ НАЖАТИИ КНОПКИ
btnShowGraph.addEventListener('click', () => {

    // Показать canvas
    if (canv.style.display == 'none'){
        canv.style.display = 'block';

        btnShowGraph.textContent = 'Скрыть график';
        let str_graph = "";
        if (template_id == 1 || template_id == 2 || template_id == 3) {
            str_graph = convertEquation(example_task);
        } else if (template_id == 4 || template_id == 5) {
            str_graph = example_task.replace('^2', '*x');
            str_graph = str_graph.replace('=0', '');
        } else if (template_id == 6 || template_id == 7) {
            str_graph = convertEquation(example_task);
            console.log(str_graph);
        }

        drow_axes();
        let randomNumber = Math.floor(Math.random() * 5);
        draw_graph(str_graph, colors[randomNumber]);

    }
    else {
        canv.style.display = 'none';
        btnShowGraph.textContent = 'Показать график';
    }

});


//  ----------------------------
// 🧩 ФУНКЦИИ

// 🎲 Случайное задание

function create_task() {

    let task = template_value.value;

    for (let i = 0; i < task.length; i++) {
        if (task[i] === '@') {
            let randomNumber = Math.floor(Math.random() * 9) + 1; // генерируем случайное число от 1 до 9
            task = task.substring(0, i) + randomNumber + task.substring(i + 1); // преобразуем число в строку и добавляем к новой строке
        }
        if (task[i] === '$') {
            let randomSign = Math.random() < 0.5 ? '+' : '-'; // // Генерируем случайный знак + или -
            task = task.substring(0, i) + randomSign + task.substring(i + 1); //  добавляем к новой строке
        }

    }
    // Убираем первый знак +, если он есть в начале строки
    if (task[0] === '+') {
        task = task.substring(1);
    }

    task = task.replace('=+', '=').replace('=-', '=-');

    //проверка на корни
    if (template_id == 4) {

            task_check = task.replace('^2', '*x');
            let a, b, c;
            let parts = task_check.split("*x");
            a = parseFloat(parts[0]);
            b = parseFloat(parts[2]);
            c = parseFloat(parts[3].split("=")[0]);
            let discriminant = b*b - 4*a*c;
            if (discriminant < 0) {
                return create_task();
            }
        }

    return task;
}


// 🧮 Решение линейных уравнений
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
    document.getElementById("answer").innerHTML = "Ответ: x = " + x;
}





// 📐 Решение квадратных уравнений

function findXQuad(eq, type) {
let a, b, c;

// Если уравнение полного вида (ax^2 + bx + c = 0)
if (type == 4) {
    // Извлекаем коэффициенты a, b и c из уравнения
    let parts = eq.split("*x");
    a = parseFloat(parts[0]); 
    b = parseFloat(parts[2]);
    c = parseFloat(parts[3].split("=")[0]);
    
    // Вычисляем дискриминант
    let discriminant = b * b - 4 * a * c;

    // Находим корни уравнения в зависимости от дискриминанта
    if (discriminant > 0) {
        // Два корня
        let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

            // Отображение ответа
        let result = "Ответ: x1 = " + x1.toFixed(2) + ", x2 = " + x2.toFixed(2);
        result += ", D = " + discriminant; 
        document.getElementById("answer").innerHTML = result;
    } else if (discriminant === 0) {
        // Один корень
        let x = -b / (2 * a);
        let result = "Ответ: x = " + x + ", D = " + discriminant;
        document.getElementById("answer").innerHTML = result;

    } else {
        // Нет корней
        document.getElementById("answer").innerHTML = "Ответ: Нет корней";
    }

// Если уравнение неполного вида (ax^2 + b = 0 или ax^2 = 0)
} else if (type == 5) {
    // Извлекаем коэффициенты a и b
    a = parseFloat(eq.split("*x")[0]);
    b = parseFloat(eq.split("*x*x")[1].split("x=")[0]);

    // Для неполного уравнения решаем: x1 = 0, x2 = -b/a
    let result = "Ответ: x1 = 0, x2 = " + (b * (-1) / a).toFixed(2);
    document.getElementById("answer").innerHTML = result;
}
}




// 🌊 Решение тригонометрических уравнений
function findXTrig(eq) {
    if (template_id == 6) {
        const parts = eq.split("=");
        const lhs = parts[0];
        const rhs = parts[1];

        const A = parseFloat(lhs.match(/(-?\d+)\*?sin\(x\)/)[1]);
        const B = parseFloat(lhs.match(/([+-]?\d+)(?!\*sin\(x\))/)[1]);
        const C = parseFloat(rhs);

        console.log("A:", A);
        console.log("B:", B);
        console.log("C:", C);

        sin_x = (C-B)/A;
        if (sin_x>1 || sin_x<-1) {
            document.getElementById("answer").innerHTML = "Ответ: нет корней!";
        } else {
            document.getElementById("answer").innerHTML = "Ответ: <br> x = arcsin(" +
            sin_x.toFixed(2) + ") + 2pi*k<br> x = pi - arcsin(" + sin_x.toFixed(2) + ") + 2pi*k <br><br> x = "
            + Math.asin(sin_x).toFixed(2) + " + 2pi*k<br> x = " + (3.14-Math.asin(sin_x)).toFixed(2) + " + 2pi*k<br>";
        }
    } else if (template_id == 7) {
        const parts = eq.split("=");
        const lhs = parts[0];
        const rhs = parts[1];

        const A = parseFloat(lhs.match(/(-?\d+)\*?cos\(x\)/)[1]);
        const B = parseFloat(lhs.match(/([+-]?\d+)(?!\*cos\(x\))/)[1]);
        const C = parseFloat(rhs);

        console.log("A:", A);
        console.log("B:", B);
        console.log("C:", C);

        cos_x = (C-B)/A;
        if (cos_x>1 || cos_x<-1) {
            document.getElementById("answer").innerHTML = "Ответ: нет корней!";
        } else {
            document.getElementById("answer").innerHTML = "Ответ: <br> x = pi - arccos(" +
            cos_x.toFixed(2) + ") + 2pi*k<br> x = -pi+arccos(" + cos_x.toFixed(2) + ") + 2pi*k <br><br> x = "
            + (3.14-Math.acos(cos_x)).toFixed(2) + " + 2pi*k<br> x = " + (-3.14+Math.acos(cos_x)).toFixed(2) + " + 2pi*k<br>";
        }
    }

}




// 🔄 Преобразование уравнения для графика
function convertEquation(eq) {
    // Изменяем "=" на "-" или "=-" "+"
    eq =eq.replace('=', '-').replace('--', '+');

    return eq;
}

//  🛠️ Функция для получения элемента по ID
function el(id) {
return document.getElementById(id);
}


// 📈 Построение графика функции
function draw_graph(str, color) {
let y_down = x_left;  // Нижний предел по оси Y
let y_up = x_right;   // Верхний предел по оси Y
let step = 0.01;      // Шаг по оси X

let x = x_left;       // Начальное значение X
let y = eval(str);    // Вычисляем значение Y для функции
let x_canv = x2canv(x);  // Преобразуем X в координаты канваса
let y_canv = y2canv(y);  // Преобразуем Y в координаты канваса

ctx.beginPath();      // Начинаем рисование
ctx.moveTo(x_canv, y_canv); 
ctx.lineWidth = 2;  
ctx.strokeStyle = color;
let f = 1;          

// Рендеринг графика
for (let i = 0; i < x_right * 2; i += 0.01) {
    x = Number(x) + step;     // Увеличиваем X на шаг
    y = eval(str);             // Пересчитываем Y

    // Проверяем, в пределах ли Y
    if (y <= y_up * 2 && y >= y_down * 2) {
        x_canv = x2canv(x);    
        y_canv = y2canv(y);   

        if (f == 0) {
            ctx.beginPath();
            ctx.moveTo(x_canv, y_canv); // Начинаем новый отрезок 
            f = 1;
        }
        ctx.lineTo(x_canv, y_canv);
    } else {
        if (f == 1) {
            ctx.stroke();  // Завершаем отрезок
            f = 0;
        }
    }
}
if (f == 1) {
    ctx.stroke();
}
}


// ➕ Рисование координатных осей
function drow_axes(){
    ctx.globalAlpha = 1.0;
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


// 🔁 Преобразование координат
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


// 🧭 Подписи координат при наведении курсора
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