const fs = require('fs'); //FS Dependency enables access to filesystem.
const n = 50000;
console.log('using random data, size %d', n);
data = '[\n';
let start = 0;
for (let i = 1; i <= n; i++) {
  data += '{\n"arrival": ';
  data += start;
  start += Math.floor(Math.random() * (256 - 1) + 1);
  data += ',\n"burst": ';
  data += Math.random() * (160 - 0.1) + 0.1;
  data += '\n}';
  if (i == n) break;
  data += ',\n';
}
data = data + '\n]';
const resultname = 'generated.json';
fs.writeFile(
  resultname,
  data,
  function (err) {
    if (err) throw err;
    console.log(`Solution writing to ${resultname}`);
  } //Create or overwrite result file. First line is CSV Headers.
);
