export const isContentEditable = (element) => !!(
  element.contentEditable &&
  element.contentEditable === 'true'
);

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

export const isObject = (value) => typeof value === 'object' && value !== null;
