'use strict';

function ViewHelper() {}

/**
 * Create Cell from extracted cell's coordinates from DOMElement's id=x0y3
 * @param {DOMElement} DOMElement - Element containing id with coordinates
 * @return {cell}  - Cell
 */
ViewHelper.createCellFromId = function(domElement) {

    var id = domElement.id;    
    var arrayOfCoordinates = id.split(/\D/);
    
    var cell = new Cell(arrayOfCoordinates[1], arrayOfCoordinates[2]);    
    
    return  cell;
}

/**
 * Create id with coordinates of Cell 
 * @param {Cell} cell - Cell object
 * @return {string} - Cell's id with coordinates 'id=x0y3'
 */
ViewHelper.createIdFromCoordinates = function(cell) {
    return 'x' + cell.x + 'y' + cell.y;
}


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
        var regexp = new RegExp('^\\s|\\s$', 'iu');
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
