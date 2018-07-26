/**
 * Create an Editable Caret
 * @param {Element} element The editable element
 * @param {object|null} ctx The context
 *
 * @return {EditableCaret}
 */
const createEditableCaret = (element, ctx) => {

  /**
   * Set the caret position
   *
   * @param {int} pos The position to se
   *
   * @return {Element} The element
   */
  const setPos = (pos) => {
    const sel = ctx.window.getSelection();
    if (sel) {
      let offset = 0;
      let found = false;
      const find = (position, parent) => {
        for (let i = 0; i < parent.childNodes.length; i++) {
          const node = parent.childNodes[i];
          if (found) {
            break;
          }
          if (node.nodeType === 3) {
            if (offset + node.length >= position) {
              found = true;
              const range = ctx.document.createRange();
              range.setStart(node, position - offset);
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

  /**
   * Get the offset
   *
   * @return {object} The offset
   */
  const getOffset = () => {
    const range = getRange();
    let offset = {
      height: 0,
      left: 0,
      right: 0,
    };

    if (!range) {
      return offset;
    }

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
        top: rect.top,
      };
      clonedRange.detach();
    }

    if ((!offset || (offset && offset.height === 0)) && !ctx.noShadowCaret) {
      const clonedRange = range.cloneRange();
      const shadowCaret = ctx.document.createTextNode('|');
      clonedRange.insertNode(shadowCaret);
      clonedRange.selectNode(shadowCaret);
      const rect = clonedRange.getBoundingClientRect();
      offset = {
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
      shadowCaret.parentNode.removeChild(shadowCaret);
      clonedRange.detach();
    }

    if (offset) {
      const doc = ctx.document.documentElement;
      offset.top += ctx.window.pageYOffset - (doc.clientTop || 0);
      offset.left += ctx.window.pageXOffset - (doc.clientLeft || 0);
    }

    return offset;
  };

  /**
   * Get the position
   *
   * @return {object} The position
   */
  const getPosition = () => {
    const offset = getOffset();
    const pos = getPos();
    const rect = element.getBoundingClientRect();
    const inputOffset = {
      top: rect.top + ctx.document.body.scrollTop,
      left: rect.left + ctx.document.body.scrollLeft
    };
    offset.left -= inputOffset.left;
    offset.top -= inputOffset.top;
    offset.pos = pos;

    return offset;
  };

  /**
   * Get the range
   *
   * @return {Range|null}
   */
  const getRange = () => {
    if (!ctx.window.getSelection) {
      return;
    }
    const sel = ctx.window.getSelection();

    return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  };

  /**
   * Get the caret position
   *
   * @return {int} The position
   */
  const getPos = () => {
    const range = getRange();
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(element);
    clonedRange.setEnd(range.endContainer, range.endOffset);
    const pos = clonedRange.toString().length;
    clonedRange.detach();

    return pos;
  };

  return {
    getPos,
    setPos,
    getPosition,
    getOffset,
    getRange,
  };
};

export default createEditableCaret;
