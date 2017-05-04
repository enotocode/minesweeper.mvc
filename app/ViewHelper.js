'use strict';

// Export the class
module.exports = ViewHelper;

// Dependencies
var Cell = require('./Cell');
var eventListenerPolyfill = require('../lib/eventListener.polyfill').eventListenerPolyfill();

/**
 * Static class with some helpful function for BrowserView
 */
function ViewHelper() {}


/**
 * Проеверяет есть ли у переданного элемента переданный класс
 *
 * @param {DOMNode}  node  - DOM элемент
 * @param {string}  klass  - Проверяемый класс
 * @return {boolen}        - Результат проверки
 */
ViewHelper.hasClass = function(node, klass) {
    
    var classes = node.className.split(/\s/);
    for(var i = 0; i < classes.length; i++) {
        if (classes[i] == klass) {
            return true;        
        }
    }
    return false;
}

/**
 * Добавляет класс элементу, если у него еще нет переданного класса
 *
 * @param {DOMNode}  node      - DOM элемент
 * @param {string}  klass      - Добаляемый класс
 * @return {(DOMNode|null)}    - Возвращает дом-элемент в случае удачи, или null, если не удалось назначить класс
 */
ViewHelper.addClass = function(node, klass) {

    var hasCheck = ViewHelper.hasClass(node, klass);
        
    if (!hasCheck) {
        var className = node.className;
        className += " " + klass;
        // Delete space char in beginning and in end of string
        var regexp = new RegExp('^\\s|\\s$');
        className = className.replace(regexp, "");
        node.className = className;
        return node;
    }
    return null;    
}

/**
 * Удаляет класс элемента, если он имеет переданный класс
 *
 * @param {DOMNode}  node      - DOM элемент
 * @param {string}  klass      - Удаляемый класс
 * @return {(DOMNode|null)}    - Возвращает дом-элемент в случае удачи, или null, если не удалось удалить класс
 */
ViewHelper.removeClass = function(node, klass) {
    if (ViewHelper.hasClass(node, klass)) {
        var regexp = new RegExp('\\b' + klass + '\\b', 'i');
        var className = node.className
        className = className.replace(regexp, "");
        // Deleting double space
        className = className.replace("  ", " ");
        
        node.className = className;
        return node;
    }    
    return null;
}

/**
 * Add listener to multiple objects by delegation to ancestor
 * @param {NODElem} ancestorObj - Ancestor of NODElements
 * @param {String} targetTagName - TagName of target element
 * @param {String} type - Trigger event
 * @param {function} listener - Executing function
 * @param {string} forGloryOfArgumentsGod - Number which mouse button (event.which) on mousedown
 */
ViewHelper.addDelegateListener = function(ancestorObj, targetTagName, type, listener, forGloryOfArgumentsGod) {
    
    ancestorObj.addEventListener(type, checkTagName);
    
    function checkTagName(event) {        

        var target = event.target;
        
        // ie8 fix for which
        if (!event.which && event.button) { // если which нет, но есть button... (IE8-)
            if (event.button & 1) event.which = 1; // левая кнопка
            else if (event.button & 4) event.which = 2; // средняя кнопка
            else if (event.button & 2) event.which = 3; // правая кнопка
        }
        
        // Delegating event  
        while (target != ancestorObj) {
            
            if (target.tagName === targetTagName) {

                if (forGloryOfArgumentsGod && event.which == forGloryOfArgumentsGod ||
                    !(forGloryOfArgumentsGod)) {
                    
                    listener(target);                    
               
                }
            }
            
            target = target.parentNode;
        }
    }
}

