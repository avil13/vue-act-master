let debounceTimer: any = {};

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
export function debounce(
  func: (...args: any[]) => void,
  wait?: number,
  args?: any,
  _prefix = '__'
): void {
  if (!wait) {
    func(args);
    return;
  }

  debounceTimer = debounceTimer || {};

  const key = _prefix + func.toString();

  if (debounceTimer[key]) {
    clearTimeout(debounceTimer[key]);
  }

  debounceTimer[key] = setTimeout(
    (argsLast) => {
      func(argsLast);
      debounceTimer[key] = null;
    },
    wait,
    args
  );
}
