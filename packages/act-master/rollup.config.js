import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import path from 'path';
import pkg from './package.json';

export default [
  // act-master
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main.replace('.min.', '.'),
        format: 'cjs',
      },
      {
        file: pkg.module.replace('.min.', '.'),
        format: 'esm',
      },
      {
        file: pkg.browser.replace('.min.', '.'),
        format: 'umd',
        name: pkg.name,
      },
    ],
    external: getExternal(),
    plugins: getPlugins(),
  },
  // act-master.min
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
    json(),

    typescript({
      useTsconfigDeclarationDir: false,
      tsconfig: path.join(__dirname, 'tsconfig.prod.json'),
      typescript: require('typescript'),
    }),

    isMin && terser(),

    filesize(),
  ].filter(Boolean);
}
