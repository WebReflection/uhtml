import Document from '../../esm/dom/document.js';

const document = new Document;

const { Event } = document.defaultView;

const div = document.createElement('div');
const p = div.appendChild(document.createElement('p'));

let invoked = false;

const listener = event => {
  event.preventDefault();
  console.assert(event.defaultPrevented, 'defaultPrevented');

  event.stopPropagation();
  event.stopImmediatePropagation();
  console.assert(event.target === p, 'target');
  console.assert(event.currentTarget === div, 'currentTarget');
};

div.addEventListener('click', listener);

p.addEventListener('click', {
  handleEvent(event) {
    console.assert(event.bubbles, 'bubbles once');
    console.assert(event.cancelable, 'cancelable once');
    console.assert(!event.defaultPrevented);
  }
}, { once: true });

p.addEventListener('click', event => {
  console.assert(event.bubbles, 'bubbles');
  console.assert(event.cancelable, 'cancelable');
  invoked = true;
});

p.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

console.assert(invoked, 'invoked');

p.removeEventListener('click', {});
div.removeEventListener('click', listener);
p.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
