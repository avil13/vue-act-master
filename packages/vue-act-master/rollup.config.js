import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import pkg from './package.json';

export default [
  // vue-act-master
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
  // vue-act-master.min
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main.replace('.js', '.min.js'),
        format: 'cjs',
      },
      {
        file: pkg.module.replace('.js', '.min.js'),
        format: 'esm',
      },
      {
        file: pkg.browser.replace('.js', '.min.js'),
        format: 'umd',
        name: pkg.name,
      },
    ],
    external: getExternal(),
    plugins: getPlugins(true),
  },
];

function getExternal() {
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ];
}

function getPlugins(isMin = false) {
  return [
    typescript({
      useTsconfigDeclarationDir: false,
      tsconfig: path.join(__dirname, 'tsconfig.prod.json'),
      typescript: require('typescript'),
    }),

    isMin && terser(),

    filesize(),
  ].filter(Boolean);
}
