import { getDir } from "../filesystem.js";  // Import your existing filesystem functions
import { filesystemOps } from "../filesystem.js";
// Your existing ThumbnailGenerator class here...
export class ThumbnailGenerator {
    constructor() {
        this.cache = new Map();
        this.thumbnailSize = { width: 128, height: 128 };
    }

    async generateThumbnail(file, maxWidth = 128, maxHeight = 128) {
        // Check cache first
        const cacheKey = `${file.name}-${file.lastModified}-${maxWidth}x${maxHeight}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                // Calculate dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }

                // Draw the thumbnail
                canvas.width = width;
                canvas.height = height;
                ctx.imageSmoothingEnabled = true;
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to data URL and cache
                const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
                this.cache.set(cacheKey, thumbnailUrl);
                resolve(thumbnailUrl);
            };

            // Handle image loading errors
            img.onerror = () => {
                resolve(null); // Return null for unsupported files
            };

            // Start loading the image
            if (file instanceof File || file instanceof Blob) {
                img.src = URL.createObjectURL(file);
            } else if (typeof file === 'string') {
                img.src = file;
            }
        });
    }

    // Clear the thumbnail cache
    clearCache() {
        this.cache.clear();
    }
}



export class FileManager {
    constructor(container) {
        this.container = container;
        this.thumbnailGenerator = new ThumbnailGenerator();
        this.currentPath = [];
        this.initUI();
    }

    initUI() {
        // Basic file manager UI with grid and list view toggle
        this.container.innerHTML = `
            <div class="file-manager">
                <div class="toolbar">
                    <button class="view-toggle" data-view="grid">Grid</button>
                    <button class="view-toggle" data-view="list">List</button>
                    <input type="text" class="search" placeholder="Search files...">
                </div>
                <div class="file-grid"></div>
                <div class="file-preview" style="display: none;">
                    <img class="preview-image">
                    <div class="preview-meta"></div>
                </div>
            </div>
        `;

        this.fileGrid = this.container.querySelector('.file-grid');
        this.previewContainer = this.container.querySelector('.file-preview');
        this.previewImage = this.container.querySelector('.preview-image');
        this.previewMeta = this.container.querySelector('.preview-meta');

        // Event listeners
        this.container.querySelectorAll('.view-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.toggleView(btn.dataset.view));
        });
        
        this.container.querySelector('.search').addEventListener('input', (e) => {
            this.filterFiles(e.target.value);
        });
    }

    async renderFiles(files) {
        this.fileGrid.innerHTML = '';
        
        for (const file of files) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.name = file.name;
            fileItem.draggable = true;

            // Generate thumbnail for images
            if (this.isImageFile(file)) {
                try{
                const thumbnail = await this.thumbnailGenerator.generateThumbnail({
                    name: file.name,
                    lastModified: Date.now()
                });
                fileItem.innerHTML = `
                    <div class="file-thumbnail" style="background-image: url('${thumbnail}')"></div>
                    <div class="file-name">${file.name}</div>
                `;
            } catch(e){
                console.error('Error generating thumbnail:', e);
                fileItem.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-name">${file.name}</div>
                `;
            }
        
        }
            
            
            else {
                fileItem.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-name">${file.name}</div>
                `;
            }

            // Add event listeners
            fileItem.addEventListener('click', () => this.handleFileClick(file));
            fileItem.addEventListener('dblclick', () => this.handleFileOpen(file));
            fileItem.addEventListener('dragstart', (e) => this.handleDragStart(e, file));
            
            this.fileGrid.appendChild(fileItem);
        }
    }

    isImageFile(file) {
        return /\.(jpe?g|png|gif|webp|bmp)$/i.test(file.name);
    }

    showPreview(file) {
        if (!this.isImageFile(file)) {
            this.previewContainer.style.display = 'none';
            return;
        }

        this.previewContainer.style.display = 'block';
        this.previewImage.src = URL.createObjectURL(file);
        
        // Show image metadata
        const img = new Image();
        img.onload = () => {
            this.previewMeta.innerHTML = `
                <p>Name: ${file.name}</p>
                <p>Dimensions: ${img.width} × ${img.height} px</p>
                <p>Size: ${this.formatFileSize(file.size)}</p>
                <p>Type: ${file.type}</p>
            `;
        };
        img.src = URL.createObjectURL(file);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    // Add these methods inside the FileManager class
async loadFiles() {
    try {
        const dir = getDir(); // Get current directory from filesystem
        const files = Object.entries(dir).map(([name, content]) => ({
            name,
            content,
            isDirectory: typeof content === 'object',
            // Add other necessary file properties
        }));
        await this.renderFiles(files);
    } catch (error) {
        console.error('Error loading files:', error);
    }
}

handleFileClick(file) {
    if (this.isImageFile(file)) {
        this.showPreview(file);
    }
}

handleFileOpen(file) {
    if (file.isDirectory) {
        // Handle directory navigation
        filesystemOps.cd(file.name);
        this.loadFiles();
    } else {
        // Handle file opening
        console.log('Opening file:', file.name);
    }
}
}