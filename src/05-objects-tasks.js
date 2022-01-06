/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() { return width * height; },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  elementOrder: 100000,
  idOrder: 10000,
  classOrder: 1000,
  attributeOrder: 100,
  pseudoClassOrder: 10,
  pseudoElementOrder: 1,

  element(value) {
    const obj = Object.create(this);
    if (Object.prototype.hasOwnProperty.call(this, 'storage')) {
      obj.storage = this.storage;
    } else obj.storage = {};

    const currentOrder = this.elementOrder;

    if (Object.prototype.hasOwnProperty.call(this, 'order')) {
      obj.order = this.order;
      if (currentOrder <= obj.order) {
        obj.order = currentOrder;
      } else {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    } else {
      obj.order = currentOrder;
    }

    if (obj.storage.element) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    obj.storage.element = value;


    return obj;
  },
  id(value) {
    const obj = Object.create(this);
    if (Object.prototype.hasOwnProperty.call(this, 'storage')) {
      obj.storage = this.storage;
    } else obj.storage = {};

    const currentOrder = this.idOrder;

    if (Object.prototype.hasOwnProperty.call(this, 'order')) {
      obj.order = this.order;
      if (currentOrder <= obj.order) {
        obj.order = currentOrder;
      } else {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    } else {
      obj.order = currentOrder;
    }

    if (obj.storage.id) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    obj.storage.id = `#${value}`;
    return obj;
  },
  class(value) {
    const obj = Object.create(this);
    if (Object.prototype.hasOwnProperty.call(this, 'storage')) {
      obj.storage = this.storage;
    } else obj.storage = {};

    const currentOrder = this.classOrder;

    if (Object.prototype.hasOwnProperty.call(this, 'order')) {
      obj.order = this.order;
      if (currentOrder <= obj.order) {
        obj.order = currentOrder;
      } else {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    } else {
      obj.order = currentOrder;
    }

    if (!Object.prototype.hasOwnProperty.call(obj.storage, 'class')) obj.storage.class = [];
    obj.storage.class.push(`.${value}`);
    return obj;
  },
  attr(value) {
    const obj = Object.create(this);
    if (Object.prototype.hasOwnProperty.call(this, 'storage')) {
      obj.storage = this.storage;
    } else obj.storage = {};

    const currentOrder = this.attributeOrder;

    if (Object.prototype.hasOwnProperty.call(this, 'order')) {
      obj.order = this.order;
      if (currentOrder <= obj.order) {
        obj.order = currentOrder;
      } else {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    } else {
      obj.order = currentOrder;
    }

    if (!Object.prototype.hasOwnProperty.call(obj.storage, 'attr')) obj.storage.attr = [];
    obj.storage.attr.push(`[${value}]`);
    return obj;
  },
  pseudoClass(value) {
    const obj = Object.create(this);
    if (Object.prototype.hasOwnProperty.call(this, 'storage')) {
      obj.storage = this.storage;
    } else obj.storage = {};


    const currentOrder = this.pseudoClassOrder;

    if (Object.prototype.hasOwnProperty.call(this, 'order')) {
      obj.order = this.order;
      if (currentOrder <= obj.order) {
        obj.order = currentOrder;
      } else {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    } else {
      obj.order = currentOrder;
    }

    if (!Object.prototype.hasOwnProperty.call(obj.storage, 'pseudoClass')) obj.storage.pseudoClass = [];
    obj.storage.pseudoClass.push(`:${value}`);
    return obj;
  },
  pseudoElement(value) {
    const obj = Object.create(this);
    if (Object.prototype.hasOwnProperty.call(this, 'storage')) {
      obj.storage = this.storage;
    } else obj.storage = {};

    const currentOrder = this.pseudoElementOrder;

    if (Object.prototype.hasOwnProperty.call(this, 'order')) {
      obj.order = this.order;
      if (currentOrder <= obj.order) {
        obj.order = currentOrder;
      } else {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    } else {
      obj.order = currentOrder;
    }

    if (obj.storage.pseudoElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }


    obj.storage.pseudoElement = `::${value}`;
    return obj;
  },
  combine(selector1, combinator, selector2) {
    const A = selector1.stringify();
    const B = selector2.stringify();
    const C = ` ${combinator} `;
    const obj = Object.create(cssSelectorBuilder);
    obj.resultString = A + C + B;
    return obj;
  },
  stringify() {
    if (Object.prototype.hasOwnProperty.call(this, 'resultString')) return this.resultString;
    const obj = Object.create(this);

    if (Object.prototype.hasOwnProperty.call(this, 'storage')) {
      obj.storage = this.storage;
    } else obj.storage = {};

    let s = '';
    if (obj.storage.element) s += obj.storage.element;
    if (obj.storage.id) s += obj.storage.id;
    if (obj.storage.class) s += obj.storage.class.join('');
    if (obj.storage.attr) s += obj.storage.attr.join('');
    if (obj.storage.pseudoClass) s += obj.storage.pseudoClass.join('');
    if (obj.storage.pseudoElement) s += obj.storage.pseudoElement;
    return s;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
