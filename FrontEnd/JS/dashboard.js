import { cpu } from "./CPU.js";
//OS Gui interface(start menu, taskbar, etc)

//Portfolio App Registration for OS
(function() {
    // Portfolio App Icon (SVG as Data URI for demo)
    const icon = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#3B82F6"/>
      <path d="M8 24V10a2 2 0 012-2h12a2 2 0 012 2v14" stroke="#fff" stroke-width="2"/>
      <rect x="12" y="14" width="8" height="2" rx="1" fill="#fff"/>
      <rect x="12" y="18" width="8" height="2" rx="1" fill="#fff"/>
    </svg>`;

    // Portfolio App Content (HTML)
    function getPortfolioHTML() {
        return `
        <div class="portfolio-hero">
            <h1>OS Emulator Portfolio</h1>
            <p class="portfolio-typewriter">A modern, browser-based OS built from scratch.</p>
        </div>
        <nav class="portfolio-nav">
            <button data-section="features">Features</button>
            <button data-section="demo">Live Demo</button>
            <button data-section="tech">Technical</button>
            <button data-section="about">About</button>
        </nav>
        <section class="portfolio-section" id="features">
            <h2>Features</h2>
            <ul>
                <li>CPU & Instruction Set Simulation</li>
                <li>Virtual Memory Management</li>
                <li>File System (mkdir, ls, cd, write, read, rm)</li>
                <li>Process & Thread Management</li>
                <li>Dynamic Windowed Applications</li>
                <li>Terminal, Calculator, Notepad, and more</li>
                <li>Sandboxed, Secure, and Extensible</li>
            </ul>
        </section>
        <section class="portfolio-section" id="demo" style="display:none">
            <h2>Live Demo</h2>
            <button id="launch-terminal">Open Terminal</button>
            <button id="launch-calc">Open Calculator</button>
            <button id="launch-notepad">Open Notepad</button>
            <div class="portfolio-demo-info">Try out real OS features from this window!</div>
        </section>
        <section class="portfolio-section" id="tech" style="display:none">
            <h2>Technical Details</h2>
            <ul>
                <li>Frontend: Vanilla JS, CSS3, HTML5</li>
                <li>Backend: Django (optional, sandboxed)</li>
                <li>Architecture: Modular, extensible, secure</li>
                <li>All operations are virtualized in-browser</li>
            </ul>
        </section>
        <section class="portfolio-section" id="about" style="display:none">
            <h2>About</h2>
            <p>This project was built as a portfolio showcase to demonstrate OS concepts in a browser environment. All code is original and designed for educational and demonstration purposes.</p>
            <p>Contact: <a href="mailto:your@email.com">your@email.com</a></p>
        </section>
        <footer class="portfolio-footer">&copy; 2025 OS Emulator Project</footer>
        `;
    }

    // Portfolio App CSS (scoped to window)
    function injectPortfolioCSS(win) {
        const style = document.createElement('style');
        style.textContent = `
            .portfolio-hero { text-align: center; margin: 1em 0; }
            .portfolio-hero h1 { font-size: 2em; margin-bottom: 0.2em; }
            .portfolio-typewriter { font-family: monospace; color: #3B82F6; animation: blink 1s step-end infinite alternate; }
            @keyframes blink { 50% { opacity: 0.5; } }
            .portfolio-nav { display: flex; justify-content: center; gap: 1em; margin-bottom: 1em; }
            .portfolio-nav button { background: #3B82F6; color: #fff; border: none; padding: 0.5em 1em; border-radius: 4px; cursor: pointer; }
            .portfolio-nav button:hover { background: #2563eb; }
            .portfolio-section { max-width: 600px; margin: 0 auto 1.5em auto; background: #f3f4f6; padding: 1em 2em; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
            .portfolio-section h2 { color: #3B82F6; }
            .portfolio-footer { text-align: center; font-size: 0.9em; color: #888; margin-top: 2em; }
            .portfolio-demo-info { margin-top: 1em; color: #2563eb; font-style: italic; }
        `;
        win.document.head.appendChild(style);
    }

    // App Launch Logic
    function launchPortfolioApp() {
        // Use a global window manager or fallback
        const winMgr = window.windowManager || window.appManager || window;
        if (!winMgr.createWindow) {
            alert('Window manager not found!');
            return;
        }
        const win = winMgr.createWindow({
            title: 'Portfolio',
            icon: icon,
            width: 700,
            height: 600,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true
        });
        win.setContent(getPortfolioHTML());
        injectPortfolioCSS(win.iframe || win);

        // Navigation logic
        const nav = win.el.querySelector('.portfolio-nav');
        const sections = win.el.querySelectorAll('.portfolio-section');
        
        nav.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const section = e.target.getAttribute('data-section');
                sections.forEach(s => s.style.display = (s.id === section) ? '' : 'none');
            }
        });
        
        // Demo buttons
        win.el.querySelector('#launch-terminal').onclick = () => winMgr.launchApp ? winMgr.launchApp('Terminal') : alert('Terminal app not found');
        win.el.querySelector('#launch-calc').onclick = () => winMgr.launchApp ? winMgr.launchApp('Calculator') : alert('Calculator app not found');
        win.el.querySelector('#launch-notepad').onclick = () => winMgr.launchApp ? winMgr.launchApp('Notepad') : alert('Notepad app not found');
    }

    // Register with app/window manager
    if (window.registerApp) {
        window.registerApp({
            name: 'Portfolio',
            icon: icon,
            launch: launchPortfolioApp
        });
    } else if (window.appManager && window.appManager.registerApp) {
        window.appManager.registerApp({
            name: 'Portfolio',
            icon: icon,
            launch: launchPortfolioApp
        });
    } else {
        // Fallback: add to global for manual launch
        window.launchPortfolioApp = launchPortfolioApp;
    }
})();