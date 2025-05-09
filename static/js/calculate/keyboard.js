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

      // Устанавливаем активное поле
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

  // Обработка нажатий кастомной клавиатуры
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
                  if (latex.includes('{}') || latex.includes('\\left|\\right|')) {
                      activeMathField.write(latex);
                  } else {
                      activeMathField.cmd(latex);
                  }
                  activeMathField.focus(); // Важный момент: восстанавливаем фокус на MathQuill
              }

              // Важно обновить вывод
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
                  // Проверка на безопасный символ
                  const isSafe = /^[a-zA-Z0-9πe+\-*/.=]$/.test(latex);
                  if (!isSafe) return;

                  value = value.slice(0, start) + latex + value.slice(end);
                  activeInputField.value = value;
                  const newPos = start + latex.length;
                  activeInputField.setSelectionRange(newPos, newPos);
              }

              // Важно восстанавливать фокус и курсор
              activeInputField.focus();
              // Устанавливаем курсор в новую позицию
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



    // Собираем все нужные элементы
    const triggerElements = [
        ...document.querySelectorAll('input.input-key'),
        document.getElementById('math-field'),
        document.getElementById('func1-field'),
        document.getElementById('func2-field')
    ].filter(Boolean); // убираем null, если каких-то id нет

    function showKeyboard() {
        if (window.innerWidth < 1050) {
            keyboard.classList.add('visible');
        }
    }

    function hideKeyboard() {
        if (window.innerWidth < 1050) {
            keyboard.classList.remove('visible');
        }
    }

    // Показываем клавиатуру при касании или клике на нужные элементы
    triggerElements.forEach(el => {
        el.addEventListener('touchstart', showKeyboard);
        el.addEventListener('click', showKeyboard);
    });

    // Скрываем клавиатуру при клике вне
    document.addEventListener('click', (e) => {
        if (
            window.innerWidth < 1050 &&
            !keyboard.contains(e.target) &&
            !triggerElements.some(el => el.contains(e.target))
        ) {
            hideKeyboard();
        }
    });
    
});
