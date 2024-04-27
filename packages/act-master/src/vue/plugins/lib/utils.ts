export function getArguments(fn?: Function): string[] {
  const argRegExp = /[^\(]*\(([^\)]*)\)/;
  const match = fn?.toString().match(argRegExp);

  if (match && match[1]) {
    return match[1]
      .split(',')
      .map((arg) => arg.trim())
      .filter((arg) => arg.length > 0);
  }
  return [];
}

export function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
    .getMilliseconds()
    .toString()
    .padStart(3, '0')}`;
}

// #region [ debounce ]
let debounceTimer: Record<any, any> = {};

/**
 *
 * @param {*} wait
 * @param {*} func
 * @param {*} args
 * @example
 *  debounce(200, (v) => {
 *      this.$store.commit('api/search', v);
 *  }, val);
 */
export function debounce(wait: number, func: Function, args?: any) {
  debounceTimer = debounceTimer || {};

  if (debounceTimer[func.toString()]) {
    clearTimeout(debounceTimer[func.toString()]);
  }

  debounceTimer[func.toString()] = setTimeout(() => {
    func(args);
    debounceTimer[func.toString()] = null;
  }, wait);
}

// #endregion


export function logSettings(type: 'CALL_FILTER', value: any) {
  if (type === 'CALL_FILTER') {
    const title = value ? 'Acts filtered by call' : 'Show all Acts';
    console.log(
      `%c ActMaster 🥷 %c "${title}"\n%c Don\'t forget to update the list %c ⟳ `,
      'background:#44bd90; color:#fff; border-radius: 3px; padding: 3px;',
      value ? 'background:transparent; color:#e56e17;' : 'background:transparent; color:#44bd90;',
      'background:transparent; color:#44bd90;',
      'background:#ffc759; color:#fff; border-radius: 3px; padding: 3px;'
    );
  }
}
