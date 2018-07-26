import { position, offset } from './main';

describe('caret-pos', () => {
  let element = null;
  let editor;

  beforeEach(() => {
    element = document.createElement('div');
    element.id = 'wrapper';
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.parentNode.removeChild(element);
  });

  describe('Input', () => {

    beforeEach(() => {
      const html = `
        <textarea id="editor" name="editor" rows="8" cols="40">
          Stay Foolish, Stay Hungry. @jobs
        </textarea>
      `;

      element.innerHTML = html;
      editor = document.getElementById('editor');
    });

    it('Set/Get caret pos', () => {
      position(editor, 15);
      const pos = position(editor);

      expect(pos.pos).toBe(15);
    });
  });

  describe('Editable', () => {
    let contentEditable;

    beforeEach(() => {
      contentEditable = ''
        + '<div id="editor" contentEditable="true">'
        + 'Hello '
        + '<span id="test">World</span>'
        + '! '
        + '<div><br></div>'
        + '<div>'
        + '<ul>'
        + '<li>Testing 1</li>'
        + '<li>Testin 2</li>'
        + '</ul>'
        + '<div>--</div>'
        + '</div>'
        + '<div><br></div>'
        + '</div>';

      element.innerHTML = contentEditable;
      editor = document.getElementById('editor');
    });

    it('should set the caret position at the top-level', () => {
      position(editor, 3);
      const selection = window.getSelection();
      expect(selection.anchorNode.nodeValue).toBe('Hello ');
      expect(selection.anchorOffset).toBe(3);
      expect(position(editor).pos).toBe(3);
    });

    it('should set the caret position in a span', () => {
      position(editor, 8);
      const selection = window.getSelection();
      expect(selection.anchorNode.nodeValue).toBe('World');
      expect(selection.anchorOffset).toBe(2);
      expect(position(editor).pos).toBe(8);
    });

    it('should set the caret position in a list item', () => {
      position(editor, 16);
      const selection = window.getSelection();
      expect(selection.anchorNode.nodeValue).toBe('Testing 1');
      expect(selection.anchorOffset).toBe(3);
      expect(position(editor).pos).toBe(16);
    });

    it('should set the caret position at the end of a list item', () => {
      position(editor, 30);
      const selection = window.getSelection();
      expect(selection.anchorNode.nodeValue).toBe('Testin 2');
      expect(selection.anchorOffset).toBe(8);
      expect(position(editor).pos).toBe(30);
    });
  });

  describe('Edge case for Gmail', () => {
    beforeEach(() => {
      const content = ''
      + '<div id="editor" contentEditable="true">'
      + 'Hello '
      + '<span>just</span> want'
      + '<ul><li>Hi</li></ul>'
      + '<div>---</div>'
      + '</div>';

      element.innerHTML = content;
      editor = document.getElementById('editor');
    });

    it('should set the caret position when two child nodes match the condition', () => {
      position(editor, 16);
      const selection = window.getSelection();
      expect(selection.anchorNode.nodeValue).toBe('Hi');
      expect(selection.anchorOffset).toBe(1);
      expect(position(editor).pos).toBe(16);
    });
  });
});

describe('caret-offset', () => {
  let element = null;
  let editor;

  beforeEach(() => {
    element = document.createElement('div');
    element.id = 'wrapper';
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.parentNode.removeChild(element);
  });

  describe('Editable', () => {
    let contentEditable;

    beforeEach(() => {
      spyOn(document, 'createTextNode').and.callThrough();
      contentEditable = ''
        + '<div id="editor" contentEditable="true">'
        + 'Hello '
        + '<span id="test">World</span>'
        + '! '
        + '<div><br></div>'
        + '<div>'
        + '<ul>'
        + '<li>Testing 1</li>'
        + '<li>Testin 2</li>'
        + '</ul>'
        + '<div>--</div>'
        + '</div>'
        + '<div><br></div>'
        + '</div>';

      element.innerHTML = contentEditable;
      editor = document.getElementById('editor');
    });

    it('should correctly get the caret offset', () => {
      position(editor, 3);
      const off = offset(editor);
      expect(off.height).toBe(19);
      expect(off.left).toBe(37);
      expect(off.top).toBe(8);
    });

    it('should respect noShadowCaret', () => {
      position(editor, 0);
      offset(editor, {noShadowCaret: true});
      expect(document.createTextNode).not.toHaveBeenCalled();
    });
  })
})

