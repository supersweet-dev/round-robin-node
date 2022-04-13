#!/usr/bin/env node

const roundRobin = () => {
  const cli = require("cli"); //CLI dependecy parses command line style inputs.

  cli.parse({
    file: [
      "f",
      "File in arrival-time burst-time format",
      "string",
      "input.txt"
    ],
    overhead: ["o", "Overhead Time in ms.", "int", 0],
    quantum: ["q", "Time Quantum in ms.", "int", 50],
    result: ["r", "File name for output", "string", "result.csv"]
  }); //Define options for command.

  const fs = require("fs"); //FS Dependency enables access to filesystem.
  const filename = cli.options.file; //Simplified variable names for option values.
  const resultname = cli.options.result;
  const overhead = cli.options.overhead;
  const quantum = cli.options.quantum;
  let avgTurn = 0; //Average Turnaround Time
  let avgWait = 0; //Average Wait Time
  let totalTime = 0; //Total Processing Time
  let totalTurn = 0; //Total Turnaround Time
  let totalWait = 0; //Total Wait Time

  fs.readFile(filename, "utf8", function(err, data) {
    //Load input file.
    if (err) throw err; //Stop program if unable to process file.

    fs.writeFile(
      resultname,
      "PId,Arrival Time,Run Time,Waiting Time,Turnaround Time,Avg Wait,Avg Turnaround\n",
      function(err) {
        if (err) throw err;
        console.log(`Solution writing to ${resultname}`);
      } //Create or overwrite result file. First line is CSV Headers.
    );

    processes = []; //Array to hold processes.
    let id = 1; //Process Ids start at 1. Assigned in original order from input file.

    for (process of data.split(/\r?\n/)) {
      //Loop through each line of the input file.
      process = process.split(/\r? /); //Split line by space.
      process = {
        id: id, //Current Id.
        arrival: parseInt(process[0]) * 1000, //First field of line is arrival time, convert to ms.
        runtime: parseFloat(process[1]) * 1000, //Second field is burst time, convert to ms.
        remainingTime: parseFloat(process[1]) * 1000, //Keep track of remaining time, initially same as burst time.
        wait: 0, //Keep track of total wait time for each individual process.
        turnaround: 0 //Recond finish time of each process.
      };
      processes.push(process); //Push into process queue.
      id++;
    }
    processes = processes.sort((a, b) => (a.arrival > b.arrival ? 1 : -1)); //Sort processes in queue by arrival time.
    totalTime += processes[0].arrival; //Accounts for time before first process arrives.
    let remaingingProcesses = processes.length; //Remaining Processes is current number of processes.
    let index = 0; //Index for while loop.
    while (remaingingProcesses > 0) {
      //While there's unfinished processes in queue...
      if (
        processes[index].remainingTime > 0 &&
        processes[index].arrival <= totalTime
      ) {
        //If process has arrived and is not finished.:
        processes[index].remainingTime =
          processes[index].remainingTime - quantum; //Run process for given time quantum.
        //console.log(`Running PId: ${processes[index].id}, Remaining time: ${processes[index].remainingTime}/${processes[index].runtime} Remaining Processes: ${remaingingProcesses}`)
        totalTime = totalTime + quantum; //Account for quantum time in total time.
        if (processes[index].remainingTime <= 0) {
          //If process finished in this step:
          processes[index].turnaround = totalTime; //Record finish time.
          processes[index].wait = totalTime - processes[index].runtime; //Record total wait for process.
          totalTurn = totalTurn + processes[index].turnaround; //Add up global totals.
          totalWait = totalWait + processes[index].wait;
          remaingingProcesses--; //Remove process from queue.
        }
        totalTime = totalTime + overhead; //Add overheard for traversing to next process.
      } else totalTime++; //Pass time in case next process hasn't arrived yet.
      index++; //Increase queue index.
      if (index === processes.length) index = 0; //Circle back to begining of queue if necessary.
    }
    totalTime = totalTime - overhead; //Discount extra overhead from final move.
    processes = processes.sort((a, b) => (a.id > b.id ? 1 : -1)); //Sort process queue by id, returning to orignal input order.
    avgTurn = totalTurn / processes.length; //Calculate time averages.
    avgWait = totalWait / processes.length;
    let processString = "";
    for (process of processes) {
      processString += `${process.id},${process.arrival},${process.runtime},${process.wait},${process.turnaround},-,-\n`;
    } //Write one line per process.
    processString += `-,-,-,-,-,${avgWait},${avgTurn}`; //final line contains averages.
    fs.appendFile(resultname, processString, function(err) {
      //Write results to file.
      if (err) throw err;
    });
    fs.appendFile('bulkTestResults.csv', `${overhead},${quantum},${avgWait/1000},${avgTurn/1000},${totalTime/1000}\n`, function(err) {
      //Write results to file.
      if (err) throw err;
    });
  });
};

roundRobin();
