export type CaretPositionSettings = {
  /**
   * When getting the offset, in certain cases a "shadow caret" is temporarily created and destroyed
   * to facilitate calculations. If one does not wish to mutate the DOM in this way, one can include
   * the noShadowCaret option in the offset
   *
   * Note that doing this might make the offset calculation less accurate in some edge cases.
   */
  noShadowCaret?: boolean,
  /**
   * Passing the customPos option allows specifying a custom cursor position in the element
   * when getting the offset. This will not change the position, but calculate the offset from
   * the custom position rather than the current one. This works for both contentEditable and textarea.
   */
  customPos?: number
  /**
   * In order to get the correct values for an iframe, we need to pass it in the settings so that
   * it can get a reference to the iframe.
   */
  iframe?: HTMLIFrameElement
}

export type Pos = { left: number, top: number, height: number, pos: number }

/**
 * Gets or sets the position. Pass value to set, omit to get.
 */
export declare function position(element: Element, settings?: CaretPositionSettings): Pos;
export declare function position(element: Element, value?: number, settings?: CaretPositionSettings): Pos;

export type Offset = { left: number, top: number, height: number }

/**
 * Gets or sets the offset. Pass value to set, omit to get.
 */
export declare function offset(element: Element, settings?: CaretPositionSettings): Offset;
export declare function offset(element: Element, value?: number, settings?: CaretPositionSettings): Offset;

/**
 * Use to get the offset of an iframe to position things correctly
 */
export declare function getOffset(element: Element, ctx?: { window: Window, document: Document }):
  { top: number, left: number };
