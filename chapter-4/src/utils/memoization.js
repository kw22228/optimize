const cache = {};

function square(n) {
  if (cache[n]) return cache[n];

  const result = n * n;

  cache[n] = result;

  return result;
}
