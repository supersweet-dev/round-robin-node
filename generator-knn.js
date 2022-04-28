const fs = require('fs'); //FS Dependency enables access to filesystem.
const n = 5000;
console.log('using random data, size %d', n);
data = '';
let start = 0;
quantum = 500;
bursts = [];
for (let i = 1; i <= n; i++) {
  bursts.push((Math.random() * (160 - 1 / 1000) + 1 / 1000) * 1000);
}
totalBursts = bursts.reduce((a, b) => a + b, 0);
for (let i = 1; i <= n; i++) {
  start += Math.floor(Math.random() * (256 - 1) + 1);
  data += bursts[i - 1];
  data += ', ';
  data += Math.floor(bursts[i - 1] / quantum);
  data += ', ';
  data += bursts[i - 1] / totalBursts;
  totalBursts = totalBursts - bursts[i - 1];
  totalBursts = totalBursts < 0 ? 0 : totalBursts;
  if (i == n) break;
  data += '\n';
}

const resultname = 'generated.csv';
fs.writeFile(
  resultname,
  data,
  function (err) {
    if (err) throw err;
    console.log(`Solution writing to ${resultname}`);
  } //Create or overwrite result file. First line is CSV Headers.
);
