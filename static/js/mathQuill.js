document.addEventListener('DOMContentLoaded', function() {

    var MQ = MathQuill.getInterface(2);  // Получаем интерфейс MathQuill для работы с формулами
    
// Инициализируем поле ввода MathQuill
var mathFieldSpan = document.getElementById('math-field');  // Находим элемент для ввода
var latexSpan = document.getElementById('latex');  // Находим элемент для отображения LaTeX
var processedLatexSpan = document.getElementById('func'); // Для отображения обработанного выражения

var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true,  // Пробел будет работать как табуляция
    handlers: {
        edit: function() {
            var latex = mathField.latex();  // Получаем текущее выражение в LaTeX
            latexSpan.textContent = latex;  // Отображаем исходный LaTeX

            // Преобразуем LaTeX в JavaScript-синтаксис
            var jsExpression = convertLaTeXToJS(latex);
            processedLatexSpan.textContent = jsExpression;  // Отображаем преобразованный JavaScript код

            // Пример вычисления выражения
            try {
                var result = eval(jsExpression);  // Вычисляем результат
                console.log("Результат:", result);
            } catch (e) {
                console.error("Ошибка в выражении:", e);
            }
        }
    }
});

function convertLaTeXToJS(latex) {
// Заменяем LaTeX-операторы на JavaScript
latex = latex.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');

// Заменяем на умножение
latex = latex.replace(/([0-9])([a-zA-Z\\sin|\\cos|\\tan|\\sqrt|\\log|\\exp|abs|acos|asin|atan|sign|pi|e])/g, '$1*$2');  

latex = latex.replace(/(x)\(/g, '$1*(');
// latex = latex.replace(/(\\sin|\\cos|\\tan|\\sqrt|\\log|\\exp|abs|acos|asin|atan|sign|pi|e)(?=\()/g, '$1');  



// Преобразуем LaTeX функции в JavaScript
latex = latex.replace(/\\sin/g, 'sin');
latex = latex.replace(/\\cos/g, 'Math.cos');
latex = latex.replace(/\\tan/g, 'Math.tan');
latex = latex.replace(/\\sqrt/g, 'Math.sqrt');
latex = latex.replace(/\\log/g, 'Math.log');
latex = latex.replace(/\\exp/g, 'Math.exp');
latex = latex.replace(/\^/g, '**');  // В LaTeX используется ^ для степени, а в JS - **
latex = latex.replace(/abs/g, 'Math.abs');
latex = latex.replace(/acos/g, 'Math.acos');
latex = latex.replace(/asin/g, 'Math.asin');
latex = latex.replace(/atan/g, 'Math.atan');
latex = latex.replace(/sign/g, 'Math.sign');
latex = latex.replace(/pi/g, 'Math.PI');  // Преобразуем \pi в Math.PI
latex = latex.replace(/e/g, 'Math.E');  // Преобразуем e в Math.E

latex = latex.replace(/\\cdot/g, '*'); // Преобразуем \cdot в умножение

// Преобразуем дроби
latex = latex.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/($2))');  
latex = latex.replace(/{/g, '(').replace(/}/g, ')'); // Заменяем фигурные скобки на круглые

return latex;
}

});