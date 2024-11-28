// ==UserScript==
// @name         Comment prompt with toggle
// @Author URL   https://civitai.com/user/infolk
// @version      1.1
// @description  Adds functionality to comment/uncomment the current line using Ctrl + /
// @author       Infolk
// @match        https://stable-diffusion-webui-automatic1111.com/*
// ==/UserScript==

(function () {
    'use strict';

    // Intercept prompt to ignore commented lines
    var promptOrig = window.prompt;
    window.prompt = function (text, defaultText) {
        if (text.trimStart().startsWith("#")) {
            return null;
        }
        return promptOrig(text, defaultText);
    };

    // Add event listener for keypress to toggle comments
    document.addEventListener("keydown", function (event) {
        // Check if Ctrl + / is pressed
        if (event.ctrlKey && event.key === "/") {
            // Prevent default browser action
            event.preventDefault();

            // Find the focused text area or input
            var activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
                toggleComment(activeElement);
            }
        }
    });

    // Toggle comment for the current line in the input or text area
    function toggleComment(inputElement) {
        var cursorPos = inputElement.selectionStart;
        var text = inputElement.value;

        // Find the start and end of the current line
        var lineStart = text.lastIndexOf("\n", cursorPos - 1) + 1;
        var lineEnd = text.indexOf("\n", cursorPos);
        if (lineEnd === -1) {
            lineEnd = text.length;
        }

        var line = text.slice(lineStart, lineEnd);

        // Toggle comment
        if (line.trimStart().startsWith("#")) {
            // Uncomment
            var uncommentedLine = line.replace(/^(\s*)#/, "$1");
            inputElement.value = text.slice(0, lineStart) + uncommentedLine + text.slice(lineEnd);
        } else {
            // Comment
            inputElement.value = text.slice(0, lineStart) + "#" + line + text.slice(lineEnd);
        }

        // Restore cursor position
        inputElement.selectionStart = cursorPos;
        inputElement.selectionEnd = cursorPos;
    }
})();
