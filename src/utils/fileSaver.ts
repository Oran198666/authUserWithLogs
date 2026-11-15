import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { UploadedFile } from "express-fileupload";

class FileSaver {

    // Where all images live on disk.
    private readonly imagesFolder = path.join(__dirname, "..", "assets", "images");

    // Save a new image, return the generated filename to store in the DB.
    public async add(file: UploadedFile): Promise<string> {
        const extension = path.extname(file.name);        // ".jpg"
        const imageName = uuid() + extension;             // "a3f2...-b1c4.jpg"
        const fullPath = path.join(this.imagesFolder, imageName);
        await file.mv(fullPath);                          // moves the temp file into place
        return imageName;
    }

    // Replace an existing image: delete the old one, save the new one.
    public async update(file: UploadedFile, oldImageName: string): Promise<string> {
        if (oldImageName) await this.delete(oldImageName);
        return await this.add(file);
    }

    // Remove an image from disk. Silent if it's already gone.
    public async delete(imageName: string): Promise<void> {
        if (!imageName) return;
        const fullPath = path.join(this.imagesFolder, imageName);
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
    }

    // Absolute path for response.sendFile().
    public getImagePath(imageName: string): string {
        return path.join(this.imagesFolder, imageName);
    }
}

export const fileSaver = new FileSaver();