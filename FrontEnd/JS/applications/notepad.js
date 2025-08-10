import { cpu, ctors } from "../CPU.js"
import { getDir } from "../filesystem.js"; // or from filesystemOps

export class Notepad {
    constructor(textarea) {
        this.textarea = textarea;
    }

    saveFile(filename) {
        const dir = getDir();
        if (dir[filename] && !confirm(`File "${filename}" exists. Overwrite?`)) return false;
        dir[filename] = this.textarea.value;
        alert(`✅ File "${filename}" saved successfully.`);
        return true;
    }

    loadFile(filename) {
        const dir = getDir();
        if (!(filename in dir)) {
            alert(`❌ File "${filename}" not found.`);
            return false;
        }
        this.textarea.value = dir[filename];
        return true;
    }

    newFile() {
        if (this.textarea.value.trim() && !confirm('Discard current content?')) return false;
        this.textarea.value = '';
        return true;
    }

    deleteFile(filename) {
        const dir = getDir();
        if (!(filename in dir)) {
            alert(`❌ File "${filename}" not found.`);
            return false;
        }
        if (confirm(`Are you sure you want to delete "${filename}"?`)) {
            delete dir[filename];
            alert(`🗑️ File "${filename}" deleted.`);
            return true;
        }
        return false;
    }
}