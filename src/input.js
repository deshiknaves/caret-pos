import createMirror from './mirror';

/**
 * Create a Input caret object.\
 *
 * @param {Element} element The element
 * @param {Object} ctx The context
 */
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
  const setPos = (pos) => {
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
  const getIEOffset = (pos) => {
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
  const getOffset = (pos) => {
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
  const getPosition = (pos) => {
    const format = (val) => {
      let value = val.replace(/<|>|`|"|&/g, '?')
        .replace(/\r\n|\r|\n/g,'<br/>');
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
    getPosition,
  };
};

export default createInputCaret;
