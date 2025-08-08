//GUI terminal handling
import { cpu } from "./CPU.js";
import { getDir } from "./filesystem.js";
import { ctors } from "./CPU.js";
import { memoryOperations } from "./memory.js";
import { filesystemOps } from "./filesystem.js";

const outputDiv =  document.getElementById('Output')
const input = document.getElementById('command')

const terminalOp = {
printToTerminal: (text) => {
    const line = document.createElement('div')
    line.textContent = text
    outputDiv.appendChild(line)
    outputDiv.scrollTop = outputDiv.scrollHeight
},

inputhandling: input.addEventListener ('keydown', (e)=> {
    if (e.key === "Enter"){
        const cmd = input.value.trim()
        printToTerminal (`MasegoOS@emulator:~$ ${cmd}`)
        runCommnand(cmd)
        input.value = ""
    }
}),

//bootloader/main loop
//Web based terminal where a user can:
// *Type commands lke mkdir,cd, ls, write, read, rm

runCommnand: (cmd) => {
    try {
    const [op, ...arg] = cmd.split(" ")
    const joinedArgs = arg.join(" ")
        switch(op){
            case "mkdir":
            case "cd":
            case "read": 
            case "rm":
                ctors[op](joinedArgs)
                break
            case "ls":
                captureOutput(()=>{
                    ctors.ls()
                })
                break
            case "write":
                const [name, ...content] = arg
                ctors.write({ name, content: content.join(" ")})
                break
            case "clear":
                outputDiv.innerHTML = ""
                break
            case "pwd":
                printToTerminal("/" + cpu.cwd.join("/"))
                break
            case "help":
                printToTerminal(`Supported: mkdir, cd, ls, write, read, rm, pwd, clear`)
                break
            case "spawn":
                ctors.spawn(eval(arg.join(" ")));
                break;
            case "ps":
                captureOutput(() => ctors.ps());
                break;
            case "kill":
                ctors.kill(Number(arg[0]));
                break;
            default:
                printToTerminal(`Unknown command: ${op}`) 
            break
        }
    }
    catch(err){
        printToTerminal(`Error: ${err.message}`)
    }
},

//hook console.log to terminal output
captureOutput: (fn) => {
    const originalLog = console.log
    console.log = (...arg) => printToTerminal(arg.join(" "))
    try{
        fn()
    }
    finally{
        console.log = originalLog
    }
}
}