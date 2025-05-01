document.addEventListener('DOMContentLoaded', function () {
    var MQ = MathQuill.getInterface(2);

    function setupMathField(fieldId, latexId, resultId) {
        var fieldSpan = document.getElementById(fieldId);
        var latexSpan = document.getElementById(latexId);
        var resultSpan = document.getElementById(resultId);

        if (!fieldSpan) return;

        var mathField = MQ.MathField(fieldSpan, {
            spaceBehavesLikeTab: true,
            handlers: {
                edit: function () {
                    var latex = mathField.latex();
                    latexSpan.textContent = latex;

                    var jsExpression = convertLaTeXToJS(latex);
                    resultSpan.textContent = jsExpression;

                    try {
                        var result = eval(jsExpression);
                        console.log("Результат:", result);
                    } catch (e) {
                        console.error("Ошибка в выражении:", e);
                    }
                }
            }
        });
    }

    function convertLaTeXToJS(latex) {
        latex = latex.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
        latex = latex.replace(/([0-9])([a-zA-Z\\sin|\\cos|\\tan|\\sqrt|\\log|\\exp|abs|acos|asin|atan|sign|pi|e])/g, '$1*$2');
        latex = latex.replace(/(x|t)\(/g, '$1*(');

        latex = latex.replace(/\\sin/g, 'Math.sin');
        latex = latex.replace(/\\cos/g, 'Math.cos');
        latex = latex.replace(/\\tan/g, 'Math.tan');
        latex = latex.replace(/\\sqrt/g, 'Math.sqrt');
        latex = latex.replace(/\\log/g, 'Math.log');
        latex = latex.replace(/\\exp/g, 'Math.exp');
        latex = latex.replace(/\^/g, '**');
        latex = latex.replace(/abs/g, 'Math.abs');
        latex = latex.replace(/acos/g, 'Math.acos');
        latex = latex.replace(/asin/g, 'Math.asin');
        latex = latex.replace(/atan/g, 'Math.atan');
        latex = latex.replace(/sign/g, 'Math.sign');
        latex = latex.replace(/pi/g, 'Math.PI');
        latex = latex.replace(/e/g, 'Math.E');
        latex = latex.replace(/\\cdot/g, '*');
        latex = latex.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/($2))');
        latex = latex.replace(/{/g, '(').replace(/}/g, ')');

        return latex;
    }

    // Настройка каждого поля
    setupMathField('math-field', 'latex', 'func');      // Обычная функция от x
    setupMathField('func1-field', 'func1-latex', 'func1'); // Параметрическая x = ...
    setupMathField('func2-field', 'func2-latex', 'func2'); // Параметрическая y = ...
});
