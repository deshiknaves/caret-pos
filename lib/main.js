(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['caret-position'] = {})));
}(this, (function (exports) { 'use strict';

const attributes = ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderTopWidth', 'boxSizing', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'letterSpacing', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'outlineWidth', 'overflow', 'overflowX', 'overflowY', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'textAlign', 'textOverflow', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap'];

/**
 * Create a mirror
 *
 * @param {Element} element The element
 * @param {string} html The html
 *
 * @return {Object} The mirror object
 */
const createMirror = (element, html) => {

  /**
   * The mirror element
   */
  const mirror = document.createElement('div');

  /**
   * Create the CSS for the mirror object
   *
   * @returns {Object} The style object
   */
  const mirrorCss = () => {
    const css = {
      position: 'absolute',
      left: -9999,
      top: 0,
      zIndex: -2000
    };

    if (element.tagName === 'TEXTAREA') {
      attributes.push('width');
    }

    attributes.forEach(attr => {
      css[attr] = getComputedStyle(element)[attr];
    });

    return css;
  };

  /**
   * Initialize the mirror
   *
   * @param {string} html The html
   */
  const initialize = html => {
    const styles = mirrorCss();
    Object.keys(styles).forEach(key => {
      mirror.style[key] = styles[key];
    });
    mirror.innerHTML = html;
    element.parentNode.insertBefore(mirror, element.nextSibling);
  };

  /**
   * Get the rect
   *
   * @returns {Rect} The bounding rect
   */
  const rect = () => {
    const marker = mirror.ownerDocument.getElementById('caret-position-marker');
    const boundingRect = {
      left: marker.offsetLeft,
      top: marker.offsetTop,
      height: marker.offsetHeight
    };
    mirror.parentNode.removeChild(mirror);

    return boundingRect;
  };

  initialize(html);

  return {
    rect
  };
};

const createInputCaret = (element, ctx) => {

  /**
   * Get position of old IE
   *
   * @returns {number}
   */
  const getIEPos = () => {
    const range = ctx.document.selection.createRange();
    let pos = 0;

    if (range && range.parentElement() === element) {
      /* eslint-disable */
      const value = element.value.replace(/\r\n/g, "\n");
      /* eslint-enable */
      const textInputRange = element.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());
      const endRange = element.createTextRange();
      endRange.collapse(false);
      if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
        pos = value.length;
      } else {
        pos = -textInputRange.moveStart('character', -value.length);
      }
    }

    return pos;
  };

  /**
   * Get the current position
   *
   * @returns {number}
   */
  const getPos = () => {
    if (ctx.document.selection) {
      return getIEPos();
    }

    return element.selectionStart;
  };

  /**
   * Set the position
   * @todo: Where is this being used?
   * @param {number} pos The position
   */
  const setPos = pos => {
    // IE
    if (ctx.document.selection) {
      const range = element.createTextRange();
      range.move('characters', pos);
      range.select();
    } else if (element.setSelectionRange) {
      element.setSelectionRange(pos, pos);
    }

    return element;
  };

  /**
   * Get the offset for old IE
   *
   * @param {number} pos The position
   */
  const getIEOffset = pos => {
    const range = element.createTextRange();
    const position = pos || getPos();
    range.move('character', position);

    return {
      x: range.boundingLeft,
      y: range.boundingTop,
      h: range.boundingHeight
    };
  };

  /**
   * The offset
   *
   * @param {number} pos String
   */
  const getOffset = pos => {
    let offset;
    if (ctx.document.selection) {
      offset = getIEOffset(pos);
      offset.top += ctx.window.scrollTop + element.scrollTop;
      offset.left += ctx.window.scrollLeft + element.scrollLeft;
    } else {
      const rect = element.getBoundingClientRect();
      const position = getPosition(pos);
      offset = {
        top: rect.top + position.top + ctx.document.body.scrollTop,
        left: rect.left + position.left + ctx.document.body.scrollLeft
      };
    }

    return offset;
  };

  /**
   * Get the current position
   *
   * @param {number} pos The position
   */
  const getPosition = pos => {
    const format = val => {
      let value = val.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br/>');
      if (/firefox/i.test(navigator.userAgent)) {
        value = value.replace(/\s/g, '&nbsp;');
      }
      return value;
    };

    const position = pos === undefined ? getPos() : pos;
    const startRange = element.value.slice(0, position);
    const endRange = element.value.slice(position);
    let html = `<span style="position: relative; display: inline;">${format(startRange)}</span>`;
    html += '<span id="caret-position-marker" style="position: relative; display: inline;">|</span>';
    html += `<span style="position: relative; display: inline;">${format(endRange)}</span>`;

    const mirror = createMirror(element, html);
    return mirror.rect();
  };

  return {
    getPos,
    setPos,
    getIEPos,
    getIEOffset,
    getOffset,
    getPosition
  };
};

const createEditableCaret = (element, ctx) => {

  const setPos = pos => {
    const sel = ctx.window.getSelection();
    if (sel) {
      let offset = 0;
      let found = false;
      const find = (pos, parent) => {
        for (const node in parent.childNodes) {
          if (found) {
            break;
          }
          if (node.nodeType === 3) {
            if (offset + node.length >= pos) {
              found = true;
              const range = ctx.document.createRange();
              range.setStart(node, pos - offset);
              sel.removeAllRanges();
              sel.addRange(range);
              break;
            } else {
              offset += node.length;
            }
          } else {
            find(pos, node);
          }
        }
      };
      find(pos, element);
    }

    return element;
  };

  const getOffset = () => {
    const range = getRange();
    let offset;
    if (ctx.window.getSelection && range) {
      // endContainer in Firefox would be the element at the start of
      // the line
      if (range.endOffset - 1 > 0 && range.endContainer !== element) {
        const clonedRange = range.cloneRange();
        clonedRange.setStart(range.endContainer, range.endOffset - 1);
        clonedRange.setEnd(range.endContainer, range.endOffset);
        const rect = clonedRange.getBoundingClientRect();
        offset = {
          height: rect.height,
          left: rect.left + rect.width,
          top: rect.top
        };
        clonedRange.detach();
      }

      if (!offset || offset && offset.height === 0) {
        const clonedRange = range.cloneRange();
        const shadowCaret = ctx.document.createTextNode('|');
        clonedRange.insertNode(shadowCaret);
        clonedRange.selectNode(shadowCaret);
        const rect = clonedRange.getBoundingClientRect();
        offset = {
          height: rect.height,
          left: rect.left,
          top: rect.top
        };
        shadowCaret.parentNode.removeChild(shadowCaret);
        clonedRange.detach();
      }
    } else if (ctx.document.selection) {
      offset = getOldIEOffset();
    }

    if (offset) {
      const doc = ctx.document.documentElement;
      offset.top += ctx.window.pageYOffset - (doc.clientTop || 0);
      offset.left += ctx.window.pageXOffset - (doc.clientLeft || 0);
    }

    return offset;
  };

  const getPosition = () => {
    const offset = getOffset();
    const rect = element.getBoundingClientRect();
    const inputOffset = {
      top: rect.top + ctx.document.body.scrollTop,
      left: rect.left + ctx.document.body.scrollLeft
    };
    offset.left -= inputOffset.left;
    offset.top -= inputOffset.top;

    return offset;
  };

  const getOldIEPos = () => {
    const textRange = ctx.document.selection.createRange();
    const startTextRange = ctx.document.body.createTextRange();
    startTextRange.moveToElementText(element);
    startTextRange.setEndPoint('EndToEnd', textRange);

    return startTextRange.text.length;
  };

  const getRange = () => {
    if (!ctx.window.getSelection) {
      return;
    }
    const sel = ctx.window.getSelection();

    return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  };

  const getPos = () => {
    const range = getRange();
    if (range) {
      const clonedRange = range.cloneRange();
      clonedRange.selectNodeContents(element);
      clonedRange.setEnd(range.endContainer, range.endOffset);
      const pos = clonedRange.toString().length;
      clonedRange.detach();
      return pos;
    } else {
      return getOldIEPos();
    }
  };

  const getOldIEOffset = () => {
    const range = ctx.document.selection.createRange().dupliate();
    range.moveStart('character', -1);
    const rect = range.getBoundingClientRect();

    return {
      height: rect.bottom - rect.top,
      left: rect.left,
      top: rect.top
    };
  };

  const getIEPosition = () => getPosition();

  return {
    getPos,
    setPos,
    getPosition,
    getOldIEPos,
    getIEPosition,
    getOffset,
    getOldIEOffset,
    getRange
  };
};

const isContentEditable = element => !!(element.contentEditable && element.contentEditable === 'true');

const getContext = (settings = {}) => {
  const { iframe } = settings;
  if (iframe) {
    return {
      iframe,
      window: iframe.contentWindow,
      document: iframe.contentDocument || iframe.contentWindow.document
    };
  }

  return {
    window,
    document
  };
};

const createCaret = (element, ctx) => {
  if (isContentEditable(element)) {
    return createEditableCaret(element, ctx);
  }

  return createInputCaret(element, ctx);
};

const position = (element, value) => {
  let val = value;
  const ctx = getContext();
  const caret = createCaret(element, ctx);
  return caret.getPos(val);
};

const offset = (element, pos) => {
  const ctx = getContext();
  const caret = createCaret(element, ctx);
  return caret.getOffset(pos);
};

// Just tests
const input = document.getElementById('input');
input.addEventListener('click', () => {
  const pos = position(input);
  console.log(pos);
  console.log(offset(input, pos));
});

const editable = document.getElementById('editable');
editable.addEventListener('click', () => {
  const pos = position(editable);
  console.log(pos);
  console.log(offset(editable, pos));
});

exports.position = position;
exports.offset = offset;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=main.js.map
