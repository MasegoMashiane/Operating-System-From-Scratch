import { cpu } from "./CPU.js";
//Virtual memory system
//Memory system for OS
//Read from memory into registers
//Write from registers into memory
//print memory contents
//validate memory bounds to avoid errors

//Store value from register to memory
export const memoryOperations = {
    StoreMem: ({ addr, reg}) => {
        if (addr >= 0 && addr < cpu.memory.length){
            cpu.memory[addr] = cpu[reg];
            cpu.ip++
        }
        else{
            console.error("Memory write out of bounds:", addr)
            cpu.halted = true
        }
    },

    //Load Value from memory to register
    loadMem:({addr, reg}) => {
        if (addr >= 0 && addr < cpu.memory.length){
            cpu[reg] = cpu.memory[addr]
            cpu.ip++
        }
        else{
            console.error("Memory read out of bounds", addr)
            cpu.halted = true
        }
    },

    //Print value at memory address
    printMem: addr => {
        if (addr >= 0 && addr < cpu.memory.length){
            console.log(`Memory[${addr}] = `, cpu.memory[addr])
            cpu.ip++
        }
        else{
            console.error("Memory read out of bounds", addr)
            cpu.halted = true
        }
    },

    //Zero out all memory (soft reset)
    clearMem: () => {
        cpu.memory.fill(0);
        console.log("memory cleared")
        cpu.ip++
    }
}