// see https://stackoverflow.com/a/47225591/4658957
export function partition(array, isValid) {
  const initial = [[], []];
  const cb = (prev, el) => {
    const [pass, fail] = prev;
    return isValid(el) ? [[...pass, el], fail] : [pass, [...fail, el]];
  };
  const results = array.reduce(cb, initial);
  return results;
}
