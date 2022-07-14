import createInputCaret from './input';
import createEditableCaret from './editable';
import {
  isContentEditable,
  getContext,
  isObject,
} from './utils';

export { getOffset } from './utils';

const createCaret = (element, ctx) => {
  if (isContentEditable(element)) {
    return createEditableCaret(element, ctx);
  }

  return createInputCaret(element, ctx);
};

export const position = (element, value, settings = {}) => {
  let options = settings;
  if (isObject(value)) {
    options = value;
    value = undefined;
  }
  const ctx = getContext(options);
  const caret = createCaret(element, ctx);

  if (value || value === 0) {
    return caret.setPos(value);
  }

  return caret.getPosition();
};

/**
 *
 * @param {Element} element The DOM element
 * @param {number|undefined} value The value to set
 * @param {object} settings Any settings for context
 */
export const offset = (element, value, settings = {}) => {
  let options = settings;
  if (isObject(value)) {
    options = value;
    value = undefined;
  }

  const ctx = getContext(options);
  const caret = createCaret(element, ctx);
  return caret.getOffset(value);
};
