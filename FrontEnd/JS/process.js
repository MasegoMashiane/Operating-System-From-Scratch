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

export const processInit = {
    processes: [],
    currentPID:  null,
    nextPID: 1
}

export const processOp = {
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
            }
        }
        cpu.processes.push(process)
        cpu.ip++
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
    const readyProcs = cpu.processes.filter(p => p.state === "ready")
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
//Runs periodically
setInterval(schedule, 500)