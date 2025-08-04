import { cpu } from "./CPU.js";
import { getDir } from "./filesystem.js";
import { ctors } from "./CPU.js";
import { memoryOperations } from "./memory.js";
import { filesystemOps } from "./filesystem.js";

//bootloader/main loop
//Web based terminal where a user can:
// *Type commands lke mkdir,cd, ls, write, read, rm

function runCommnand(cmd){
    try {
    const [op, ...arg] = cmd.split(" ")
    const joinedArgs = arg.join(" ")
        switch(op){
            case "mkdir":
            case "cd":
            case "rm":
                ctors[op](joinedArgs)
                break
            case "ls":
                break
            case "write":
                break
            case "clear":
                break
            case "pwd":
                break
            case "help":
                break
            default:
                printToTerminal(`Unknown command: ${op}`) //***  
            break
        }
    }
    catch(err){
        PrintToTerminal(`Error: ${err.message}`)
    }
}

//hook console.log to terminal output
function captureOutput(fn){
    const originalLog = console.log
    console.log = (...arg) => printToTerminal(arg.join(" "))
        try{
            fn()
        }
        finally{
            console.log = originalLog
        }
}