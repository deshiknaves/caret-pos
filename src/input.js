import createMirror from './mirror';
import { getOffset as elementOffset } from './utils';

/**
 * Create a Input caret object.\
 *
 * @param {Element} element The element
 * @param {Object} ctx The context
 */
const createInputCaret = (element, ctx) => {

  /**
   * Get the current position
   *
   * @returns {number}
   */
  const getPos = () => {
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
   * The offset
   *
   * @param {number} pos String
   */
  const getOffset = (pos) => {
    const rect = elementOffset(element);
    const position = getPosition(pos);
    return {
      top: rect.top + position.top + ctx.document.body.scrollTop,
      left: rect.left + position.left + ctx.document.body.scrollLeft,
      height: position.height,
    };
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
    getOffset,
    getPosition,
  };
};

export default createInputCaret;
