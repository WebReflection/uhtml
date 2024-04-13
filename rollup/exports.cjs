module.exports = code => {
  const out = [];
  code = code.replace(
    /^\s+exports\.(\S+)\s*=\s*([^;]+);/gm,
    (_, name, exported) => {
      out.push(name === exported ? name : `${name}: ${exported}`);
      return '';
    }
  );
  return code
    .replace(/^\s+return exports;/m, `\n  return { ${out.join(', ')} };`)
    .replace('function (exports) {', 'function () {')
    .replace(/\}\)\(\{\}\);(\s*)$/, '})();$1');
};
