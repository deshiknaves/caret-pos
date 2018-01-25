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

/**
 * Create a mirror
 *
 * @param {Element} element The element
 * @param {string} html The html
 * @return {Object} The mirror object
 */
const createMirror = (element, html) => {

  /**
   * The mirror element
   */
  const mirror = document.createElement('div');

  /**
   * Create the CSS for the mirror object
   * @return {Object} The style object
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

    attributes.forEach((attr) => {
      css[attr] = getComputedStyle(element)[attr];
    });

    return css;
  };

  /**
   * Initialize the mirror
   * @param {string} html The html
   */
  const initialize = (html) => {
    const styles = mirrorCss();
    Object.keys(styles).forEach(key => {
      mirror.style[key] = styles[key];
    });
    mirror.innerHTML = html;
    element.parentNode.insertBefore(mirror, element.nextSibling);
  };

  /**
   * Get the rect
   * @return {Rect} The bounding rect
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
    rect,
  };
};

export default createMirror;
