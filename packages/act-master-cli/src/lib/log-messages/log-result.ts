import path from 'path';

const clc = {
  _red: '\x1b[31m',
  _green: '\x1b[32m',
  _yellow: '\x1b[33m',
  _blue: '\x1b[34m',
  _greenBg: '\x1b[42m',
  _redBg: '\x1b[41m',
  _blueBg: '\x1b[44m',
  _cyan: '\x1b[0;36m',
  _white: '\x1b[0;37m',
  _gray: '\x1b[0;90m',
  _right: '\x1b[46G',
  _off: '\x1b[0m',
} as const;

export const formatErrorMessage = (message: string): string => {
  return [
    //
    clc._red,
    '──────────────────────────────────────────────────────────────',
    message,
    '──────────────────────────────────────────────────────────────',
    clc._off,
  ].join('\n');
};

export const logResult = (list: string[]) => {
  const message = `
LIST OF ACTS:
${list.map(getLine).join('\n')}
COUNT OF ACTS: ${clc._green}${list.length}${clc._off}
`;

  console.log(message);
};

function getLine(filePath: string): string {
  const dir = path.dirname(filePath);
  const name = path.basename(filePath);

  return [
    clc._blue,
    ' · ',
    clc._gray,
    dir,
    '/',
    clc._cyan,
    name,
    clc._off,
  ].join('');
}
