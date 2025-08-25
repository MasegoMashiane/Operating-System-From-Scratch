import { cpu } from "./CPU.js";
//Virtual memory system
//Memory system for OS
//Read from memory into registers
//Write from registers into memory
//print memory contents
//validate memory bounds to avoid errors

//Store value from register to memory


//add memory allocation tracking
let memoryMap = new Array(256).fill(null); //tracks allocated blocks 

export const memoryOperations = {
   
    //allocate a block of memory
    malloc: (size) => {
        if (size <= 0 || size > 256) return null
         
        let start = -1
        let count = 0

        for (let i = 0; i < 256; i++){
            if (memoryMap[i]===null){
                if (start === -1){ start = i
                    count++
                }
                if (count === size){
                    //mark block as allocated
                    

                }
            }
        }

    },

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