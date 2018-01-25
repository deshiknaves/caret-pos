import {
  position,
  offset
} from './main';
import { getOffset } from './utils';

const offsetYLine = document.querySelector('.offset-y-line');
const offsetXLine = document.querySelector('.offset-x-line');
const indicators = document.querySelector('.indicators');
const offsetIndicator = indicators.querySelector('.offset-indicator');
const positionIndicator = document.querySelector('.position-indicator');

const setIndicators = (off, pos) => {
  offsetYLine.style.left = `${Math.ceil(off.left)}px`;
  offsetXLine.style.top = `${Math.ceil(off.top)}px`;
  indicators.style.left = `${Math.ceil(off.left)}px`;
  indicators.style.top = `${(Math.ceil(off.top) + Math.ceil(off.height))}px`;
  offsetIndicator.innerHTML = `Offset: left: ${Math.ceil(off.left)}, top: ${Math.ceil(off.top)} height: ${Math.ceil(off.height)}`;
  positionIndicator.innerHTML = `Position: left: ${Math.ceil(pos.left)}, top: ${Math.ceil(pos.top)}`;
};

/* eslint-disable */
const output = (name, pos, off) => {
  console.clear();
  if (console.group) {
    console.group(name);
    console.log('position:', pos);
    console.log('offset:', off);
    console.groupEnd();
  } else {
    console.log(name);
    console.log('position:', pos);
    console.log('offset:', off);
  }
};
/* eslint-enable */

const inputEventHandler = () => {
  const pos = position(input);
  const off = offset(input);
  output('Textarea', pos, off);
  setIndicators(off, pos);
};

const input = document.getElementById('input');
input.addEventListener('mouseup', inputEventHandler);
input.addEventListener('keyup', inputEventHandler);

const editableEventHandler = () => {
  const pos = position(editable);
  const off = offset(editable);
  output('ContentEditable', pos, off);
  setIndicators(off, pos);
};

const editable = document.getElementById('editable');
editable.addEventListener('mouseup', editableEventHandler);
editable.addEventListener('keyup', editableEventHandler);

const frame = document.getElementById('iframe');
const body = frame.contentDocument.body;
body.contentEditable = true;
body.id = 'frame-body';
body.innerHTML = 'For <strong>WYSIWYG</strong> such as <strong>ckeditor</strong>';

const iframeEventHandler = () => {
  const off = offset(body, { iframe: frame });
  const frameOffset = getOffset(frame);
  off.left += frameOffset.left;
  off.top += frameOffset.top;
  const pos = position(body, { iframe: frame });
  output('iframe body', pos, off);
  setIndicators(off, pos);
};

body.addEventListener('mouseup', iframeEventHandler);
body.addEventListener('keyup', iframeEventHandler);

setTimeout(() => {
  position(input, 67).focus();
  inputEventHandler();
}, 500);
