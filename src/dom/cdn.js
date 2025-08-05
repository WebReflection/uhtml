const resolve = ({ protocol, host, pathname }) => {
  const dev = /[?&](?:dev|debug)(?:=|$)/.test(location.search);
  let path = pathname.replace(/\+\S*?$/, '');
  path = path.replace(/\/(?:auto|cdn)(?:\/|\.js\S*)$/, '/');
  path = path.replace(/\/(?:dist\/)?(?:dev|prod)\//, '/');
  return `${protocol}//${host}${path}dist/${dev ? 'dev' : 'prod'}/dom.js`;
};

const uhtml = Symbol.for('µhtml');

const {
  render, html, svg,
  computed, signal, batch, effect, untracked,
} = globalThis[uhtml] || (globalThis[uhtml] = await import(/* webpackIgnore: true */resolve(new URL(import.meta.url))));

export {
  render, html, svg,
  computed, signal, batch, effect, untracked,
};
