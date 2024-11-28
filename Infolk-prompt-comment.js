// ==UserScript==
// @name         Comment prompt with styling
// @version      1.2
// @description  Adds Ctrl + / for commenting lines and styles commented lines in the prompt box
// @author       You
// @match        *://*/*
// ==/UserScript==

(function () {
    'use strict';
    // Обработчик Ctrl + /
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'Y') {
            window.prompt("Test message with #comment");
        }

        if (event.ctrlKey && event.key === '/') {
            const activeElement = document.activeElement;

            if (activeElement.tagName === 'TEXTAREA') {
                event.preventDefault();

                const textarea = activeElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                const lines = textarea.value.split('\n');
                const cursorLineStart = textarea.value.slice(0, start).split('\n').length - 1;
                const cursorLineEnd = textarea.value.slice(0, end).split('\n').length - 1;

                // Для каждой строки в выделении
                for (let i = cursorLineStart; i <= cursorLineEnd; i++) {
                    const line = lines[i].trimStart(); // Убираем начальные пробелы для корректной проверки

                    // Если строка не начинается с # или # не в начале строки
                    if (!line.startsWith('#')) {
                        const commentIndex = line.indexOf('#');
                        if (commentIndex === -1) {
                            // Если нет #, то добавляем его в начало строки
                            lines[i] = '#' + lines[i];
                        } else {
                            // Если # есть в строке, скрываем всё, что после # (до конца строки)
                            lines[i] = line.slice(0, commentIndex);
                        }
                    } else {
                        // Если строка начинается с #, то убираем комментарий
                        lines[i] = line.replace(/^\s*#\s*/, ''); // Удаляем # и лишние пробелы
                    }
                }

                // Обновляем текст в textarea
                const updatedValue = lines.join('\n');
                const delta = updatedValue.length - textarea.value.length;

                textarea.value = updatedValue;

                // Сохраняем выделение с учётом изменений
                textarea.setSelectionRange(start + delta, end + delta);
            }
        }
    });
})();
