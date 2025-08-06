import { cpu } from "./CPU.js"
//hierarchical file system logic

//function to get CWD
export function getDir(cpu){
    let dir = cpu.fs.root
    
    for (const folder of cpu.cwd){
        if  (!(folder in dir)) throw new Error(`Directory not found: ${folder}`)
        dir = dir[folder]
    }
    return dir
}

export const filesystemOps = {

    mkdir: name =>{
        const dir = getDir(cpu);
        if (dir[name])
            throw new Error(`directory already exists: ${name}`)
        dir[name] = {}
        cpu.ip++
    },
    cd: name =>{
        if (name === ".."){
            cpu.cwd.pop();
        }
        else{
            const dir = getDir(cpu)
            if (!(name in dir) || typeof dir[name] !== "object"){
                throw new Error(`No such directory: ${name}`)
            }
            cpu.cwd.push(name)
        }
        cpu.ip++
    },
    ls: () =>{
        const dir = getDir(cpu);
        console.log("folderIcon", "/" + cpu.cwd.join("/"))
        for (const key in dir){
            console.log(typeof dir[key] === "object" ? `[DIR] ${key}`: `${key}`)
        }
        cpu.ip++
    },
    write:({name, content})=> {
        const dir = getDir(cpu);
        dir[name] = content
        cpu.ip++
    },
    read: name => {
        const dir = getDir(cpu);
        if (!(name in dir)) throw new Error(`no such file: ${name}`)
        console.log(`${name}: ${dir[name]}`)
        cpu.ip++
    },
    rm: name => {
        const dir = getDir(cpu);
        if (!(name in dir)) throw new Error(`no such file/folder: ${name}`)
        delete dir[name]
        cpu.ip++
    },
}