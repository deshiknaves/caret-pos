import {
  position,
  offset
} from './main';
import { getOffset } from './utils';

const offsetBox = document.querySelector('.offset-box');
const indicators = document.querySelector('.indicators');
const offsetIndicator = indicators.querySelector('.offset-indicator');
const positionBox = document.querySelector('.position-box');
const positionIndicator = document.querySelector('.position-indicator');

const setIndicators = (off, pos) => {
  offsetBox.style.width = off.left + 'px';
  offsetBox.style.height = Math.ceil(off.top) + 'px';
  indicators.style.left = off.left + 'px';
  indicators.style.top = (Math.ceil(off.top) + off.height)  + 'px';
  offsetIndicator.innerHTML = `Offset: left: ${off.left}, top: ${off.top} height: ${off.height}`;
  positionBox.style.width = pos.left;
  positionBox.style.height = pos.top;
  positionIndicator.innerHTML = `Position: left: ${pos.left}, top: ${pos.top}`;
};

const input = document.getElementById('input');
input.addEventListener('click', () => {
  const pos = position(input);
  const off = offset(input);
  console.log(pos);
  console.log(off);
  setIndicators(off, pos);
});

const editable = document.getElementById('editable');
editable.addEventListener('click', () => {
  const pos = position(editable);
  const off = offset(editable);
  console.log(pos);
  console.log(off);
  setIndicators(off, pos);
});

const frame = document.getElementById('iframe');
const body = frame.contentDocument.body;
body.contentEditable = true;
body.id = 'frame-body';
body.innerHTML = 'For <strong>WYSIWYG</strong> such as <strong>ckeditor</strong>';

body.addEventListener('click', () => {
  const off = offset(body, { iframe: frame });
  const frameOffset = getOffset(frame);
  off.left += frameOffset.left;
  off.top += frameOffset.top;
  const pos = position(body, { iframe: frame });
  setIndicators(off, pos);
});
