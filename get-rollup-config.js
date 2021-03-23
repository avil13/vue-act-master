import path from 'path';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

/**
 * @typedef {{name: string; main: string; module: string; browser: string; dependencies: any; devDependencies: any; peerDependencies?: any; }} package
 */

/**
 *
 * @param {string} input 'src/index.ts'
 * @param {package} pkg
 */
export const getRollupConfig = (input, pkg) => {
  return [
    // base
    {
      input,
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
    // base.min
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

  // список зависимостей, которые будут установлены вместе с пакетом
  function getExternal() {
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ];
  }

  // плагины, для подготовки пакета
  function getPlugins(isMin = false) {
    const dir = path.dirname(module.filename);

    return [
      typescript({
        useTsconfigDeclarationDir: false,
        tsconfig: path.join(dir, 'tsconfig.prod.json'),
        typescript: require('typescript'),
      }),

      isMin && terser(),

      !isMin && filesize(),
    ].filter(Boolean);
  }
};
