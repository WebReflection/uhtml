const _type = Symbol('type');
const _bubbles = Symbol('bubbles');
const _cancelable = Symbol('cancelable');
const _defaultPrevented = Symbol('defaultPrevented');

export const _target = Symbol('target');
export const _currentTarget = Symbol('currentTarget');
export const _stoppedPropagation = Symbol('stoppedPropagation');
export const _stoppedImmediatePropagation = Symbol('stoppedImmediatePropagation');

export default class Event {
  constructor(type, { bubbles = false, cancelable = false } = {}) {
    this[_type] = type;
    this[_bubbles] = bubbles;
    this[_cancelable] = cancelable;
    this[_target] = null;
    this[_currentTarget] = null;
    this[_defaultPrevented] = false;
    this[_stoppedPropagation] = false;
    this[_stoppedImmediatePropagation] = false;
  }
  get type() { return this[_type]; }
  get bubbles() { return this[_bubbles]; }
  get cancelable() { return this[_cancelable]; }
  get target() { return this[_target]; }
  get currentTarget() { return this[_currentTarget]; }
  get defaultPrevented() { return this[_defaultPrevented]; }

  preventDefault() {
    if (this[_cancelable])
      this[_defaultPrevented] = true;
  }

  stopPropagation() {
    this[_stoppedPropagation] = true;
  }

  stopImmediatePropagation() {
    this.stopPropagation();
    this[_stoppedImmediatePropagation] = true;
  }
}
