import DOMParser from '../../esm/dom/dom-parser.js';

const dp = new DOMParser;

let html = dp.parseFromString('...');

console.assert(html.toString() === '<!DOCTYPE html><html><head></head><body></body></html>');

html = dp.parseFromString('<!doctype dt><html lang="en"><head id="h"><style></style></head><body id="b"><p></p></body></html>');

console.assert(html.toString() === '<!DOCTYPE dt><html lang="en"><head id="h"><style></style></head><body id="b"><p></p></body></html>');

let svg = dp.parseFromString('<svg><rect /></svg>', 'svg');

console.log(svg.toString());
