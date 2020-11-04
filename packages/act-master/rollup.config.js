import typescript from 'rollup-plugin-typescript2';
import path from 'path';
import pkg from './package.json';

export default [
  // act-master
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
      {
        file: pkg.browser,
        format: 'umd',
        name: pkg.name,
      },
    ],
    external: getExternal(),
    plugins: getPlugins(),
  },
  // test-utils
  {
    input: 'src/test-utils/index.ts',
    output: [
      {
        file: 'dist/test-utils/index.js',
        format: 'cjs',
      },
    ],
    external: getExternal(),
    plugins: getPlugins(),
  },
];

function getExternal() {
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ];
}

function getPlugins() {
  return [
    typescript({
      useTsconfigDeclarationDir: false,
      tsconfig: path.join(__dirname, 'tsconfig.prod.json'),
      typescript: require('typescript'),
    }),
  ];
}
