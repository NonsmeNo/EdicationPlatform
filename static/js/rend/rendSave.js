document.addEventListener('DOMContentLoaded', function() {


    const canv = el('canvas');
    const btnShowGraph = el('btnShowGraph');
    const btnShowAnsw = el('btnShowAnsw');
    const answer = el('answer');
    const template_id = el('template-id').value;
    const colors = [
		'#01AB9F',
		'#FF7A5A',
		'#EE82EE',
		'#9A80F6',
		'#82AFFB'
	];


    // Скрыть canvas изначально
    canv.style.display = 'none';
    answer.style.display = 'none';

    const width = 800;
	const height = 800;


	x_left = -10;
	x_right = 10;
	y_down = x_left;
	y_up = x_right;

    //на старте
	const ctx = canv.getContext('2d');
	drow_start();
	drow_axes();


    const example_task = el('task-task').value;
    console.log(example_task);
    document.getElementById("output").innerHTML = example_task;

// Обработчик события для кнопки "Показать ответ"
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


    // Обработчик события для кнопки "Показать график"
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
    function findXQuad(eq, type) {
    let a,b,c;
        if (type == 4) {
            // Извлекаем коэффициенты a, b и c
          let parts = eq.split("*x");
          a = parseFloat(parts[0]);
          b = parseFloat(parts[2]);
          c = parseFloat(parts[3].split("=")[0]);
          console.log(a);
          console.log(b);
          console.log(c);

          // Вычисляем дискриминант
          let discriminant = b*b - 4*a*c;
            console.log(discriminant);
          // Находим корни уравнения
          if (discriminant > 0) {
            let x1 = (-b + Math.sqrt(discriminant)) / (2*a);
            let x2 = (-b - Math.sqrt(discriminant)) / (2*a);
            document.getElementById("answer").innerHTML = "Ответ: x1 = " + x1.toFixed(2) + ", x2 = " + x2.toFixed(2) + ", D = " + discriminant;
          } else if (discriminant === 0) {
            let x = -b / (2*a);
            document.getElementById("answer").innerHTML = "Ответ: x = " + x + ", D = " + discriminant;
          } else {
            document.getElementById("answer").innerHTML = "Ответ: Нет корней";
          }

        } else if (type == 5) {
             // Извлекаем коэффициенты a, b и c
          a = parseFloat(eq.split("*x")[0]);
          b = parseFloat(eq.split("*x*x")[1].split("x=")[0])
          console.log(a);
          console.log(b);
          document.getElementById("answer").innerHTML = "Ответ: x1 = 0, x2 = " + (b*(-1)/a).toFixed(2);
        }
    }

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


    function convertEquation(eq) {
        // Изменяем "=" на "-" или "=-" "+"
        eq =eq.replace('=', '-').replace('--', '+');

        return eq;
    }













    //отображение графикоовввв
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