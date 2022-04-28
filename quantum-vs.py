import json
from types import SimpleNamespace
from statistics import mode, mean, median
import copy

overhead = 20
quantum = 18
avgTurn = 0 
avgWait = 0 
totalTime = 0 
totalTurn = 0 
totalWait = 0

data = json.loads(open('./generated.json', 'r').read(), object_hook=lambda d: SimpleNamespace(**d))

bursts = []
for process in data:
  bursts.append(int(process.burst))
bursts.sort()

print("mode: ", mode(bursts))
print("mean: ", mean(bursts))
print("median: ", median(bursts))
print("1st Quartile", median(bursts[:int(len(bursts)/2)]))

print('processes with burst less than 126: ',sum(x.burst <= 126 for x in data))
print('processes with burst less than 80: ',sum(x.burst <= 80 for x in data))

dataset = [] #Array to hold processes.
id = 1 #Process Ids start at 1. Assigned in original order from input file.

for process in data:
      #Loop through each line of the input file.
      process.id = id #Current Id.
      process.arrival = process.arrival * 1000 #First field of line is arrival time, convert to ms.
      process.runtime = process.burst * 1000 #Second field is burst time, convert to ms.
      process.remainingTime = process.burst * 1000 #Keep track of remaining time, initially same as burst time.
      process.wait = 0 #Keep track of total wait time for each individual process.
      process.turnaround = 0 #Recond finish time of each process.
      dataset.append(process) #Push into process queue.
      id += 1

dataset.sort(key=lambda x: x.arrival) #Sort processes in queue by arrival time.
processes = copy.deepcopy(dataset)

totalTime += processes[0].arrival #Accounts for time before first process arrives.
remaingingProcesses = len(processes) #Remaining Processes is current number of processes.
index = 0 #Index for while loop.
while remaingingProcesses > 0:
  #While there's unfinished processes in queue...
  if ( processes[index].remainingTime > 0 and processes[index].arrival <= totalTime) :
    #If process has arrived and is not finished.:
    processes[index].remainingTime = processes[index].remainingTime - quantum #Run process for given time quantum.
    #console.log(`Running PId: ${processes[index].id}, Remaining time: ${processes[index].remainingTime}/${processes[index].runtime} Remaining Processes: ${remaingingProcesses}`)
    totalTime = totalTime + quantum #Account for quantum time in total time.
    if (processes[index].remainingTime <= 0):
      #If process finished in this step:
      processes[index].turnaround = totalTime #Record finish time.
      processes[index].wait = totalTime - processes[index].runtime #Record total wait for process.
      totalTurn = totalTurn + processes[index].turnaround #Add up global totals.
      totalWait = totalWait + processes[index].wait
      remaingingProcesses-=1 #Remove process from queue.
    totalTime = totalTime + overhead #Add overheard for traversing to next process.
  else: totalTime+=1 #Pass time in case next process hasn't arrived yet.
  index += 1 #Increase queue index.
  if (index == len(processes)): index = 0 #Circle back to begining of queue if necessary.

totalTime = totalTime - overhead #Discount extra overhead from final move.
avgTurn = totalTurn / len(processes) #Calculate time averages.
avgWait = totalWait / len(processes)

print("Static Quantum Performance:")
sTime = totalTime/1000
sTurn = avgTurn/1000
sWait = avgWait/1000
print("Total Time seconds:", sTime)
print("Avg Turn seconds:", sTurn)
print("Avg Wait seconds:", sWait)

processes = copy.deepcopy(dataset)
quantumSD = 19
quantumXL = 22
quantumXS = 67
avgTurn = 0 
avgWait = 0 
totalTime = 0 
totalTurn = 0 
totalWait = 0

totalTime += processes[0].arrival #Accounts for time before first process arrives.
remaingingProcesses = len(processes) #Remaining Processes is current number of processes.
index = 0 #Index for while loop.
while remaingingProcesses > 0:
  quantum = quantumXS if processes[index].remainingTime < 80000 else (quantumSD if processes[index].remainingTime < 160000 else quantumXL)
  #While there's unfinished processes in queue...
  if ( processes[index].remainingTime > 0 and processes[index].arrival <= totalTime) :
    #If process has arrived and is not finished.:
    processes[index].remainingTime = processes[index].remainingTime - quantum #Run process for given time quantum.
    #console.log(`Running PId: ${processes[index].id}, Remaining time: ${processes[index].remainingTime}/${processes[index].runtime} Remaining Processes: ${remaingingProcesses}`)
    totalTime = totalTime + quantum #Account for quantum time in total time.
    if (processes[index].remainingTime <= 0):
      #If process finished in this step:
      processes[index].turnaround = totalTime #Record finish time.
      processes[index].wait = totalTime - processes[index].runtime #Record total wait for process.
      totalTurn = totalTurn + processes[index].turnaround #Add up global totals.
      totalWait = totalWait + processes[index].wait
      remaingingProcesses-=1 #Remove process from queue.
    totalTime = totalTime + overhead #Add overheard for traversing to next process.
  else: totalTime+= 1 #Pass time in case next process hasn't arrived yet.
  index += 1 #Increase queue index.
  if (index == len(processes)): index = 0 #Circle back to begining of queue if necessary.

totalTime = totalTime - overhead #Discount extra overhead from final move.
avgTurn = totalTurn / len(processes) #Calculate time averages.
avgWait = totalWait / len(processes)

print("Dynamic Quantum Performance:")
dTime = totalTime/1000
dTurn = avgTurn/1000
dWait = avgWait/1000
print("Total Time seconds:", dTime)
print("Avg Turn seconds:", dTurn)
print("Avg Wait seconds:", dWait)

print("Total Time difference:", sTime - dTime)
print("Percent Decrease with Dynamic RR:", 100 - dTime/sTime * 100)
print("Avg Turn difference:", sTurn - dTurn)
print("Percent Decrease with Dynamic RR:", 100 - dTurn/sTurn * 100)
print("Avg Wait difference:", sWait - dWait)
print("Percent Decrease with Dynamic RR:", 100 - dWait/sWait * 100)