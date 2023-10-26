const StoredImage = require('./storedImage');

class StableImage {

    static async generateImage(prompt, name, type) {
        try {
            const formData = new FormData();
            formData.append("prompt", prompt);
            const response = await fetch('https://clipdrop-api.co/text-to-image/v1',
            {
                method: "POST",
                headers: {
                    "x-api-key": process.env.STABLE_API_KEY,
                },
                body: formData
            });
            const data = await response.arrayBuffer();
            const arrayBuffer = new StoredImage(data);
            const imageUrl = await arrayBuffer.storeImage(data, name, type);  
            return imageUrl;     
        } catch (err) {
            throw err;
        }
    }
}

module.exports = StableImage;