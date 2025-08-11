import { cpu } from "../CPU.js"
import { getDir } from "../filesystem.js";
import { filesystemOps } from "../filesystem.js"; 
import { Terminal } from "../terminal.js"
import { EnhancedCalculator } from "./calculato.js"
import { Notepad } from "./notepad.js";
import { ProcessMonitor } from "./process manager.js";
import { SnakeGame } from "./snake.js";

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
        // Create desktop container
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
        this.applications.set('snake', {
        name: 'Snake',
        icon: '🐍', 
        width: 450,
        height: 520,
        createContent: () => this.createSnakeUI()
        });


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
                if (window.minimized){
                    this.minimizeWindow(windowId)
                }
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
        const windowEl = document.createElement('div');
        windowEl.className = 'app-window';
        windowEl.id = `window-${windowId}`;
        windowEl.style.width = `${app.width}px`;
        windowEl.style.height = `${app.height}px`;
        windowEl.style.left = `${50 + (windowId * 30)}px`;
        windowEl.style.top = `${50 + (windowId * 30)}px`;
        windowEl.style.zIndex = this.zIndexCounter++;

        console.log(`windowsEl.innerHTML: ${windowEl.innerHTML}
            windowsEl: ${windowEl}`)

        // Create window structure
        windowEl.innerHTML = `
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



    // after rendering windowEl and storing openWindows...
if (appName === 'snake') {
    // Delay to ensure DOM nodes are created/attached
    setTimeout(() => {
        import('./snake.js').then(({ SnakeGame }) => {
            const canvas = windowEl.querySelector('.snake-canvas');
            const startBtn = windowEl.querySelector('.snake-start-btn');
            const pauseBtn = windowEl.querySelector('.snake-pause-btn');
            const resetBtn = windowEl.querySelector('.snake-reset-btn');
            const scoreEl = windowEl.querySelector('.snake-score');

            if (!canvas) {
                console.error('Snake canvas not found in window', windowEl);
                return;
            }

            // Create a wrapper object that holds the game inside the window-content element
            const contentArea = windowEl.querySelector('.window-content') || windowEl; // adapt to your structure
            const gameContainer = document.createElement('div');
            gameContainer.style.width = '100%';
            gameContainer.style.display = 'flex';
            gameContainer.style.justifyContent = 'center';
            // put canvas into container (canvas already in DOM inside createContent; we just use it)
            // instantiate SnakeGame with the element that contains the canvas (the window content)
            const snakeGame = new SnakeGame(contentArea, { width: canvas.width, height: canvas.height, gridSize: 20, fps: 10 });

            // Try to attach the game to existing canvas element instead of building a new one
            // (snakeGame built its own canvas; reuse the existing canvas,
            // modify SnakeGame to accept an existing canvas element.)
            // For simplicity use snakeGame.start/pause on the controls:

            startBtn.addEventListener('click', () => snakeGame.start());
            pauseBtn.addEventListener('click', () => snakeGame.pause());
            resetBtn.addEventListener('click', () => {
                snakeGame.kill();
                // rebuild fresh state
                setTimeout(() => {
                    // create a new instance to reset UI cleanly
                    // remove internal DOM and re-init
                    const newGame = new SnakeGame(contentArea, { width: canvas.width, height: canvas.height, gridSize: 20, fps: 10 });
                    // replace reference
                    windowEl.snakeGameInstance = newGame;
                    newGame.start();
                }, 10);
            });

            // Start auto on open
            snakeGame.start();

            // Save instance for appManager (useful for close/minimize)
            windowEl.snakeGameInstance = snakeGame;

            // Wire minimize/close if you have buttons
            const closeBtn = windowEl.querySelector('.window-control.control-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    try { snakeGame.kill(); } catch (e) {}
                });
            }
            const minimizeBtn = windowEl.querySelector('.window-control.control-minimize');
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => {
                    snakeGame.pause();
                });
            }

            console.log('✅ Snake game initialized');
        }).catch(err => {
            console.error('Failed to load snake module', err);
        });
    }, 0);
}
    

    //Notepad initialization
    if (appName === 'notepad') {
        import('./notepad.js').then(({ Notepad }) => {
            const textarea = windowEl.querySelector('.notepad-content');
            const saveBtn = windowEl.querySelector('.save-btn');
            const loadBtn = windowEl.querySelector('.load-btn');
            const newBtn = windowEl.querySelector('.new-btn');
            const deleteBtn = windowEl.querySelector('.delete-btn');
    
            const notepad = new Notepad(textarea);
    
            saveBtn.addEventListener('click', () => {
                const filename = prompt('Enter filename:', 'untitled.txt');
                if (filename) notepad.saveFile(filename);
            });
    
            loadBtn.addEventListener('click', () => {
                const filename = prompt('Enter filename to load:');
                if (filename) notepad.loadFile(filename);
            });
    
            newBtn.addEventListener('click', () => notepad.newFile());
    
            deleteBtn.addEventListener('click', () => {
                const filename = prompt('Enter filename to delete:');
                if (filename) notepad.deleteFile(filename);
            });
        }).catch(err => {
            console.error('❌ Failed to load Notepad module:', err);
        });
    }   

    // calculator initialization
    if (appName === 'calculator') {

    // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
        const display = windowEl.querySelector('#calc-display');
        const buttons = windowEl.querySelectorAll('.calc-btn');
        
        if (display && buttons.length > 0) {
            // Import and initialize the enhanced calculator
            import('./calculato.js').then(({ EnhancedCalculator }) => {
                const calculator = new EnhancedCalculator(display);
                
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        calculator.handleInput(button.dataset.value);
                    });
                });
                
                // Store calculator instance for potential future use
                windowEl.calculatorInstance = calculator;
                
                console.log('✅ Enhanced Calculator initialized');
            }).catch(error => {
                console.error('Failed to load calculator module:', error);
            });
        } else {
            console.error('Calculator elements not found');
        }
    }, 500);
}


// File Manager initialization
if (appName === 'filemanager') {
    const winData = this.openWindows.get(windowId);
    const winEl = windowEl;

    const fileListEl = winEl.querySelector('.file-list');
    const pathEl = winEl.querySelector('.current-path');
    const backBtn = winEl.querySelector('.back-btn');
    const refreshBtn = winEl.querySelector('.refresh-btn');
    const newFileBtn = winEl.querySelector('.new-file-btn');
    const newFolderBtn = winEl.querySelector('.new-folder-btn');

    const renderDirectory = () => {
        const dir = getDir();
        pathEl.textContent = "/" + cpu.cwd.join("/");
        fileListEl.innerHTML = "";

        Object.entries(dir).forEach(([name, value]) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.dataset.name = name;
            item.dataset.type = typeof value === 'object' ? 'folder' : 'file';
            item.style.cssText = "padding: 8px; margin: 4px 0; background: #333; border-radius: 4px; cursor: pointer; display: flex; align-items: center;";
            item.innerHTML = (typeof value === 'object' ? "📁" : "📄") + `<span style="margin-left: 8px;">${name}</span>`;
            fileListEl.appendChild(item);
        });
    };

    const openFolder = (folderName) => {
        cpu.cwd.push(folderName);
        renderDirectory();
    };

    const goBack = () => {
        if (cpu.cwd.length > 0) {
            cpu.cwd.pop();
            renderDirectory();
        }
    };

    const openTxtFileInNotepad = (fileName) => {
        const notepadWindowId = this.createWindow({
            name: 'Notepad',
            icon: '📝',
            width: 500,
            height: 400,
            createContent: () => this.createNotepadUI()
        }, 'notepad');

        setTimeout(() => {
            import('./notepad.js').then(({ Notepad }) => {
                const win = this.openWindows.get(notepadWindowId);
                if (!win) return;

                const textarea = win.element.querySelector('.notepad-content');
                const saveBtn = win.element.querySelector('.save-btn');
                const loadBtn = win.element.querySelector('.load-btn');
                const newBtn = win.element.querySelector('.new-btn');
                const deleteBtn = win.element.querySelector('.delete-btn');

                const notepad = new Notepad(textarea);
                notepad.loadFile(fileName);

                saveBtn.addEventListener('click', () => {
                    const filename = prompt('Enter filename:', fileName);
                    if (filename) notepad.saveFile(filename);
                });
                loadBtn.addEventListener('click', () => {
                    const filename = prompt('Enter filename to load:', fileName);
                    if (filename) notepad.loadFile(filename);
                });
                newBtn.addEventListener('click', () => notepad.newFile());
                deleteBtn.addEventListener('click', () => {
                    const filename = prompt('Enter filename to delete:', fileName);
                    if (filename) notepad.deleteFile(filename);
                });
            });
        }, 50);
    };

    // Event Listeners
    fileListEl.addEventListener('dblclick', (e) => {
        const item = e.target.closest('.file-item');
        if (!item) return;
        const name = item.dataset.name;
        const type = item.dataset.type;

        if (type === 'folder') {
            openFolder(name);
        } else if (type === 'file' && name.endsWith('.txt')) {
            openTxtFileInNotepad(name);
        }
    });

    backBtn.addEventListener('click', goBack);
    refreshBtn.addEventListener('click', renderDirectory);

    newFileBtn.addEventListener('click', () => {
        const filename = prompt('Enter new file name (with extension):', 'newfile.txt');
        if (!filename) return;
        const dir = getDir();
        if (dir[filename]) {
            alert('❌ A file or folder with that name already exists.');
            return;
        }
        dir[filename] = ""; // empty file
        renderDirectory();
    });

    newFolderBtn.addEventListener('click', () => {
        const folderName = prompt('Enter new folder name:', 'New Folder');
        if (!folderName) return;
        const dir = getDir();
        if (dir[folderName]) {
            alert('❌ A file or folder with that name already exists.');
            return;
        }
        dir[folderName] = {};
        renderDirectory();
    });

    // Initial render
    renderDirectory();
}

//process Manger initialization
if (appName === 'processmonitor') {
    import('./process manager.js').then(({ ProcessMonitor }) => {
        const listContainer = windowEl.querySelector('.process-list');
        const refreshBtn = windowEl.querySelector('.refresh-btn');

        const monitor = new ProcessMonitor(listContainer);
        monitor.refreshList();

        refreshBtn.addEventListener("click", () => monitor.refreshList());
    });
}

//terminal initialization
        if (appName === 'terminal') {
            const output = windowEl.querySelector('.terminal-output');
            const input = windowEl.querySelector('.terminal-input');
            
            if (output && input){
                new Terminal(output, input)    
            }
            else{
                console.error(`terminal elements not found in window`, windowEl)
            }
        }
        // Add event listeners
        this.addWindowEventListeners(windowEl, windowId);

        // Add to desktop
        document.getElementById('desktop').appendChild(windowEl);

        // Track the window
        this.openWindows.set(windowId, {
            element: windowEl,
            appName: appName,
            minimized: false
        });
        if (this.applications.has(appName)){
            this.updateAppIcon(appName, true)
        }else{
            console.warn(`Application ${appName} not registered`)
        }
        
        if(this.applications.has(appName)){
            this.updateAppIcon(appName, true)
        } else{
            console.warn(`Application ${appName} not registered`)
        }
        return windowId;
    }

    addWindowEventListeners(windowEl, windowId) {
        const titlebar = windowEl.querySelector('.window-titlebar');
        const controls = windowEl.querySelector('.window-controls');

        // Window dragging
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            dragOffset.x = e.clientX - windowEl.offsetLeft;
            dragOffset.y = e.clientY - windowEl.offsetTop;
            
            this.focusWindow(windowId);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            windowEl.style.left = `${e.clientX - dragOffset.x}px`;
            windowEl.style.top = `${e.clientY - dragOffset.y}px`;
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
        windowEl.addEventListener('mousedown', () => {
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
            
            if(window.appName && this.applications.has(window.appName)){
                this.updateAppIcon(window.appName, false)
            }else{
                console.warn(`Invalid or missing appName for window ${windowId}`)
            }
            console.log(`🗑️ Closed window ${windowId}`);
        }
    }

    minimizeWindow(windowId) {
        const window = this.openWindows.get(windowId);
        if (window) {
            window.element.style.display = window.minimized ? 'block' : 'none';
            window.minimized = !window.minimized;
            this.updateAppIcon(window.appName, !window.minimized)
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

    updateAppIcon(appName, active){
        
        if (!appName || typeof appName !== 'string') {
            console.warn(`Invalid appName provided to updateAppIcon: ${appName}`);
            return;
        }

        const icon = document.querySelector(`.app-icon[data-app="${appName}]"`)
        if (icon){
            if (active){
                icon.classList.add(`active`)
            }else{
                icon.classList.remove(`active`)
            }
        }
    }

    // Application UI Creators
        createCalculatorUI() {
    return `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 280px;">
            <div id="calc-display" style="grid-column: 1/-1; background: #000; color: #0f0; padding: 16px; text-align: right; font-family: monospace; font-size: 18px; border-radius: 4px; min-height: 40px;">0</div>
            <button class="calc-btn" data-value="C" style="background: #ff6b6b; color: white; border: none; padding: 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">C</button>
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
            <button class="calc-btn" data-value="(" style="background: #4ecdc4; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">(</button>
            <button class="calc-btn" data-value=")" style="background: #4ecdc4; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">)</button>
            <button class="calc-btn" data-value="CPU" style="background: #28a745; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 10px; grid-column: 3/5;">→CPU</button>
        </div>
    `;
}
    
    createNotepadUI() {
        return `
            <div class="notepad-app" style="height: 100%; display: flex; flex-direction: column;">
            <div class="notepad-toolbar" style="background: #333; padding: 8px; border-bottom: 1px solid #555;">
                <button class="save-btn" style="background: #0078d4; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">Save</button>
                <button class="load-btn" style="background: #0078d4; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer;">Load</button>
                <button class="new-btn" style="background: #555; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; margin-left: 8px;">New</button>
                <button class="delete-btn" style="background: #ff4d4d; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; margin-left: 8px;">Delete</button>
            </div>
            <textarea class="notepad-content" placeholder="Start typing..." style="flex: 1; background: #1e1e1e; color: white; border: none; padding: 16px; font-family: 'Courier New', monospace; resize: none; outline: none;"></textarea>
        </div>
        `;
    }

    createTerminalUI() {
        return `
             <div class="terminal-container" style="height: 100%; display: flex; flex-direction: column; background: #000; color: #0f0; font-family: monospace;">
            <div class="terminal-output" style="flex: 1; padding: 8px 8px 0 8px; overflow-y: auto; white-space: pre-wrap;">MasegoOS Terminal v1.0\nType 'help' for available commands.\n</div>
            <div style="display: flex; align-items: center; padding-bottom: 8px;">
                <span style="color: #0f0; padding: 0 8px;">$</span>
                <input class="terminal-input" type="text" style="flex: 1; background: transparent; border: none; color: #0f0; outline: none; font-family: monospace;">
            </div>
        </div>
        `;
    }
    
    createSnakeUI() {
    return `
    <div style="height:100%; display:flex; flex-direction:column; align-items:center; padding:12px; box-sizing:border-box; background:#111;">
        <div style="flex:0 0 auto; display:flex; width:100%; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="color:#fff; font-family: monospace; font-size:14px;">Snake</div>
            <div>
                <button class="snake-start-btn" style="margin-right:8px;">Start</button>
                <button class="snake-pause-btn" style="margin-right:8px;">Pause</button>
                <button class="snake-reset-btn">Reset</button>
            </div>
        </div>
        <div style="flex:1 1 auto; display:flex; align-items:center; justify-content:center; width:100%;">
            <canvas class="snake-canvas" width="400" height="400" style="background:#000; border-radius:6px;"></canvas>
        </div>
        <div style="flex:0 0 auto; margin-top:8px; color:#fff; font-family:monospace;">
            <span class="snake-score">Score: 0</span>
        </div>
    </div>
    `;
    }


    createFileManagerUI() {
        return `
        <div class="file-manager" style="height: 100%; display: flex; flex-direction: column;">
            <div class="fm-toolbar" style="background: #333; padding: 8px; border-bottom: 1px solid #555; display: flex; align-items: center; gap: 8px;">
                <button class="back-btn" style="background: #555; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">←</button>
                <span class="current-path" style="flex: 1; color: #ccc;">/</span>
                <button class="refresh-btn" style="background: #0078d4; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Refresh</button>
                <button class="new-file-btn" style="background: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">New File</button>
                <button class="new-folder-btn" style="background: #9C27B0; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">New Folder</button>
            </div>
            <div class="file-list" style="flex: 1; padding: 16px; overflow-y: auto;">
                <!-- Files/folders will be rendered dynamically -->
            </div>
        </div>
        `
        ;
    }

    createProcessMonitorUI() {
        return `
            <div style="display: flex; flex-direction: column; height: 100%; background: #222; color: #fff; font-family: monospace;">
            <div style="padding: 6px; background: #333; border-bottom: 1px solid #555; display: flex; justify-content: space-between;">
                <span>Process Monitor</span>
                <button class="refresh-btn" style="background: #0078d4; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer;">Refresh</button>
            </div>
            <div class="process-list" style="flex: 1; overflow-y: auto; padding: 8px;"></div>
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


export function initOS() {
    console.log("Initializing OS...");
    ApplicationManager.loadDesktopIcons;
}
// Export for use in other modules
export { appManager };