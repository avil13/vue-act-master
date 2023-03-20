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
  _u: '\x1b[4m',
  _off: '\x1b[0m',
} as const;

/**
 * message output help
 *
 */
export const logHelp = () => {
  const g = (s: string): string => `${clc._green}${s}${clc._off}`;
  const y = (s: string): string => `${clc._yellow}${s}${clc._off}`;
  const c = (s: string): string => `${clc._cyan}${s}${clc._off}`;
  const u = (s: string): string => `${clc._u}${s}${clc._off}`;

  const helpText = `
┌──────────────────────────────────────────────────────────────┐
│ ${g('act-master-cli')}                                               │
└──────────────────────────────────────────────────────────────┘
 commands:
   ${y('init')}         │ Generate init file
   ${y('generate')}, ${y('g')}  │ Generate interface and index actions files
   ${y('help')}         │ Show current message

${c('Tip:')}
 Add ${g(u('"act:gen":"act-master-cli g"'))}
 to scripts in package.json for fast update actions
`;
  console.log(helpText);
};

/**
 * Output of a formatted error message
 *
 */
export const formatErrorMessage = (
  className: string,
  type: string,
  file: string
): string => {
  const rb = `${clc._redBg} ${clc._off} ${clc._red}`;

  return [
    '',
    `${clc._redBg}    ${type.padEnd(24, ' ')}    ${clc._off}`,
    rb + className,
    rb + file,
    clc._off,
  ].join('\n');
};

/**
 * Logging the result of the main script's execution
 *
 */
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
