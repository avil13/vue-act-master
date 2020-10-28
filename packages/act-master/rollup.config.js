import typescript from 'rollup-plugin-typescript2';
import path from 'path';
import pkg from './package.json';

export default {
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

  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],

  plugins: [
    typescript({
      useTsconfigDeclarationDir: false,
      tsconfig: path.join(__dirname, 'tsconfig.prod.json'),
      typescript: require('typescript'),
    }),
  ],
};
