//GUI terminal handling
import { cpu } from "./CPU.js";
import { getDir } from "./filesystem.js";
import { ctors } from "./CPU.js";
import { memoryOperations } from "./memory.js";
import { filesystemOps } from "./filesystem.js";
import { appManager } from "./applications/appManager.js";

/*const initialization = {
eventInit: () => { 
    input.addEventListener ('keydown', (e)=> {
    if (e.key === "Enter"){
        const cmd = input.value.trim()
        Terminal.print(`MasegoOS@emulator:~$ ${cmd}`)
        Terminal.runCommnand(cmd)
        input.value = ""
    }
})}

}*/

export class Terminal {

    constructor(outputElement, inputElement) {
        this.outputDiv = outputElement;
        this.input = inputElement;
        this.bindInput();
    }

    print(text) {
        const line = document.createElement('div');
        line.textContent = text;
        this.outputDiv.appendChild(line);
        this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
    }

    
    bindInput(){
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.input.value.trim();
                this.print(`MasegoOS@emulator:~$ ${cmd}`);
                this.runCommand(cmd);
                this.input.value = '';
            }
        })
    }

    runCommand(cmd){
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
                    this.captureOutput(()=>{
                        ctors.ls()
                    })
                    break
                case "write":
                    const [name, ...content] = arg
                    ctors.write({ name, content: content.join(" ")})
                    break
                case "clear":
                    this.outputDiv.innerHTML = ""
                    break
                case "pwd":
                    this.print("/" + cpu.cwd.join("/"))
                    break
                case "help":
                    this.print(`Supported: mkdir, cd, ls, write, read, rm, pwd, clear`)
                    break
                case "spawn":
                    const progName = arg[0]
                    if (programs[progName]){
                    ctors.spawn(programs(arg.join(" ")))}
                    else{
                        this.print(`no such program: ${progName}`)
                    } ;
                    break;
                case "ps":
                    this.captureOutput(() => ctors.ps());
                    break;
                case "kill":
                    ctors.kill(Number(arg[0]));
                    break;
                default:
                    this.print(`Unknown command: ${op}`) 
                break
            }
        }
        catch(err){
            this.print(`Error: ${err.message}`)
        }
    }

    captureOutput(fn) {
        const originalLog = console.log;
        console.log = (...args) => this.print(args.join(" "));
        try { fn(); } finally { console.log = originalLog; }
    }


}

// //export const terminalOp = {

// // printToTerminal: (text) => {
// //     const line = document.createElement('div')
// //     line.textContent = text
// //     outputDiv.appendChild(line)
// //     outputDiv.scrollTop = outputDiv.scrollHeight
// // },

// //bootloader/main loop
// //Web based terminal where a user can:
// // *Type commands lke mkdir,cd, ls, write, read, rm


// runCommnand: (cmd) => {
//     try {
//     const [op, ...arg] = cmd.split(" ")
//     const joinedArgs = arg.join(" ")
//         switch(op){
//             case "mkdir":
//             case "cd":
//             case "read": 
//             case "rm":
//                 ctors[op](joinedArgs)
//                 break
//             case "ls":
//                 captureOutput(()=>{
//                     ctors.ls()
//                 })
//                 break
//             case "write":
//                 const [name, ...content] = arg
//                 ctors.write({ name, content: content.join(" ")})
//                 break
//             case "clear":
//                 outputDiv.innerHTML = ""
//                 break
//             case "pwd":
//                 printToTerminal("/" + cpu.cwd.join("/"))
//                 break
//             case "help":
//                 printToTerminal(`Supported: mkdir, cd, ls, write, read, rm, pwd, clear`)
//                 break
//             case "spawn":
//                 const progName = arg[0]
//                 if (programs[progName]){
//                 ctors.spawn(programs(arg.join(" ")))}
//                 else{
//                     printToTerminal(`no such program: ${progName}`)
//                 } ;
//                 break;
//             case "ps":
//                 captureOutput(() => ctors.ps());
//                 break;
//             case "kill":
//                 ctors.kill(Number(arg[0]));
//                 break;
//             default:
//                 printToTerminal(`Unknown command: ${op}`) 
//             break
//         }
//     }
//     catch(err){
//         printToTerminal(`Error: ${err.message}`)
//     }
// },

// //hook console.log to terminal output
// captureOutput: (fn) => {
//     const originalLog = console.log
//     console.log = (...arg) => printToTerminal(arg.join(" "))
//     try{
//         fn()
//     }
//     finally{
//         console.log = originalLog
//     }
// }
// }