# <em>µ</em>html

[![Downloads](https://img.shields.io/npm/dm/uhtml.svg)](https://www.npmjs.com/package/uhtml) [![build status](https://github.com/WebReflection/uhtml/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/uhtml/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhtml/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhtml?branch=main) [![CSP strict](https://webreflection.github.io/csp/strict.svg)](https://webreflection.github.io/csp/#-csp-strict)

![snow flake](./docs/uhtml-head.jpg)

<sup>**Social Media Photo by [Andrii Ganzevych](https://unsplash.com/@odya_kun) on [Unsplash](https://unsplash.com/)**</sup>

*uhtml* (micro *µ* html) is one of the smallest, fastest, memory consumption friendly, yet zero-tools based, library to safely help creating or manipulating DOM content.

### 📣 uhtml v4 is out

**[Documentation](https://webreflection.github.io/uhtml/)**

**[Release Notes](https://github.com/WebReflection/uhtml/pull/86)**

- - -

### Exports

  * `uhtml` as default `{ Hole, render, html, svg, attr }` with smart auto-keyed nodes - read [keyed or not ?](https://webreflection.github.io/uhtml/#keyed-or-not-) paragraph to know more
  * `uhtml/keyed` with extras `{ Hole, render, html, svg, htmlFor, svgFor, attr }`, providing keyed utilities - read [keyed or not ?](https://webreflection.github.io/uhtml/#keyed-or-not-) paragraph to know more
  * `uhtml/node` with *same default* exports but it's for *one-off* nodes creation only so that no cache or updates are available and it's just an easy way to hook *uhtml* into your existing project for DOM creation (not manipulation!)
  * `uhtml/init` which returns a `document => uhtml/keyed` utility that can be bootstrapped with [LinkeDOM](https://github.com/WebReflection/linkedom), [JSDOM](https://github.com/jsdom/jsdom), or *Workers* support

**uhtml/init example**

```js
import init from 'uhtml/init';
import mockedDocument from '...';

const {
  Hole,
  render,
  html, svg,
  htmlFor, svgFor,
  attr
} = init(mockedDocument);
```
