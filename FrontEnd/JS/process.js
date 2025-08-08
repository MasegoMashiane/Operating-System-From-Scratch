import { cpu } from "./CPU.js";
import { ctors } from "./CPU.js";
//process management

// A process is like a running program. It,s your code 
// actively executing on the cpu. 

// Program => Blueprint
// Process => The actual construction site with workers
//            materials, and progress
// CPU => The crew that does the actual building
// Memory => The workspace and storage area

//Implement a simple cooperative multitaksing system
//You can create processes(functions/programs)
//CPU can switch between them
//Each process has:
// *It's own ID
// *Instruction pointer
// *Registers(optional)
// *State(ready, running, halted)
//A basic scheduler decides who runs next
// Each process is an object
export const processInit = {
    processes: [],
    currentPID:  null,
    nextPID: 1,
    timeQuantum: 100 //time slice in milliseconds
}

export const processOp = {
    // Creates a new process
    // Assigns unique PID
    // Initialize registers to 0
    // add to process queue
    // returns pid to caller
    spawn: program => {
        const process = {
            pid: cpu.nextPID++,
            ip: 0,
            state: "ready", program,
            registers:{
                ax: 0,
                bx: 0,
                cx: 0,
                sp: 0
            },
            //For context switching
            savedIP: 0,
            createdAt: Date.now(),
            instructionExecuted: 0,
            lastExecuted: 0 
            //

        }
        cpu.processes.push(process)
        cpu.ip++
        return process.pid
    },

    // Marks process as halted
    kill: (pid) => {
        const proc = cpu.processes.find( p=>
            p.pid === pid
        )
        if (!proc) throw new Error(`No such process ${pid}`)
            proc.state = "halted"
    },

    //Shows all active processes
    //Example output: PID: 1, state: ready, IP:3
    ps: () => {
        cpu.processes.forEach(p => {
            console.log(
                `PID: ${p.pid}, State: ${p.state}, IP: ${p.ip}`
            )
        });
        cpu.ip++
    }
}

//Add a simple Scheduler
export function schedule(){
    //Scheduler picks which process runs next
    const readyProcs = cpu.processes.filter(p => p.state === "ready")
    

    // if (readyProcs.length === 0 ) return //no processes to run

    // // Round robin scheduling: pick next process to run
    // const currentIndex = readyProcs.findIndex(p => p.pid === cpu.currentPID)
    // const nextIndex = (currentIndex+1)%readyProcs.length
    // const nextProcess = readyProcs[nextIndex]

    // contextSwitch(cpu.currentPID, nextProcess.pid)

    //Execute one instruction
    //switch to next process
    for (const proc of readyProcs){
        cpu.currentPID = proc.pid
        const instr = proc.program[proc.ip]
        
        if(!instr){
            proc.state = "halted"
            continue
        }
        try {
            if (ctors[instr.op]){
                ctors[instr.op](instr.arg)
            }
        }catch(e){
            console.log(`Error in PID ${proc.pid}:`, e.message)
        }
        proc.ip++
    }
}

// //Context Switching 
// function contextSwitch(fromPID, toPID){
//     //Save current process context 
//     if (fromPID){
//         const currentProcess = cpu.processes.find(p => p.pid === fromPID)
//         if (currentProcess && currentProcess.state === "running"){
//             //save cpu state to process
//             currentProcess.registers.ax = cpu.ax
//             currentProcess.registers.bx = cpu.bx
//             currentProcess.registers.cx = cpu.cx
//             currentProcess.registers.sp = cpu.sp
//             currentProcess.savedIP = currentProcess.ip

//             //Change state from running to ready
//             currentProcess.state = "ready"
//             console.log (` Context saved for PID ${fromPID}`)
//         }   
//     }

//     //load new process context
//     const newProcess = cpu.processes.find(p => p.pid === toPID)
//     if (newProcess && newProcess.state === "ready"){
//         //restore restore cpu state from process
//         cpu.ax = newProcess.registers.ax
//         cpu.bx = newProcess.registers.bx
//         cpu.cx = newProcess.registers.cx
//         cpu.sp = newProcess.registers.cx

//         //update process state
//         newProcess.state = "running"
//         cpu.currentPID = toPID

//         console.log(` Context loaded for PID ${toPID}`)

//         //execute one instruction for this process
//         executeProcessInstruction(newProcess)
//     }
//     cpu.ip++
//}


// function executeProcessInstruction(process){
//     const instr = process= process.program[process.ip]

//     if(!instr){
//         //process completed
//         process.state = "terminated"
//         console.log(`Process ${process.pid} completed`)

//         //clear current PID if this was the running process
//         if (cpu.currentPID === process.pid){
//             cpu.currentPID = null
//         }
//         return
//     }
//     try{
//         //execute the instruction
//         if (ctors[instr.op]){
//             ctors[instr.op](instr.arg)
//             process.ip++
//         }
//         else {
//             console.log(`Unknown instruction: ${instr.op}`)
//             process.ip++
//         }

//         //Update process statistics
//         process.instructionExecuted++
//         process.lastExecuted = Date.now()
//     }
//     catch(e){
//         console.log(` Error in PID ${process.pid}:`, e.message)
//         process.state = "terminated"
//     }
//     cpu.ip++
// }

// It is like saving your progress in one game, then loading your progress
// in another game.
// The cpu needs to:
// Save the current process's state(reg, Ip, ...)
// Load the next process's state
// Resume execution from where the new process left off

//Runs periodically
setInterval(schedule, 100)