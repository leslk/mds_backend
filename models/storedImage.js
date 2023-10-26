const fs = require('fs');

class StoredImage {
    constructor(arrayBuffer) {
        this.arrayBuffer = arrayBuffer;
    }

    async storeImage(data, name, type) {
        const formattedType = type.toLowerCase();
        const formattedName = `${name.split(" ").join("_")}.png`;
        try {
            const folderPath = `./images/${formattedType}`;
            const fileName = `${formattedType}_${formattedName}`;
            const filePath = `${folderPath}/${fileName}`;
            const imagesDir = "./images";

            if (!fs.existsSync(imagesDir)) {
                try {
                    fs.mkdirSync(imagesDir);
                    console.log(`Folder images created.`);
                } catch (err) {
                    throw `Error creating the folder: images`, err;
                }
            } 
            if (!fs.existsSync(folderPath)) {
                try {
                    fs.mkdirSync(folderPath);
                    console.log(`Folder ${formattedType} created.`);
                } catch (err) {
                    throw `Error creating the folder: ${formattedType}`, err;
                }
            }
    
            const fileContent = new DataView(data);
            fs.writeFileSync(filePath, fileContent, data, (err) => {
                if (err) {
                    console.error('Error writing the file:', err);
                }
                console.log(`File "${filename}" has been written to "${folderPath}".`);
            });
            const imageUrl = `${process.env.HOST}/images/${formattedType}/${fileName}`;
            return imageUrl;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = StoredImage;