document.addEventListener('DOMContentLoaded', function () {
  const MQ = MathQuill.getInterface(2);
  let activeMathField = null;
  let activeInputField = null;

  const fields = {
      'math-field': null,
      'func1-field': null,
      'func2-field': null
  };

  const fieldToLatexAndResult = {
      'math-field': ['latex', 'func'],
      'func1-field': ['func1-latex', 'func1'],
      'func2-field': ['func2-latex', 'func2']
  };

  function convertLaTeXToJS(latex) {
        latex = latex.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')'); //замена скобок latex на обычные
        latex = latex.replace(/\\left\|([^|]*)\\right\|/g, 'Math.abs($1)');
        // умножения
        latex = latex.replace(/(x|t)\(/g, '$1*('); // добавление между (x или t) и скобкой знака умножения
        latex = latex.replace(/(\d+|pi|e)\s*(?=[a-zA-Z])(?!xp)/g, '$1*'); // между константой и переменной
        latex = latex.replace(/(\d+)\s*(\\pi|\be\b|\\?(sin|cos|tan|sqrt|log|exp|abs|acos|asin|atan|sign))/g, '$1*$2'); // между числом и константой
        latex = latex.replace(/(\\(?:sin|cos|tan|sqrt|log|exp|abs|acos|asin|atan|sign|pi)|\be\b|pi|e)\s*(\d+)/g, '$1*$2');// между константой и числом
        latex = latex.replace(/(\d+|\\pi|\bpi\b|\be\b|e)\s*(?=\()/g, '$1*'); 

        latex = latex.replace(/\\exp/g, 'Math.exp');
        latex = latex.replace(/\\arccos/g, 'Math.acos');
        latex = latex.replace(/\\arcsin/g, 'Math.asin');
        latex = latex.replace(/\\arctan/g, 'Math.atan');
        latex = latex.replace(/sign/g, 'Math.sign');


        latex = latex.replace(/\\sin/g, 'Math.sin');
        latex = latex.replace(/\\cos/g, 'Math.cos');
        latex = latex.replace(/\\tan/g, 'Math.tan');
        latex = latex.replace(/\\sqrt/g, 'Math.sqrt');
        latex = latex.replace(/\\log/g, 'Math.log');
        latex = latex.replace(/\^/g, '**');

        latex = latex.replace(/\\pi/g, 'Math.PI');
        latex = latex.replace(/e(?!xp)/g, 'Math.E');
      latex = latex.replace(/\\cdot/g, '*');
      latex = latex.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/($2))');
      latex = latex.replace(/{/g, '(').replace(/}/g, ')');

      return latex;
  }

  function updateOutput(fieldId, mathField) {
      const [latexId, resultId] = fieldToLatexAndResult[fieldId];
      const latexSpan = document.getElementById(latexId);
      const resultSpan = document.getElementById(resultId);
      const latex = mathField.latex();
      if (latexSpan) latexSpan.textContent = latex;

      try {
          const jsExpression = convertLaTeXToJS(latex);
          if (resultSpan) resultSpan.textContent = jsExpression;
      } catch (e) {
          if (resultSpan) resultSpan.textContent = 'Ошибка';
      }
  }


Object.keys(fields).forEach(fieldId => {
    const fieldSpan = document.getElementById(fieldId);
    if (!fieldSpan) return;

    const mathField = MQ.MathField(fieldSpan, {
        spaceBehavesLikeTab: true,
        handlers: {
            edit: function () {
                updateOutput(fieldId, mathField);
            }
        }
    });

    fields[fieldId] = mathField;

    // Устанавливаем начальные примеры
    if (fieldId === 'math-field') {
        mathField.latex('sin(x)');
        updateOutput(fieldId, mathField);
    }
    if (fieldId === 'func1-field') {
        mathField.latex('cos(t)');
        updateOutput(fieldId, mathField);
    }
    if (fieldId === 'func2-field') {
        mathField.latex('sin(t)');
        updateOutput(fieldId, mathField);
    }

    fieldSpan.addEventListener('mousedown', () => {
        activeMathField = mathField;
    });
});

  // Для input полей
  document.querySelectorAll('input[type="number"], input[type="text"]').forEach(inputField => {
      inputField.addEventListener('focus', () => {
          activeInputField = inputField;
      });
  });


  // Обработка нажатий клавиатуры
  document.querySelectorAll('.keyboard button').forEach(button => {
      button.addEventListener('click', () => {
          if (!activeInputField && !activeMathField) return;

          const latex = button.getAttribute('data-latex');
          const action = button.getAttribute('data-action');

          // Для MathQuill поля
          if (activeMathField) {
            if (action) {
                switch (action) {
                    case 'left': activeMathField.keystroke('Left'); break;
                    case 'right': activeMathField.keystroke('Right'); break;
                    case 'backspace': activeMathField.keystroke('Backspace'); break;
                    case 'enter': activeMathField.keystroke('Enter'); break;
                }
            } else if (latex) {
                const functionsWithBrackets = ['\\sin', '\\cos', '\\tan', '\\log', '\\exp', 
                    'abs', 'arccos', 'arcsin', 'arctan'];

                if (functionsWithBrackets.includes(latex)) {
                    activeMathField.write(`${latex}\\left(\\right)`);
                    activeMathField.keystroke('Left'); // курсор внутрь скобок
                } else if (latex.includes('{}') || latex.includes('\\left|\\right|')) {
                    activeMathField.write(latex);
                } else {
                    activeMathField.cmd(latex);
                }
                activeMathField.focus(); // вернуть фокус
            }

            updateOutput('math-field', activeMathField);
        }
          // Для input поля
          if (activeInputField) {
              // Сохраняем позицию курсора
              const start = activeInputField.selectionStart;
              const end = activeInputField.selectionEnd;
              let value = activeInputField.value;

              if (action === 'backspace') {
                  if (start > 0) {
                      value = value.slice(0, start - 1) + value.slice(end);
                      activeInputField.value = value;
                      activeInputField.setSelectionRange(start - 1, start - 1);
                  }
              } else if (action === 'left' || action === 'right') {
                  const shift = action === 'left' ? -1 : 1;
                  const newPos = Math.max(0, Math.min(value.length, start + shift));
                  activeInputField.setSelectionRange(newPos, newPos);
              } else if (latex) {
                  const isSafe = /^[a-zA-Z0-9πe+\-*/.=]$/.test(latex);
                  if (!isSafe) return;

                  value = value.slice(0, start) + latex + value.slice(end);
                  activeInputField.value = value;
                  const newPos = start + latex.length;
                  activeInputField.setSelectionRange(newPos, newPos);
              }
              activeInputField.focus();
              activeInputField.setSelectionRange(start + latex.length, start + latex.length);
          }
      });
  });




    // ---------------------------------
    // Видимость клавиатуры 
    
    const keyboard = document.querySelector('.keyboard');
    const keyboardBtn = document.getElementById('keyboard-icon-btn');
    const hideParamBtn = document.querySelector('.hide-param-btn');

    const keyboardFuncBtn = document.getElementById('keybord-func-btn');
    const keyboardFunc = document.querySelector('.keybord-functions');

    keyboardBtn.addEventListener('click', () => {
        const isVisible = keyboard.classList.toggle('visible');
        keyboardFunc.style.display = 'none';
    
        if (isVisible) {
            keyboard.style.display = 'flex';
            keyboardBtn.style.bottom = '195px';
        } else {
            keyboard.style.display = 'none';
            keyboardBtn.style.bottom = '10px';
        }
    });

    hideParamBtn.addEventListener('click', () => {
        keyboard.style.display = 'none';
        keyboardBtn.style.bottom = '10px';
        keyboard.classList.remove('visible');

        keyboardFunc.style.display = 'none';
    });

    keyboardFuncBtn.addEventListener('click', () => {
        keyboardFunc.style.display = keyboardFunc.style.display === 'grid' ? 'none' : 'grid';
    });  

    const triggerElements = [
    ...document.querySelectorAll('input.input-key'),
    document.getElementById('math-field'),
    document.getElementById('func1-field'),
    document.getElementById('func2-field')
].filter(Boolean);

triggerElements.forEach(el => {
    el.addEventListener('click', () => {
        if (el.id && fields[el.id]) {
            fields[el.id].focus();   // MathQuill поле
        } else if (el.tagName === 'INPUT') {
            el.focus();              // Обычный input
        }
    });

    el.addEventListener('touchstart', () => {
        if (el.id && fields[el.id]) {
            fields[el.id].focus();
        } else if (el.tagName === 'INPUT') {
            el.focus();
        }
    });
});


    
    
});
