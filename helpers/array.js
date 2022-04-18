// https://stackoverflow.com/a/50636286/4658957?
export function partition(array, filter) {
  const pass = [];
  const fail = [];
  array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
  return [pass, fail];
}

export function uniqueBy(array, key, initialSeen = []) {
  const seen = new Set(initialSeen);
  return array.filter((item) => {
    const val = item[key];
    return seen.has(val) ? false : seen.add(val);
  });
}
