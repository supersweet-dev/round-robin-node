DEL bulkTestResults.csv
ECHO "Overhead Time, Quantum, Average Wait Time, Average Turnaround Time, Busy Time" > bulkTestResults.csv
node round-robin.js -r o0q50.csv
node round-robin.js -q 100 -r o0q100.csv 
node round-robin.js -q 250 -r o0q250.csv 
node round-robin.js -q 500 -r o0q500.csv 
node round-robin.js -o 5 -r o5q50.csv
node round-robin.js -o 5 -q 100 -r o5q100.csv 
node round-robin.js -o 5 -q 250 -r o5q250.csv 
node round-robin.js -o 5 -q 500 -r o5q500.csv 
node round-robin.js -o 10 -r o10q50.csv
node round-robin.js -o 10 -q 100 -r o10q100.csv 
node round-robin.js -o 10 -q 250 -r o10q250.csv 
node round-robin.js -o 10 -q 500 -r o10q500.csv 
node round-robin.js -o 15 -r o15q50.csv
node round-robin.js -o 15 -q 100 -r o15q100.csv 
node round-robin.js -o 15 -q 250 -r o15q250.csv 
node round-robin.js -o 15 -q 500 -r o15q500.csv 
node round-robin.js -o 20 -r o20q50.csv
node round-robin.js -o 20 -q 100 -r o20q100.csv 
node round-robin.js -o 20 -q 250 -r o20q250.csv 
node round-robin.js -o 20 -q 500 -r o20q500.csv 
node round-robin.js -o 25 -r o25q50.csv
node round-robin.js -o 25 -q 100 -r o25q100.csv 
node round-robin.js -o 25 -q 250 -r o25q250.csv 
node round-robin.js -o 25 -q 500 -r o25q500.csv 