var sum_to_n_a = function (n: number) {
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function (n: number) {
  let sum = 0;
  while (n >= 0) {
    sum += n;
    n--;
  }
  return sum;
};

var sum_to_n_c = function (n: number): number {
  // your code here
  if (n <= 1) return n;
  return n + sum_to_n_c(n - 1);
};
