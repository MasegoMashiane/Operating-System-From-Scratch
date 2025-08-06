import { ctors } from "./CPU.js";
import { cpu } from "./CPU.js";


// Threading is like having multtiple workers(threads) inside a single workplace(process)
// each worker can do different tasks simulteneously, but they all share the same  resources 
// tools, materials, and workplace.


// Each thread maintains its own:
// Registeres (ax, bx, cx,sp)
// Instruction Pointer (current execution)
// Stack (For function calls)
// Priority (Scheduling importance)

// Context switching 
// The CPU rapidly switches between threads

// Thread synchronization 
// when threads share resources, they can interfere with eaach other
// Use mutexes (Mutual exclusions)
// Message passing


//Each thread has it own execution context but shares process memory
export const threadsInit = {
    threads: [],        //Global thread pool
    nextTID: 1,         //Next Thread ID
    currentTID: null,   //Currently executing thread
    threadQuantum: 100 //Time slice per thread (ms)
}