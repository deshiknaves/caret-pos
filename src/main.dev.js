import {
  position,
  offset
} from './main';
import { getOffset } from './utils';

// Just tests
const input = document.getElementById('input');
input.addEventListener('click', () => {
  const pos = position(input);
  console.log(pos);
  console.log(offset(input, pos));
});

const editable = document.getElementById('editable');
editable.addEventListener('click', () => {
  const pos = position(editable);
  console.log(pos);
  console.log(offset(editable, pos));
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
  off.top = frameOffset.top;
  const pos = position(body, { iframe: frame });
  console.log(pos);
  console.log(off);
});
