/**
 * Check if a DOM Element is content editable
 * @param {Element} element  The DOM element
 * @return {bool} If it is content editable
 */
export const isContentEditable = (element) => !!(
  element.contentEditable &&
  element.contentEditable === 'true'
);

/**
 * Get the context from settings passed in
 * @param {object} settings The settings object
 * @return {object} window and document
 */
export const getContext = (settings = {}) => {
  const { iframe } = settings;
  if (iframe) {
    return {
      iframe,
      window: iframe.contentWindow,
      document: iframe.contentDocument || iframe.contentWindow.document,
    };
  }

  return {
    window,
    document,
  };
};

/**
 * Get the offset of an element
 * @param {Element} element The DOM element
 * @param {object} ctx The context
 * @return {object} top and left
 */
export const getOffset = (element, ctx) => {
  const win = ctx && ctx.window || window;
  const doc = ctx && ctx.document || document;
  const rect = element.getBoundingClientRect();
  const docEl = doc.documentElement;
  const scrollLeft = win.pageXOffset || docEl.scrollLeft;
  const scrollTop = win.pageYOffset || docEl.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};

/**
 * Check if a value is an object
 * @param {any} value The value to check
 * @return {bool} If it is an object
 */
export const isObject = (value) => typeof value === 'object' && value !== null;
