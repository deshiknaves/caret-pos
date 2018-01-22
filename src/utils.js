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
  const doc = ctx && ctx.document || document;
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top + doc.body.scrollTop,
    left: rect.left + doc.body.scrollLeft
  };
};

export const isObject = (value) => typeof value === 'object' && value !== null;
