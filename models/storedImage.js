const fs = require('fs');

class StoredImage {
    constructor(arrayBuffer) {
        this.arrayBuffer = arrayBuffer;
    }

    async storeImage(data, imageUrl, type) {
        const imagesDir = "./images";
        const formattedType = type.toLowerCase();
        const folderPath = `${imagesDir}/${formattedType}`;
        const url = new URL(imageUrl);
        const fileName = url.pathname.split('/').pop();
        try {
            const filePath = `${folderPath}/${fileName}`;

            if (!fs.existsSync(imagesDir)) {
                try {
                    fs.mkdirSync(imagesDir);
                    console.log(`Folder images created.`);
                } catch (err) {
                    throw {
                        status: 500,
                        message: `Error creating the folder: images, ${err}`,
                    }
                }
            } 
            if (!fs.existsSync(folderPath)) {
                try {
                    fs.mkdirSync(folderPath);
                    console.log(`Folder ${formattedType} created.`);
                } catch (err) {
                    throw {
                        status: 500,
                        message: `Error creating the folder: ${formattedType}, ${err}`,
                    };
                }
            }
    
            const fileContent = new DataView(data);
            fs.writeFileSync(filePath, fileContent, data, (err) => {
                if (err) {
                    throw {
                        status: 500,
                        message: `Error writing the file: ${err}`
                    };
                }
                console.log(`File "${fileName}" has been written to "${folderPath}".`);
            });
        } catch (err) {
            throw err;
        }
    }

    static async deleteImage(imageUrl, type) {
        const formattedType = type.toLowerCase();
        const url = new URL(imageUrl);
        const fileName = url.pathname.split('/').pop();
        const folderPath = `./images/${formattedType}`;
        const filePath = `${folderPath}/${fileName}`;
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`File "${fileName}" has been deleted.`);
            } else {
                console.log(`File "${fileName}" not found.`);
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = StoredImage;