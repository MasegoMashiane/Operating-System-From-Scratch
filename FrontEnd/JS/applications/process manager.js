import { processOp } from "../process.js";
import { cpu } from "../CPU.js";

export class ProcessMonitor {
    constructor(listContainer) {
        this.listContainer = listContainer;
    }

    refreshList() {
        this.listContainer.innerHTML = "";

        if (!cpu.processes || cpu.processes.length === 0) {
            this.listContainer.innerHTML = `<div style="color: #aaa;">No active processes</div>`;
            return;
        }

        cpu.processes.forEach(proc => {
            const procEl = document.createElement("div");
            procEl.style.cssText = "display: flex; justify-content: space-between; padding: 4px; border-bottom: 1px solid #555; color: #ddd;";
            
            procEl.innerHTML = `
                <div>PID: ${proc.pid}</div>
                <div>State: ${proc.state}</div>
                <div>IP: ${proc.ip}</div>
                <button style="background: #d9534f; color: white; border: none; padding: 2px 6px; cursor: pointer; border-radius: 4px;">Kill</button>
            `;

            procEl.querySelector("button").addEventListener("click", () => {
                if (confirm(`Kill process ${proc.pid}?`)) {
                    processOp.kill(proc.pid);
                    this.refreshList();
                }
            });

            this.listContainer.appendChild(procEl);
        });
    }
}