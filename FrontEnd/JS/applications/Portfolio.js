export function initPortfolio(windowManager) {
    const win = windowManager.createWindow({
        title: "Portfolio",
        width: 800,
        height: 600,
        resizable: true,
        icon: "📄",
    });

    const container = document.createElement("div");
    container.classList.add("portfolio-container");
    container.innerHTML = `
        <style>
            .portfolio-container {
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #fff;
                overflow-y: auto;
                padding: 0.5rem;
                background: #1e1e1e;
            }
            .portfolio-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 2px solid #444;
                padding-bottom: 10px;
            }
            
            .tab-btn {
                background: #333;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                color: #fff;
                border-radius: 5px;
                transition: background 0.3s, transform 0.2s;
            }
            .tab-btn:hover {
                background: #555;
                transform: translateY(-2px);
            }
            .tab-btn.active {
                background: #0078d4;
                transform: translateY(0);
            }
            .tab-content {
                display: none;
                animation: fadeIn 0.5s ease-in-out;
            }
            .tab-content.active {
                display: block;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            h1, h2, h3 {
                color: #0078d4;
                margin-bottom: 10px;
            }
            p, li {
                line-height: 1.6;
                margin-bottom: 10px;
            }
            a {
                color: #4ecdc4;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            .career-table, .swot-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .career-table th, .career-table td, .swot-table th, .swot-table td {
                border: 1px solid #444;
                padding: 10px;
                text-align: left;
            }
            .career-table th, .swot-table th {
                background: #333;
                color: #fff;
            }
            .contact-form {
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
                margin-top: 20px;
            }
            .contact-form input, .contact-form textarea {
                background: #333;
                border: 1px solid #555;
                padding: 10px;
                color: #fff;
                border-radius: 5px;
            }
            .contact-form button {
                background: #0078d4;
                border: none;
                padding: 10px;
                color: #fff;
                cursor: pointer;
                border-radius: 5px;
            }
            .contact-form button:hover {
                background: #005ba1;
            }
        </style>
        <div class="portfolio-tabs">
            <button class="tab-btn active" data-tab="cv">📄 CV</button>
            <button class="tab-btn" data-tab="ladder">📈 Career Ladder</button>
            <button class="tab-btn" data-tab="qa">🎤 Interview Q&A</button>
            <button class="tab-btn" data-tab="projects">💻 Projects</button>
            <button class="tab-btn" data-tab="swot">🔍 SWOT Analysis</button>
        </div>
        <div class="portfolio-content">
            <div class="tab-content active" id="cv">
                <h1>MASEGO MASHIANE</h1>
                <p>📧 <a href="mailto:mashianemlb@gmail.com">mashianemlb@gmail.com</a> | 📞 074 317 8281 | 📍 Atteridgeville, Pretoria, 0008</p>
                <p>GitHub: <a href="https://github.com/MasegoMashiane" target="_blank">github.com/MasegoMashiane</a></p>
                <p><a href="#" class="download-cv">Download CV (PDF)</a></p>
                <h2>Profile Summary</h2>
                <p>Analytical and versatile professional with a unique blend of psychology, full-stack development, systems support, and artistic talent. My education includes a Systems Support Learnership (NQF 5, Windows Server 2016) and FNB Full-Stack App of the Year Bootcamp (2025). I excel in applying problem-solving skills from a cross-disciplinary background, committed to high ethical standards informed by Thomistic ethics. Proficient in Python, JavaScript, SQL, HTML/CSS, Django, and MongoDB, I have developed a JavaScript-based OS emulator showcasing modular app loading and system simulation. My psychology background enhances my ability to design user-centered, evidence-based solutions, balancing technical performance with usability and aesthetics.</p>
                <h2>Education</h2>
                <ul>
                    <li>Systems Support Learnership - Netwxs Development Enterprise (2025, Ongoing)</li>
                    <li>Full-Stack Web Development - FNB App of the Year Bootcamp (2025, Complete)</li>
                    <li>Bachelor’s in Social Science (Psychology, 3rd Year) - University of Cape Town (2019–2021, Incomplete)</li>
                    <li>Matriculation with Bachelor’s Pass - Phelindaba Secondary School (2018, 6th in Top 10)</li>
                </ul>
                <h2>Technical Skills</h2>
                <ul>
                    <li><strong>Programming & Development</strong>: Python (OOP, file handling), JavaScript (ES6, DOM manipulation), HTML/CSS (responsive design, flexbox, grid), SQL, Django (CRUD apps), MongoDB (queries, indexing), Git/GitHub</li>
                    <li><strong>System Administration</strong>: Windows Server 2016, Hyper-V, VirtualBox, network configuration, virtualization</li>
                    <li><strong>UI/UX Design</strong>: Figma (wireframing), usability principles</li>
                    <li><strong>Data Analysis</strong>: Descriptive/inferential statistics, research methodologies</li>
                    <li><strong>Productivity Tools</strong>: Microsoft Office (Excel, Word, Outlook)</li>
                </ul>
                <h2>Soft Skills</h2>
                <ul>
                    <li>Communication (English, Sepedi), teamwork, problem-solving, professionalism, time management, adaptability</li>
                </ul>
                <h2>Achievements</h2>
                <ul>
                    <li>1st Place, National Sustainable Energy Prototype Competition, UKZN (2018)</li>
                    <li>Ranked 6th in Top 10 Matriculants, Phelindaba Secondary School (2018)</li>
                </ul>
                <h2>Leadership Experience</h2>
                <ul>
                    <li>Class Representative & Learners’ Representative Committee Member (2017)</li>
                </ul>
                <h2>Interests</h2>
                <ul>
                    <li>Commissioned artwork, chess, tutoring mathematics and financial accounting, programming projects</li>
                </ul>
            </div>
            <div class="tab-content" id="ladder">
                <h2>Practical Entry-Level Tech Career Ladder</h2>
                <table class="career-table">
                    <tr><th>Job Title</th><th>Salary (ZAR)</th><th>Experience</th><th>Qualifications</th><th>Skills</th></tr>
                    <tr><td>Junior Web Developer</td><td>R180k - R280k</td><td>0–2 yrs</td><td>Portfolio (3-5 projects), FreeCodeCamp Certifications</td><td>HTML, CSS, JavaScript, Git, Basic React/Vue</td></tr>
                    <tr><td>Software Developer</td><td>R280k - R450k</td><td>1–4 yrs</td><td>CompTIA ITF+, Oracle OCA</td><td>2+ languages, SQL, frameworks, system design</td></tr>
                    <tr><td>Frontend Developer</td><td>R300k - R480k</td><td>1–3 yrs</td><td>Meta React Certificate, Advanced CSS Certifications</td><td>React/Vue, Tailwind, UX/UI principles</td></tr>
                    <tr><td>Backend Developer</td><td>R320k - R500k</td><td>2–4 yrs</td><td>AWS/Azure Developer Certifications, MongoDB Certified</td><td>Python/Node.js, APIs, database design, cloud basics</td></tr>
                    <tr><td>Full-Stack Developer</td><td>R350k - R520k</td><td>2–5 yrs</td><td>Meta/IBM Full-Stack Certificates, AWS Certifications</td><td>Frontend + Backend, DevOps, microservices</td></tr>
                    <tr><td>Senior Software Developer</td><td>R450k - R650k</td><td>5–8 yrs</td><td>PMP, AWS Advanced Certifications</td><td>System architecture, mentoring, advanced problem-solving</td></tr>
                </table>
            </div>
            <div class="tab-content" id="qa">
                <h2>Interview Q&A</h2>
                <h3>Q: Tell us about yourself.</h3>
                <p>A: I am a versatile problem-solver who started in psychology, gained some IT skills in systems support, and advanced into full-stack software development. My unique strength is bridging technical problem-solving with user-centered design, creating solutions that are both functional and intuitive.</p>
                <h3>Q: What are your biggest strengths?</h3>
                <p>A: My greatest strengths are intellectual curiosity, cross-disciplinary problem-solving, and an ethical approach to development. For example, my JavaScript-based OS emulator project demonstrates my ability to integrate technical skills with user-centered design principles from psychology, creating intuitive interfaces. My persistence in mastering complex topics, like system administration and web development, allows me to tackle challenges systematically, while my commitment to Thomistic ethics ensures I prioritize user trust and integrity in every project.</p>
                <h3>Q: Where do you see yourself starting in tech?</h3>
                <p>A: My first realistic entry point is a Junior Web Developer role, where I can leverage my portfolio projects and certifications. I’ve already built this OS emulator as my first portfolio project, and I’m focused on polishing 3–5 projects that showcase HTML, CSS, and JavaScript skills.</p>
                <h3>Q: What is your biggest weakness?</h3>
                <p>A: My broad interests sometimes lead to overextension, causing me to juggle multiple projects. I’m addressing this by using structured time management techniques, such as the Pomodoro method and task prioritization, to focus on high-impact tasks and deliver results more efficiently.</p>
                <h3>Q: Where do you see yourself in 5 years?</h3>
                <p>A: In five years, I envision myself as a lead full-stack developer, specializing in educational technology to create platforms that enhance learning through psychology-informed design. I aim to mentor junior developers, contribute to system architecture, and advocate for ethical software practices, building on projects like the CBT app I am still planning to build, integrating cognitive behavioral theory with accessible technology.</p>
                <h3>Q: How do you handle a challenging technical problem?</h3>
                <p>A: I approach challenging technical problems with a structured, analytical mindset. For instance, while developing the OS emulator’s process handling system, I encountered issues with memory simulation. I broke the problem into smaller parts, researched JavaScript’s memory management, tested solutions iteratively, and used debugging tools to identify bottlenecks. My psychology background also helps me consider user impact, ensuring solutions are both technically sound and intuitive. This methodical approach, combined with persistence, ensures I resolve issues effectively.</p>
                <h3>Q: How do you stay updated with new technologies?</h3>
                <p>A: I stay updated by combining structured learning with practical application. I follow platforms like GitHub and FreeCodeCamp for emerging trends, and complete courses. I also build projects to experiment with new tools like ES6 features or Django. This hands-on approach, driven by my intellectual curiosity, ensures I keep pace with the fast-evolving tech landscape.</p>
                <h3>Q: How do you handle learning new technologies?</h3>
                <p>A: I break down concepts using the 80/20 principle: focus first on the fundamentals that drive most of the outcomes, then iterate with project-based learning.</p>
                <h3>Q: Why should we hire you at entry-level?</h3>
                <p>A:I bring a rare mix of technical foundation, cross-disciplinary problem-solving, and ethical reasoning. While I’m entry-level, I’m strategic about growth: I’ve mapped a clear trajectory from junior web development to full-stack expertise, and I’m committed to building solutions that are not only functional but also ethical and human-centered.</p>
                
                <h3>Q: How do you prioritize tasks when working on multiple projects?</h3>
                <p>A: To manage multiple projects, I use a prioritization framework based on impact and deadlines. I assess tasks by their contribution to project goals and urgency, I focus on high-priority items. This approach mitigates my tendency to overextension, ensuring timely delivery while maintaining quality across projects.</p>
                <h3>Q: How do you approach debugging a complex issue in a web application?</h3>
                <p>A: When debugging a web application, I follow a systematic process. I start by reproducing the issue, then use browser dev tools to inspect network requests and console logs. I isolate the problem to an incorrect query index, verify it for an explain plan, and optimize the query. My psychology background also guides me to consider user-facing impacts, ensuring fixes enhance usability. This structured approach ensures efficient and effective debugging.</p>
                <h3>Q: How would you troubleshoot a network connectivity issue in a Windows Server environment?</h3>
                <p>A: To troubleshoot a network connectivity issue in a Windows Server 2016 environment, I start by verifying the issue’s scope using ping and tracert to test connectivity. For example, during my Systems Support Learnership, I diagnosed a server unable to reach a client device. I checked the server’s network configuration with ipconfig, ensured the correct subnet and gateway settings, and used netstat to monitor active connections. I also inspected firewall rules and tested physical connections. This methodical process, combined with my analytical skills, ensures quick resolution while maintaining system reliability.</p>
                
                <h3>Q: How do you ensure code quality in your development projects?</h3>
                <p>A: To ensure code quality, I follow best practices like writing modular, readable code and using version control with Git/GitHub for collaboration and review. In my OS emulator project, I implemented tests for JavaScript modules and adhered to linting standards with ESLint to catch errors early. Drawing on my FNB Bootcamp training, and leverage certifications like FreeCodeCamp’s JavaScript algorithms to refine my skills.</p>
                <h3>Q: How would you optimize a virtualized environment on Windows Server 2016 for better performance?</h3>
                <p>A: To optimize a virtualized environment on Windows Server 2016, I focus on resource allocation and system configuration. During my Systems Support Learnership, I worked with Hyper-V to manage virtual machines. For example, I adjusted CPU and memory allocation to prevent overprovisioning, used dynamic memory for efficient resource use, and configured storage with VHDX files for better performance. I also ensured proper network settings, like enabling virtual switches for efficient communication, and monitored performance with tools like Performance Monitor. This approach, rooted in my analytical skills, maximizes system efficiency and reliability.</p>
                </div>
            <div class="tab-content" id="projects">
                <h2>Projects</h2>
                <h3>JavaScript OS Emulator</h3>
                <p>A modular operating system emulator built with JavaScript, featuring app loading, memory simulation, GUI terminal, and process handling. Demonstrates proficiency in JavaScript, DOM manipulation, and system design.</p>
                <p><a href="https://github.com/MasegoMashiane/os-emulator" target="_blank">View on GitHub</a></p>
                <h3>Cognitive Behavioral Therapy App (In Progress)</h3>
                <p>A web application integrating cognitive behavioral theory with ethical software development, aimed at mental health support. Built with Django, JavaScript, and MongoDB.</p>
                <p><a href="https://github.com/MasegoMashiane/cbt-app" target="_blank">View on GitHub</a></p>
            </div>
            <div class="tab-content" id="swot">
                <h2>SWOT Analysis</h2>
                <table class="swot-table">
                    <tr><th>Category</th><th>Description</th></tr>
                    <tr><td>Strengths</td><td>Intellectual curiosity, persistence, strategic thinking, ethical compass, analytical skills across psychology, programming, and ethics.</td></tr>
                    <tr><td>Weaknesses</td><td>Overextension, perfectionism, delayed execution, impatience with simplicity, limited networking.</td></tr>
                    <tr><td>Opportunities</td><td>Cross-disciplinary innovation in fintech/edtech, thought leadership in ethical tech, networking, portfolio projects.</td></tr>
                    <tr><td>Threats</td><td>Information overload, competitive tech landscape, burnout risk, technological obsolescence, economic pressures.</td></tr>
                </table>
                <h2>Contact Me</h2>
                <div class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" rows="5" required></textarea>
                    <button type="submit">Send Message</button>
                </div>
            </div>
        </div>
    `;

    const buttons = container.querySelectorAll(".tab-btn");
    const tabs = container.querySelectorAll(".tab-content");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            tabs.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            const tabId = btn.dataset.tab;
            container.querySelector(`#${tabId}`).classList.add("active");
        });
    });

    container.querySelector(".download-cv").addEventListener("click", (e) => {
        e.preventDefault();
        alert("CV download functionality to be implemented.");
    });

    container.querySelector(".contact-form button").addEventListener("click", () => {
        alert("Message sent! (Note: This is a placeholder; actual functionality requires backend integration.)");
    });

    win.content.appendChild(container);
}