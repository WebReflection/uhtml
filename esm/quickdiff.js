import {indexOf} from './array.js';

const append = (get, parent, children, start, end, before) => {
  const isSelect = 'selectedIndex' in parent;
  let noSelection = isSelect;
  while (start < end) {
    const child = get(children[start], 1);
    parent.insertBefore(child, before);
    if (isSelect && noSelection && child.selected) {
      noSelection = !noSelection;
      let {selectedIndex} = parent;
      parent.selectedIndex = selectedIndex < 0 ?
        start :
        indexOf.call(parent.querySelectorAll('option'), child);
    }
    start++;
  }
};

const drop = node => (node.remove || dropChild).call(node);

const index = (
  moreNodes,
  moreStart,
  moreEnd,
  lessNodes,
  lessStart,
  lessEnd
) => {
  const length = lessEnd - lessStart;
  if (length < 1)
    return -1;
  while ((moreEnd - moreStart) >= length) {
    let m = moreStart;
    let l = lessStart;
    while (
      m < moreEnd &&
      l < lessEnd &&
      moreNodes[m] === lessNodes[l]
    ) {
      m++;
      l++;
    }
    if (l === lessEnd)
      return moreStart;
    moreStart = m + 1;
  }
  return -1;
};

const next = (get, list, i, length, before) => i < length ?
              get(list[i], 0) :
              (0 < i ?
                get(list[i - 1], -0).nextSibling :
                before);

const remove = (get, children, start, end) => {
  while (start < end)
    drop(get(children[start++], -1));
};

export const quickdiff = (
  parentNode,
  currentNodes,
  futureNodes,
  get,
  before
) => {

  const currentLength = currentNodes.length;
  let currentEnd = currentLength;
  let currentStart = 0;

  let futureEnd = futureNodes.length;
  let futureStart = 0;

  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    currentNodes[currentStart] === futureNodes[futureStart]
  ) {
    currentStart++;
    futureStart++;
  }

  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    currentNodes[currentEnd - 1] === futureNodes[futureEnd - 1]
  ) {
    currentEnd--;
    futureEnd--;
  }

  const currentSame = currentStart === currentEnd;
  const futureSame = futureStart === futureEnd;

  if (currentSame && futureSame)
    return futureNodes;

  if (currentSame && futureStart < futureEnd) {
    append(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      next(get, currentNodes, currentStart, currentLength, before)
    );
    return futureNodes;
  }

  if (futureSame && currentStart < currentEnd) {
    remove(
      get,
      currentNodes,
      currentStart,
      currentEnd
    );
    return futureNodes;
  }

  const currentChanges = currentEnd - currentStart;
  const futureChanges = futureEnd - futureStart;
  let i = -1;

  if (currentChanges < futureChanges) {
    i = index(
      futureNodes,
      futureStart,
      futureEnd,
      currentNodes,
      currentStart,
      currentEnd
    );
    if (-1 < i) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        i,
        get(currentNodes[currentStart], 0)
      );
      append(
        get,
        parentNode,
        futureNodes,
        i + currentChanges,
        futureEnd,
        next(get, currentNodes, currentEnd, currentLength, before)
      );
      return futureNodes;
    }
  }
  else if (futureChanges < currentChanges) {
    i = index(
      currentNodes,
      currentStart,
      currentEnd,
      futureNodes,
      futureStart,
      futureEnd
    );
    if (-1 < i) {
      remove(
        get,
        currentNodes,
        currentStart,
        i
      );
      remove(
        get,
        currentNodes,
        i + futureChanges,
        currentEnd
      );
      return futureNodes;
    }
  }

  if ((currentChanges < 2 || futureChanges < 2)) {
    append(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      get(currentNodes[currentStart], 0)
    );
    remove(
      get,
      currentNodes,
      currentStart,
      currentEnd
    );
    return futureNodes;
  }

  // bail out replacing all
  remove(
    get,
    currentNodes,
    0,
    currentLength
  );

  append(
    get,
    parentNode,
    futureNodes,
    0,
    futureNodes.length,
    before
  );

  return futureNodes;
};

function dropChild() {
  const {parentNode} = this;
  if (parentNode)
    parentNode.removeChild(this);
}
