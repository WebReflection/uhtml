import parser from '@webreflection/uparser';

const prefix = 'isµ';
const re = new RegExp(`<!--${prefix}\\d+-->`, 'g');

const template = t => t;

console.log(
  parser(template`a${1}b`, prefix, false)
    .replace(re, '<!--{-->$&<!--}-->')
);
