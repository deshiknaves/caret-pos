const createEditableCaret = (element) => {

  return {

  };
};

const createMirror = (element, html) => {
  const attributes = [
    'borderBottomWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
    'borderTopWidth',
    'boxSizing',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'height',
    'letterSpacing',
    'lineHeight',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'outlineWidth',
    'overflow',
    'overflowX',
    'overflowY',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'textAlign',
    'textOverflow',
    'textTransform',
    'whiteSpace',
    'wordBreak',
    'wordWrap',
  ];

  const mirror = document.createElement('div');

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

    attributes.forEach((attr) => {
      css[attr] = getComputedStyle(element)[attr];
    });

    return css;
  };

  const create = (html) => {
    const styles = mirrorCss();
    Object.keys(styles).forEach(key => {
      mirror.style[key] = styles[key];
    });
    mirror.innerHTML = html;
    element.parentNode.insertBefore(mirror, element.nextSibling);
  };

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

  create(html);

  return {
    rect,
  };
};

const createInputCaret = (element, ctx) => {

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

  const getPos = () => {
    if (ctx.document.selection) {
      return getIEPos();
    }

    return element.selectionStart;
  };

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

const isContentEditable = (element) => !!(
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

const createCaret = (element, ctx) => {
  if (isContentEditable(element)) {
    return createEditableCaret(element);
  }

  return createInputCaret(element, ctx);
};

export const position = (element, value) => {
  let val = value;
  const ctx = getContext();
  const caret = createCaret(element, ctx);
  return caret.getPos(val);
};

export const offset = (element, pos) => {
  const ctx = getContext();
  const caret = createCaret(element, ctx);
  return caret.getOffset(pos);
};

const input = document.getElementById('input');
input.addEventListener('click', () => {
  const pos = position(input);
  console.log(pos);
  console.log(offset(input, pos));
});
