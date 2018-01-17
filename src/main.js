import createInputCaret from './input';
import createEditableCaret from './editable';
import { isContentEditable, getContext } from './utils';


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


// Just tests
const input = document.getElementById('input');
input.addEventListener('click', () => {
  const pos = position(input);
  console.log(pos);
  console.log(offset(input, pos));
});
