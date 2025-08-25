import { getDir, filesystemOps } from "../filesystem.js";

/**
 * Initialize Gallery inside the provided container.
 * @param {HTMLElement} container - The .gallery-container element from appManager.
 */
export function initGallery(container) {
    if (!container) return;

    // Inject gallery styles once
    if (!document.getElementById("gallery-styles")) {
        const style = document.createElement("style");
        style.id = "gallery-styles";
        style.textContent = `
            .gallery-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: #111;
                color: #fff;
                overflow: hidden;
                font-family: 'Segoe UI', Tahoma, sans-serif;
            }
            .gallery-toolbar {
                background: #333;
                padding: 6px;
                border-bottom: 1px solid #555;
                display: flex;
                gap: 8px;
            }
            .gallery-toolbar button {
                background: #0078d4;
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
            }
            .gallery-toolbar button.delete-btn {
                background: #d9534f;
            }
            .gallery-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 12px;
                padding: 16px;
                overflow-y: auto;
                flex: 1;
            }
            .gallery-item {
                background: #1e1e1e;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                cursor: pointer;
                transition: transform 0.2s;
                text-align: center;
            }
            .gallery-item:hover {
                transform: scale(1.05);
            }
            .gallery-item img {
                width: 100%;
                height: 120px;
                object-fit: cover;
                display: block;
            }
            .gallery-item p {
                margin: 8px 0;
                font-size: 14px;
                color: #ccc;
            }
            .gallery-empty {
                padding: 20px;
                text-align: center;
                color: #aaa;
            }
            .gallery-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                z-index: 9999;
            }
            .gallery-lightbox.hidden {
                display: none;
            }
            .gallery-lightbox img.lightbox-img {
                max-width: 80%;
                max-height: 80%;
                border-radius: 8px;
                margin-bottom: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            }
            .gallery-lightbox .caption {
                color: #fff;
                font-size: 16px;
                margin-top: 4px;
            }
            .gallery-lightbox .close {
                position: absolute;
                top: 20px;
                right: 30px;
                font-size: 32px;
                color: #fff;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    // Toolbar + content wrapper
    container.innerHTML = `
        <div class="gallery-toolbar">
            <button class="add-btn">Add Image</button>
            <button class="delete-btn">Delete Image</button>
            <button class="refresh-btn">Refresh</button>
        </div>
        <div class="gallery-content"></div>
    `;

    const content = container.querySelector(".gallery-content");

    function renderGallery() {
        content.innerHTML = "";
        const root = getDir();
        const picturesFolder = root["Pictures"];
        if (!picturesFolder || typeof picturesFolder !== "object") {
            content.innerHTML = `<p class="gallery-empty">No 'Pictures' folder found.</p>`;
            return;
        }

        const images = Object.entries(picturesFolder)
            .filter(([name, value]) => name.match(/\.(jpg|jpeg|png|gif)$/i) && typeof value === "string")
            .map(([name, value]) => ({ src: value, caption: name }));

        content.innerHTML = `
            <div class="gallery-grid">
                ${
                    images.length > 0
                        ? images
                            .map(
                                (img, i) => `
                    <div class="gallery-item" data-name="${img.caption}" data-index="${i}">
                        <img src="${img.src}" alt="${img.caption}">
                        <p>${img.caption}</p>
                    </div>
                `
                            )
                            .join("")
                        : `<p class="gallery-empty">No images found in Pictures folder.</p>`
                }
            </div>

            <div class="gallery-lightbox hidden">
                <span class="close">&times;</span>
                <img class="lightbox-img" src="" alt="">
                <div class="caption"></div>
            </div>
        `;

        // Lightbox functionality
        const lightbox = content.querySelector(".gallery-lightbox");
        const lightboxImg = content.querySelector(".lightbox-img");
        const caption = content.querySelector(".caption");
        const closeBtn = content.querySelector(".close");

        content.querySelectorAll(".gallery-item").forEach((item) => {
            item.addEventListener("click", () => {
                const src = item.querySelector("img").src;
                const name = item.dataset.name;
                lightboxImg.src = src;
                caption.textContent = name;
                lightbox.classList.remove("hidden");
            });
        });

        closeBtn.addEventListener("click", () => {
            lightbox.classList.add("hidden");
        });
    }

    // Toolbar event listeners
    container.querySelector(".add-btn").addEventListener("click", () => {
        const filename = prompt("Enter image filename (with extension):", "newimage.png");
        if (!filename) return;
        const url = prompt("Enter image URL or Base64 string:");
        if (!url) return;

        try {
            const dir = getDir()["Pictures"];
            if (!dir || typeof dir !== "object") {
                alert("Pictures folder does not exist.");
                return;
            }
            if (dir[filename]) {
                alert("❌ File already exists.");
                return;
            }
            dir[filename] = url;
            renderGallery();
        } catch (e) {
            alert("Error adding image: " + e.message);
        }
    });

    container.querySelector(".delete-btn").addEventListener("click", () => {
        const filename = prompt("Enter image filename to delete:");
        if (!filename) return;

        try {
            const dir = getDir()["Pictures"];
            if (!dir || typeof dir !== "object") {
                alert("Pictures folder does not exist.");
                return;
            }
            if (!dir[filename]) {
                alert("❌ No such image.");
                return;
            }
            delete dir[filename];
            renderGallery();
        } catch (e) {
            alert("Error deleting image: " + e.message);
        }
    });

    container.querySelector(".refresh-btn").addEventListener("click", renderGallery);

    // Initial render
    renderGallery();
}