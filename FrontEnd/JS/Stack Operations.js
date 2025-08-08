import { cpu } from "./CPU.js";
export const stackOps = {
    // Push register value onto stack
    push: (reg) => {
        if (cpu.sp >= cpu.memory.length) {
            throw new Error("Stack overflow!");
        }
        cpu.memory[cpu.sp] = cpu[reg];
        cpu.sp++;
        console.log(`📚 PUSH ${reg}: ${cpu[reg]} → stack[${cpu.sp-1}]`);
        cpu.ip++;
    },
    
    // Pop value from stack to register
    pop: (reg) => {
        if (cpu.sp <= 0) {
            throw new Error("Stack underflow!");
        }
        cpu.sp--;
        cpu[reg] = cpu.memory[cpu.sp];
        console.log(`📖 POP ${reg}: stack[${cpu.sp}] → ${cpu[reg]}`);
        cpu.ip++;
    },
    
    // Peek at top of stack without removing
    peek: () => {
        if (cpu.sp <= 0) {
            console.log("Stack is empty");
            return;
        }
        console.log(`👀 Stack top: ${cpu.memory[cpu.sp-1]}`);
        cpu.ip++;
    },
    
    // Print current stack contents
    printStack: () => {
        console.log("=== STACK CONTENTS ===");
        console.log(`SP points to: ${cpu.sp}`);
        for (let i = 0; i < cpu.sp; i++) {
            console.log(`Stack[${i}]: ${cpu.memory[i]}`);
        }
        cpu.ip++;
    }
};


