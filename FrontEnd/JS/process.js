import { cpu } from "./CPU.js";
import { ctors } from "./CPU.js";
//process management
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

export const ProcessInit = {
    processes: [],
    currentPID:  null,
    nextPID: 1
}

export const processOp = {
    spawn: program => {
        const process = {
            pid: cpu.nextPID++,
            ip: 0,
            state: "Ready", program,
            registers:{
                ax: 0,
                bx: 0,
                cx: 0,
                sp: 0
            }
        }
        cpu.processes.push(process)
        return process.pid
    },
    
    kill: (pid) => {
        const proc = cpu.processes.find( p=>
            p.pid === pid
        )
        if (!proc) throw new Error(`No such process ${pid}`)
            proc.state = "halted"
    },

    ps: () => {
        cpu.processes.array.forEach(p => {
            console.log(
                `PID: ${p.pid}, State: ${p.state}, IP: ${p.ip}`
            )
        });
    }
}

//Add a simple Scheduler