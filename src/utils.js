export const isContentEditable = (element) => !!(
  element.contentEditable &&
  element.contentEditable === true
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
