import { cpu } from "../CPU.js";
import { ctors } from "../CPU.js";

// Application Manager - Handles dynamic UI injection and window management
export class ApplicationManager {
    constructor() {
        this.openWindows = new Map(); // Track open application windows
        this.nextWindowId = 1;
        this.zIndexCounter = 1000;
        this.applications = new Map(); // Registry of available applications
        
        // Initialize the desktop container
        this.initializeDesktop();
        this.registerApplications();
    }

    initializeDesktop() {
        // Create desktop container if it doesn't exist
        let desktop = document.getElementById('desktop');
        if (!desktop) {
            desktop = document.createElement('div');
            desktop.id = 'desktop';
            desktop.className = 'desktop-container';
            document.body.appendChild(desktop);
        }

        // Add desktop styles
        this.injectDesktopStyles();
        
        // Create taskbar
        this.createTaskbar();
    }

    injectDesktopStyles() {
        const styleId = 'desktop-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            .desktop-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                overflow: hidden;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .app-window {
                position: absolute;
                background: #2d2d2d;
                border: 2px solid #555;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                min-width: 300px;
                min-height: 200px;
                overflow: hidden;
            }

            .window-titlebar {
                background: linear-gradient(90deg, #404040 0%, #505050 100%);
                color: white;
                padding: 8px 12px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            }

            .window-title {
                font-weight: bold;
                font-size: 14px;
            }

            .window-controls {
                display: flex;
                gap: 8px;
            }

            .window-control {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
            }

            .control-minimize { background: #ffbd2e; }
            .control-maximize { background: #28ca42; }
            .control-close { background: #ff5f57; color: white; }

            .window-content {
                padding: 16px;
                height: calc(100% - 40px);
                overflow: auto;
                background: #1e1e1e;
                color: #ffffff;
            }

            .taskbar {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 50px;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                padding: 0 16px;
                z-index: 10000;
            }

            .app-icon {
                width: 40px;
                height: 40px;
                margin: 0 8px;
                background: #333;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                transition: all 0.2s ease;
            }

            .app-icon:hover {
                background: #555;
                transform: translateY(-2px);
            }

            .app-icon.active {
                background: #0078d4;
            }
        `;
        document.head.appendChild(styles);
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="app-icon" data-app="terminal" title="Terminal">
                🖥️
            </div>
            <div class="app-icon" data-app="calculator" title="Calculator">
                🧮
            </div>
            <div class="app-icon" data-app="notepad" title="Notepad">
                📝
            </div>
            <div class="app-icon" data-app="filemanager" title="File Manager">
                📁
            </div>
            <div class="app-icon" data-app="processmonitor" title="Process Monitor">
                ⚙️
            </div>
        `;

        // Add click handlers for app icons
        taskbar.addEventListener('click', (e) => {
            const appIcon = e.target.closest('.app-icon');
            if (appIcon) {
                const appName = appIcon.dataset.app;
                this.launchApplication(appName);
            }
        });

        document.getElementById('desktop').appendChild(taskbar);
    }

    registerApplications() {
        // Register built-in applications
        this.applications.set('calculator', {
            name: 'Calculator',
            icon: '🧮',
            width: 300,
            height: 400,
            createContent: () => this.createCalculatorUI()
        });

        this.applications.set('notepad', {
            name: 'Notepad',
            icon: '📝',
            width: 500,
            height: 400,
            createContent: () => this.createNotepadUI()
        });

        this.applications.set('terminal', {
            name: 'Terminal',
            icon: '🖥️',
            width: 600,
            height: 400,
            createContent: () => this.createTerminalUI()
        });

        this.applications.set('filemanager', {
            name: 'File Manager',
            icon: '📁',
            width: 600,
            height: 500,
            createContent: () => this.createFileManagerUI()
        });

        this.applications.set('processmonitor', {
            name: 'Process Monitor',
            icon: '⚙️',
            width: 700,
            height: 500,
            createContent: () => this.createProcessMonitorUI()
        });
    }

    launchApplication(appName) {
        const app = this.applications.get(appName);
        if (!app) {
            console.error(`Application ${appName} not found`);
            return;
        }

        // Check if app is already open
        for (const [windowId, window] of this.openWindows) {
            if (window.appName === appName) {
                this.focusWindow(windowId);
                return;
            }
        }

        // Create new window
        const windowId = this.createWindow(app, appName);
        console.log(`🚀 Launched ${app.name} (Window ID: ${windowId})`);
    }

    createWindow(app, appName) {
        const windowId = this.nextWindowId++;
        const window = document.createElement('div');
        window.className = 'app-window';
        window.id = `window-${windowId}`;
        window.style.width = `${app.width}px`;
        window.style.height = `${app.height}px`;
        window.style.left = `${50 + (windowId * 30)}px`;
        window.style.top = `${50 + (windowId * 30)}px`;
        window.style.zIndex = this.zIndexCounter++;

        // Create window structure
        window.innerHTML = `
            <div class="window-titlebar">
                <div class="window-title">${app.icon} ${app.name}</div>
                <div class="window-controls">
                    <div class="window-control control-minimize" data-action="minimize">−</div>
                    <div class="window-control control-maximize" data-action="maximize">□</div>
                    <div class="window-control control-close" data-action="close">×</div>
                </div>
            </div>
            <div class="window-content" id="content-${windowId}">
                ${app.createContent()}
            </div>
        `;

        // Add event listeners
        this.addWindowEventListeners(window, windowId);

        // Add to desktop
        document.getElementById('desktop').appendChild(window);

        // Track the window
        this.openWindows.set(windowId, {
            element: window,
            appName: appName,
            minimized: false
        });

        return windowId;
    }

    addWindowEventListeners(window, windowId) {
        const titlebar = window.querySelector('.window-titlebar');
        const controls = window.querySelector('.window-controls');

        // Window dragging
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            dragOffset.x = e.clientX - window.offsetLeft;
            dragOffset.y = e.clientY - window.offsetTop;
            
            this.focusWindow(windowId);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            window.style.left = `${e.clientX - dragOffset.x}px`;
            window.style.top = `${e.clientY - dragOffset.y}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Window controls
        controls.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            switch (action) {
                case 'close':
                    this.closeWindow(windowId);
                    break;
                case 'minimize':
                    this.minimizeWindow(windowId);
                    break;
                case 'maximize':
                    this.maximizeWindow(windowId);
                    break;
            }
        });

        // Focus on click
        window.addEventListener('mousedown', () => {
            this.focusWindow(windowId);
        });
    }

    focusWindow(windowId) {
        const window = this.openWindows.get(windowId);
        if (window) {
            window.element.style.zIndex = this.zIndexCounter++;
        }
    }

    closeWindow(windowId) {
        const window = this.openWindows.get(windowId);
        if (window) {
            window.element.remove();
            this.openWindows.delete(windowId);
            console.log(`🗑️ Closed window ${windowId}`);
        }
    }

    minimizeWindow(windowId) {
        const window = this.openWindows.get(windowId);
        if (window) {
            window.element.style.display = window.minimized ? 'block' : 'none';
            window.minimized = !window.minimized;
        }
    }

    maximizeWindow(windowId) {
        const window = this.openWindows.get(windowId);
        if (window) {
            const element = window.element;
            if (element.dataset.maximized === 'true') {
                // Restore
                element.style.width = element.dataset.originalWidth;
                element.style.height = element.dataset.originalHeight;
                element.style.left = element.dataset.originalLeft;
                element.style.top = element.dataset.originalTop;
                element.dataset.maximized = 'false';
            } else {
                // Maximize
                element.dataset.originalWidth = element.style.width;
                element.dataset.originalHeight = element.style.height;
                element.dataset.originalLeft = element.style.left;
                element.dataset.originalTop = element.style.top;
                
                element.style.width = 'calc(100vw - 20px)';
                element.style.height = 'calc(100vh - 70px)';
                element.style.left = '10px';
                element.style.top = '10px';
                element.dataset.maximized = 'true';
            }
        }
    }

    // Application UI Creators
    createCalculatorUI() {
        return `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 250px;">
                <div id="calc-display" style="grid-column: 1/-1; background: #000; color: #0f0; padding: 16px; text-align: right; font-family: monospace; font-size: 18px; border-radius: 4px;">0</div>
                <button class="calc-btn" data-value="C" style="background: #ff6b6b; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">C</button>
                <button class="calc-btn" data-value="±" style="background: #4ecdc4; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">±</button>
                <button class="calc-btn" data-value="%" style="background: #4ecdc4; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">%</button>
                <button class="calc-btn" data-value="/" style="background: #45b7d1; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">÷</button>
                <button class="calc-btn" data-value="7" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">7</button>
                <button class="calc-btn" data-value="8" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">8</button>
                <button class="calc-btn" data-value="9" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">9</button>
                <button class="calc-btn" data-value="*" style="background: #45b7d1; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">×</button>
                <button class="calc-btn" data-value="4" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">4</button>
                <button class="calc-btn" data-value="5" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">5</button>
                <button class="calc-btn" data-value="6" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">6</button>
                <button class="calc-btn" data-value="-" style="background: #45b7d1; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">−</button>
                <button class="calc-btn" data-value="1" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">1</button>
                <button class="calc-btn" data-value="2" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">2</button>
                <button class="calc-btn" data-value="3" style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">3</button>
                <button class="calc-btn" data-value="+" style="background: #45b7d1; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">+</button>
                <button class="calc-btn" data-value="0" style="grid-column: 1/3; background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">0</button>
                <button class="calc-btn" data-value="." style="background: #666; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">.</button>
                <button class="calc-btn" data-value="=" style="background: #45b7d1; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer;">=</button>
            </div>
            <script>
                // Calculator logic will be added here
                setTimeout(() => {
                    const display = document.getElementById('calc-display');
                    const buttons = document.querySelectorAll('.calc-btn');
                    let currentValue = '0';
                    let operator = null;
                    let waitingForOperand = false;
                    
                    buttons.forEach(button => {
                        button.addEventListener('click', () => {
                            const value = button.dataset.value;
                            
                            if (value >= '0' && value <= '9' || value === '.') {
                                if (waitingForOperand) {
                                    currentValue = value;
                                    waitingForOperand = false;
                                } else {
                                    currentValue = currentValue === '0' ? value : currentValue + value;
                                }
                            } else if (value === 'C') {
                                currentValue = '0';
                                operator = null;
                                waitingForOperand = false;
                            } else if (value === '=') {
                                // Simple calculation logic here
                                display.textContent = currentValue;
                                return;
                            } else {
                                operator = value;
                                waitingForOperand = true;
                            }
                            
                            display.textContent = currentValue;
                        });
                    });
                }, 100);
            </script>
        `;
    }

    createNotepadUI() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #333; padding: 8px; border-bottom: 1px solid #555;">
                    <button id="save-btn" style="background: #0078d4; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">Save</button>
                    <button id="load-btn" style="background: #0078d4; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer;">Load</button>
                </div>
                <textarea id="notepad-content" placeholder="Start typing..." style="flex: 1; background: #1e1e1e; color: white; border: none; padding: 16px; font-family: 'Courier New', monospace; resize: none; outline: none;"></textarea>
            </div>
            <script>
                setTimeout(() => {
                    const textarea = document.getElementById('notepad-content');
                    const saveBtn = document.getElementById('save-btn');
                    const loadBtn = document.getElementById('load-btn');
                    
                    saveBtn.addEventListener('click', () => {
                        const content = textarea.value;
                        const filename = prompt('Enter filename:') || 'untitled.txt';
                        // Save to virtual filesystem
                        ctors.write({ name: filename, content: content });
                        alert('File saved to virtual filesystem!');
                    });
                    
                    loadBtn.addEventListener('click', () => {
                        const filename = prompt('Enter filename to load:');
                        if (filename) {
                            // This would load from virtual filesystem
                            // For now, just show a placeholder
                            textarea.value = 'Loading from virtual filesystem...\\n' + filename;
                        }
                    });
                }, 100);
            </script>
        `;
    }

    createTerminalUI() {
        return `
            <div style="height: 100%; background: #000; color: #0f0; font-family: 'Courier New', monospace; padding: 16px; overflow-y: auto;">
                <div id="terminal-output" style="white-space: pre-wrap; margin-bottom: 16px;">MasegoOS Terminal v1.0
Type 'help' for available commands.

</div>
                <div style="display: flex; align-items: center;">
                    <span style="color: #0f0;">$ </span>
                    <input id="terminal-input" type="text" style="flex: 1; background: transparent; border: none; color: #0f0; font-family: inherit; outline: none;" placeholder="Enter command...">
                </div>
            </div>
            <script>
                setTimeout(() => {
                    const input = document.getElementById('terminal-input');
                    const output = document.getElementById('terminal-output');
                    
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            const command = input.value.trim();
                            output.textContent += '$ ' + command + '\\n';
                            
                            // Execute command through your existing terminal system
                            try {
                                // This would integrate with your existing terminal.js
                                output.textContent += 'Command executed: ' + command + '\\n\\n';
                            } catch (error) {
                                output.textContent += 'Error: ' + error.message + '\\n\\n';
                            }
                            
                            input.value = '';
                            output.scrollTop = output.scrollHeight;
                        }
                    });
                    
                    input.focus();
                }, 100);
            </script>
        `;
    }

    createFileManagerUI() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #333; padding: 8px; border-bottom: 1px solid #555; display: flex; align-items: center; gap: 8px;">
                    <button id="back-btn" style="background: #555; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">←</button>
                    <span id="current-path" style="flex: 1; color: #ccc;">/</span>
                    <button id="refresh-btn" style="background: #0078d4; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Refresh</button>
                </div>
                <div id="file-list" style="flex: 1; padding: 16px; overflow-y: auto;">
                    <div class="file-item" style="padding: 8px; margin: 4px 0; background: #333; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
                        📁 <span style="margin-left: 8px;">documents</span>
                    </div>
                    <div class="file-item" style="padding: 8px; margin: 4px 0; background: #333; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
                        📄 <span style="margin-left: 8px;">readme.txt</span>
                    </div>
                    <div class="file-item" style="padding: 8px; margin: 4px 0; background: #333; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
                        📄 <span style="margin-left: 8px;">notes.txt</span>
                    </div>
                </div>
            </div>
        `;
    }

    createProcessMonitorUI() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #333; padding: 8px; border-bottom: 1px solid #555;">
                    <h3 style="margin: 0; color: white;">Process Monitor</h3>
                </div>
                <div style="flex: 1; padding: 16px; overflow-y: auto;">
                    <table style="width: 100%; color: white; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #444;">
                                <th style="padding: 8px; text-align: left; border: 1px solid #555;">PID</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #555;">State</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #555;">IP</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #555;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="process-table-body">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #555;">1</td>
                                <td style="padding: 8px; border: 1px solid #555;">running</td>
                                <td style="padding: 8px; border: 1px solid #555;">5</td>
                                <td style="padding: 8px; border: 1px solid #555;">
                                    <button style="background: #ff4757; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer;">Kill</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

// Initialize the application manager when the page loads
let appManager;
document.addEventListener('DOMContentLoaded', () => {
    appManager = new ApplicationManager();
    console.log('🖥️ Application Manager initialized');
});

// Export for use in other modules
export { appManager };
