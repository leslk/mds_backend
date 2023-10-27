const StoredImage = require('./storedImage');

class StableImage {

    static async generateImage(prompt, id, type) {
        try {
            const formData = new FormData();
            formData.append("prompt", prompt);
            fetch('https://clipdrop-api.co/text-to-image/v1',
            {
                method: "POST",
                headers: {
                    "x-api-key": process.env.STABLE_API_KEY,
                },
                body: formData
            }).then(response => {
                return response.arrayBuffer();
            }).then(data => {
                const arrayBuffer = new StoredImage(data);
                arrayBuffer.storeImage(data, id, type);
                
            }).catch(err => {
                throw err;
            }); 
        } catch (err) {
            throw err;
        }
    }
}

module.exports = StableImage;