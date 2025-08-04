import { getDir } from "./filesystem.js";
import { filesystemOps } from "./filesystem.js";
import { memoryOperations } from "./memory.js";
import { ProcessInit } from "./process.js";

// CPU Interpreter

// Defining CPU STATE
//Check for **** 


export const cpu = {
// General purpose registers
// Basically small storage boxes
// They hold values temporarily during operations
    ax: 0,
    bx: 0,
    cx: 0,


// Stack pointer(SP) => Keeps track of where the top of the stack is
// Stack is used for things like function calls, return addresses, 
// or temporary storage
// eg. cpu.sp = 10 : SP is pointing to memory address 10
    sp: 0,   


// Instruction Pointer => keeps track of the current instruction to execute
    ip: 0,  


// Simulated RAM: A block of 256 memory cells initialized to 0
// e.g cpu.memory[0] = 42 => writes 42 at the index of 0
    memory: new Array(256).fill(0), 


// CPU Stop Flag
// When set to true, instruction runner stops
    halted: false,
    

//For conditional branching (i.e., result of comparison)
    flag: null,

//Adding file system to cpu
//Directories are objects
//Files are strings(or any data)
//Supports commands like mkdir, cd, ls, write, read, and rm
    
fs: {
        root:{}
    },
//current working directory path (e.g., ['home','user'])
cwd: []

};


//DEFINING OPERATIONS
//CPUs Operation Codes 
//Each one is a function
//Ctors => Constructors
//Map of named functions each representing CPU instructions 

//EXPAND
// Add arithmetic instructions liek add(ax, bx)***
// Implement flags (zero, carry, overflow)***
// log CPU state after each instructions***

//WHAT'S MISSING?
// Fetch and OPCode
// Look it up in ctors
// call it like:


export const ctors = {
//These are data transfer instructions, moving a value to specific registers
//Storing values into registers
    copy2ax: val => {
        cpu.ax = val
        cpu.ip++
    },
    copy2bx: val => {
        cpu.bx = val
        cpu.ip++
    },
    copy2cx: val => {
        cpu.cx = val
        cpu.ip++
    },
//Sets the stack pounter
    copy2sp: val =>{
        cpu.sp = val
        cpu.ip ++
    },
//Sets the instruction pointer
    copy2ip: val => cpu.ip = val,

//Adding file/folder Operations 

   
//Comparisons
    cmpax: val => {
        if(cpu.ax === val){
            cpu.flag = "eq"
        }
        else if(cpu.ax > val){
            cpu.flag = "gt"
        }
        else{
            cpu.flag = "lt"
        }
        cpu.ip++
    },

    cmpbx: val => {
        if(cpu.bx === val){
            cpu.flag = "eq"
        }
        else if(cpu.bx > val){
            cpu.flag = "gt"
        }
        else{
            cpu.flag = "lt"
        }
        cpu.ip++
    },

    cmpcx: val => {
        if(cpu.cx === val){
            cpu.flag = "eq"
        }
        else if(cpu.cx > val){
            cpu.flag = "gt"
        }
        else{
            cpu.flag = "lt"
        }
        cpu.ip++
    },

//Conditional jumps
    jmpIfEqual: addr => {
        if (cpu.flag === "eq"){
            cpu.ip = addr
        }
    },
    jmpIfNotEqual: addr => {
        if (cpu.flag !== "eq"){
            cpu.ip = addr
        }
    },
    jmpIfGreater: addr => {
        if (cpu.flag === "gt"){
            cpu.ip = addr
        }
    },
    jmpIfLess: addr => {
        if (cpu.flag === "lt"){
            cpu.ip = addr
        }
    },

//Register-to-register copy
//Move value between parts of the CPU
//      Maybe one register holds a result you want to reuse in another
//Prepare value for operations
//      You might copy to ax to use it as an accumulator for arithmetic
//Preserve a value
//      Before overwritting a register, you can copy its contents elsewhere for 
//      safekeeping
copybx2ax: () => {
    cpu.ax = cpu.bx
    cpu.ip++
},
copybx2cx: () => {
    cpu.cx = cpu.bx
    cpu.ip++
},
copyax2bx: () => {
    cpu.bx = cpu.ax
    cpu.ip++
},
copyax2cx: () => {
    cpu.cx = cpu.ax
    cpu.ip++
},
copycx2ax: () => {
    cpu.ax = cpu.cx
    cpu.ip++
},
copycx2bx: () => {
    cpu.bx = cpu.cx
    cpu.ip++
},

//Swap Registers
//Reorder values for comparisons or sorting
//temporary rearrangement before an operation
//stack operations
swapaxbx: () => {
    const temp = cpu.ax
    cpu.ax = cpu.bx
    cpu.bx = temp
    cpu.ip++
},
swapaxcx: () => {
    const temp = cpu.ax
    cpu.ax = cpu.cx
    cpu.cx = temp
    cpu.ip++
},
swapbxcx: () => {
    const temp = cpu.bx
    cpu.bx = cpu.cx
    cpu.cx = temp
    cpu.ip++
},


//Arithmetic operations
//ax arithmetic operations
    add2ax: val => {
        cpu.ax += val
        cpu.ip++
    },
    sub2ax: val => {
        cpu.ax -= val
        cpu.ip ++
    },
    mul2ax: val => {
        cpu.ax *= val
        cpu.ip++
    },
    div2ax: val => {
        if (val === 0){
            console.error("Division by zero");
            cpu.halted = true;
        } 
        else{
        cpu.ax = Math.floor(cpu.ax/val)
        }
        cpu.ip++
    },    
    mod2ax: val => {
        if (val === 0){
            console.error("modulo by Zero")
        }
        else{
        cpu.ax = cpu.ax%val
        }
        cpu.ip++
    },


//bx arithmetic operations
    add2bx: val => {
        cpu.bx += val
        cpu.ip++
    },
    sub2bx: val => {
        cpu.bx -= val
        cpu.ip ++
    },
    mul2bx: val => {
        cpu.bx *= val
        cpu.ip++
    },
    div2bx: val => {
        if (val === 0){
            console.error("Division by zero");
            cpu.halted = true;
        } 
        else{
        cpu.bx = Math.floor(cpu.bx/val)
        }
        cpu.ip++
    },
    mod2bx: val => {
        if (val === 0){
            console.error("modulo by Zero")
        }
        else{
        cpu.bx = cpu.bx%val
        }
        cpu.ip++
    },

//cx arithmetic operations        
    add2cx: val => {
        cpu.cx += val
        cpu.ip++
    },
    sub2cx: val => {
        cpu.cx -= val
        cpu.ip ++
    },
    mul2cx: val => {
        cpu.cx *= val
        cpu.ip++
    },
    div2cx: val => {
        if (val === 0){
            console.error("Division by zero");
            cpu.halted = true;
        } 
        else{
        cpu.cx = Math.floor(cpu.cx/val)
        }
        cpu.ip++
    },
    mod2cx: val => {
        if (val === 0){
            console.error("modulo by Zero")
        }
        else{
        cpu.cx = cpu.cx%val
        }
        cpu.ip++
    },


//Increment and Decrement
    incax:()=>{
        cpu.ax++
        cpu.ip++
    },
    decax:()=>{
        cpu.ax--
        cpu.ip++
    },
    incbx:()=>{
        cpu.bx++
        cpu.ip++
    },
    decbx:()=>{
        cpu.bx--
        cpu.ip++
    },
    inxcx:()=>{
        cpu.cx++
        cpu.ip++
    },
    deccx:()=>{
        cpu.cx--
        cpu.ip++
    },
    incsp:()=>{
        cpu.sp++
        cpu.ip++
    },
    decsp:()=>{
        cpu.sp--
        cpu.ip++
    },


//Print Register Values
    printax: () => {
        console.log(`AX: ${cpu.ax}`)
        cpu.ip++
    },
    printbx: () => {
        console.log(`BX: ${cpu.bx}`)
        cpu.ip++
    },
    printcx: () => {
        console.log(`CX: ${cpu.cx}`)
        cpu.ip++
    },
    printsp: () => {
        console.log(`SP: ${cpu.cx}`)
        cpu.ip++
    },

    
//Simulated BIOS interrupt, it logs that a BIOS interrupt has happened
//Could be used to simulate disk access or boot sequence****
    biosInterrupt: () => { 
        console.log("BIOS interupt triggered")
    },

//Simulates disabling interrupts
//Very low level hardware stuff : TO avoid race conditions during critical operations
    disableInterupt: () => {
        console.log("Interupts disabled")
    },

//Stops the CPU by setting a halted flag
//The run(instructions) loop would check cpu.halted === true and stop running further instructions
    halt: () => {
        cpu.halted = true;
        console.log("cpu halted")
    },

//This makes the CPU jump to another memor address like a goto in old programming languages
//It directly sets the instruction pointer
    jmp: addr => {
        cpu.ip = addr;
        console.log(`Jumped to address ${addr}`)
    },

//This moves the instruction ponter forward by some amount: Skipping filler bytes or delays
    padding: amt => {
        cpu.ip += amt
    },

//bugging or testing instruction for detecting wheter the CPU reached a certain point
    magicstr: () => {
        console.log("Welcome to Masego's OS")
        cpu.ip++
    }
    
};


//Instruction Runner
//Function taking an array of instructions(each being an object)
function run (instructions) {
    //start from the first instruction in the list
    cpu.ip = 0;
    
    //Keeps running as long as Cpu.ip is not past the end of the instructions
    //And the cpu hasn't been halted
    while (cpu.ip < instructions.length && !cpu.halted){
        const instr = instructions[cpu.ip];
        const {op, arg} = instr;
        //const currentIp = cpu.ip

        if(ctors[op]){
            ctors[op](arg)
        }
        else{
            console.warn(`unknown operation: ${op}`)
        }
    }
    console.log("Final CPU State:", cpu)
}

Object.assign(ctors, filesystemOps, getDir, memoryOperations)
Object.assign(cpu, ProcessInit)
//test1
//Infinite loop
// const script = [
//     {op: "copy2ax", arg: 42},
//     {op: "copy2sp", arg: 10}, 
//     {op: "magicstr"},
//     {op: "jmp", arg: 4},
//     {op: "halt"}
// ];
// run(script)




//test2
//Math Operations
// const mathProgram = [
//     { op: "copy2ax", arg: 90 },    // ax = 10
//     { op: "add2ax", arg: 5 },      // ax = 15
//     { op: "mul2ax", arg: 2 },      // ax = 30
//     { op: "sub2ax", arg: 4 },      // ax = 26
//     { op: "div2ax", arg: 2 },      // ax = 13
//     { op: "magicstr" },
//     { op: "halt" }
// ];
// run(mathProgram)

//test3
//Memory Operations Test
// const memoryTest = [
//     // Load values into registers
//     { op: "copy2ax", arg: 42 },        // ax = 42
//     { op: "copy2bx", arg: 100 },       // bx = 100
//     { op: "copy2cx", arg: 255 },       // cx = 255
    
//     // Store register values into memory
//     { op: "StoreMem", arg: { addr: 0, reg: "ax" } },   // memory[0] = 42
//     { op: "StoreMem", arg: { addr: 1, reg: "bx" } },   // memory[1] = 100
//     { op: "StoreMem", arg: { addr: 2, reg: "cx" } },   // memory[2] = 255
    
//     // Print what we stored
//     { op: "printMem", arg: 0 },        // Should show: Memory[0] = 42
//     { op: "printMem", arg: 1 },        // Should show: Memory[1] = 100
//     { op: "printMem", arg: 2 },        // Should show: Memory[2] = 255
    
//     // Clear registers to test loading
//     { op: "copy2ax", arg: 0 },         // ax = 0
//     { op: "copy2bx", arg: 0 },         // bx = 0
//     { op: "copy2cx", arg: 0 },         // cx = 0
    
//     // Load values back from memory
//     { op: "loadMem", arg: { addr: 0, reg: "ax" } },    // ax = memory[0] = 42
//     { op: "loadMem", arg: { addr: 1, reg: "bx" } },    // bx = memory[1] = 100
//     { op: "loadMem", arg: { addr: 2, reg: "cx" } },    // cx = memory[2] = 255
    
//     // Print registers to verify loading worked
//     { op: "printax" },                 // Should show: AX: 42
//     { op: "printbx" },                 // Should show: BX: 100
//     { op: "printcx" },                 // Should show: CX: 255
    
//     // Test memory bounds (this should cause an error)
//     // { op: "StoreMem", arg: { addr: 300, reg: "ax" } }, // Uncomment to test error handling
    
//     { op: "magicstr" },
//     { op: "halt" }
// ];
// run(memoryTest)


//test4
// //File System Operations Test
// const fileSystemTest = [
//     // Create some directories
//     { op: "mkdir", arg: "documents" },
//     { op: "mkdir", arg: "photos" },
//     { op: "mkdir", arg: "projects" },
    
//     // List root directory contents
//     { op: "ls" },                      // Should show: documents, photos, projects
    
//     // Navigate into documents folder
//     { op: "cd", arg: "documents" },
    
//     // Create files in documents
//     { op: "write", arg: { name: "readme.txt", content: "Welcome to my OS!" } },
//     { op: "write", arg: { name: "notes.txt", content: "Important notes here" } },
    
//     // Create a subdirectory
//     { op: "mkdir", arg: "personal" },
    
//     // List documents directory
//     { op: "ls" },                      // Should show: readme.txt, notes.txt, personal/
    
//     // Read a file
//     { op: "read", arg: "readme.txt" }, // Should show file contents
    
//     // Navigate to subdirectory
//     { op: "cd", arg: "personal" },
    
//     // Create file in subdirectory
//     { op: "write", arg: { name: "diary.txt", content: "My personal thoughts" } },
    
//     // List subdirectory
//     { op: "ls" },                      // Should show: diary.txt
    
//     // Navigate back to parent
//     { op: "cd", arg: ".." },           // Back to documents/
    
//     // Navigate back to root
//     { op: "cd", arg: ".." },           // Back to root/
    
//     // Navigate to projects folder
//     { op: "cd", arg: "projects" },
    
//     // Create project files
//     { op: "write", arg: { name: "main.js", content: "console.log('Hello World')" } },
//     { op: "write", arg: { name: "package.json", content: '{"name": "my-project"}' } },
    
//     // List projects
//     { op: "ls" },                      // Should show: main.js, package.json
    
//     // Read project file
//     { op: "read", arg: "main.js" },
    
//     // Go back to root
//     { op: "cd", arg: ".." },
    
//     // Final directory listing
//     { op: "ls" },                      // Should show all root directories
    
//     // Test file deletion
//     { op: "cd", arg: "photos" },
//     { op: "write", arg: { name: "temp.jpg", content: "temporary image data" } },
//     { op: "ls" },                      // Should show temp.jpg
//     { op: "rm", arg: "temp.jpg" },     // Delete the file
//     { op: "ls" },                      // Should be empty now
    
//     { op: "magicstr" },
//     { op: "halt" }
// ];

// run(fileSystemTest);