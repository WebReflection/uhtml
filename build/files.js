export default (target, plugins) => [
  {
    plugins,
    input: './src/parser/index.js',
    output: {
      esModule: true,
      file: `./dist/${target}/parser.js`,
    }
  },
  {
    plugins,
    input: './src/dom/cdn.js',
    output: {
      esModule: true,
      file: `./dist/${target}/cdn.js`,
    }
  },
  {
    plugins,
    input: './src/jsx/index.js',
    output: {
      esModule: true,
      file: `./dist/${target}/jsx.js`,
    }
  },
  {
    plugins,
    input: './src/json/index.js',
    output: {
      esModule: true,
      file: `./dist/${target}/json.js`,
    }
  },
  {
    plugins,
    input: './src/dom/creator.js',
    output: {
      esModule: true,
      file: `./dist/${target}/creator.js`,
    }
  },
  {
    plugins,
    input: './src/dom/ish.js',
    output: {
      esModule: true,
      file: `./dist/${target}/ish.js`,
    }
  },
  {
    plugins,
    input: './src/dom/index.js',
    output: {
      esModule: true,
      file: `./dist/${target}/dom.js`,
    }
  },
];
