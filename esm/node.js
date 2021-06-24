import createContent from '@ungap/create-content';

// this "hack" tells the library if the browser is IE11 or old Edge
const isImportNodeLengthWrong = document.importNode.length != 1;

// IE11 and old Edge discard empty nodes when cloning, potentially
// resulting in broken paths to find updates. The workaround here
// is to import once, upfront, the fragment that will be cloned
// later on, so that paths are retrieved from one already parsed,
// hence without missing child nodes once re-cloned.
export const createFragment = isImportNodeLengthWrong ?
  (text, type, normalize) => document.importNode(
    createContent(text, type, normalize),
    true
  ) :
  createContent;

// IE11 and old Edge have a different createTreeWalker signature that
// has been deprecated in other browsers. This export is needed only
// to guarantee the TreeWalker doesn't show warnings and, ultimately, works
export const createWalker = isImportNodeLengthWrong ?
  fragment => document.createTreeWalker(fragment, 1 | 128, null, false) :
  fragment => document.createTreeWalker(fragment, 1 | 128);
