const fs = require('fs'); //FS Dependency enables access to filesystem.
const n = 5000;
console.log('using random data, size %d', n);
data = '';
let start = 0;
for (let i = 1; i <= n; i++) {
  data += start;
  start += Math.floor(Math.random() * (256 - 1) + 1);
  data += ' ';
  data += Math.random() * (160 - 1 / 1000) + 1 / 1000;
  if (i == n) break;
  data += '\n';
}
data = data + '\n]';
const resultname = 'generated.txt';
fs.writeFile(
  resultname,
  data,
  function (err) {
    if (err) throw err;
    console.log(`Solution writing to ${resultname}`);
  } //Create or overwrite result file. First line is CSV Headers.
);
