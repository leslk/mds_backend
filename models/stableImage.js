const StoredImage = require('./storedImage');
const ImageHandler = require('./imageHandler');

class StableImage {
    constructor() {
        this.observers = [];
        this.image = null;
    }


    attach(observer) {
    this.observers.push(observer);
    }

    notify(className, objectId, protagonist, universe) {
        this.observers.forEach(observer => {
            observer.update(className, objectId, protagonist, universe);
        });
    }

    handleImage(image) {
        this.image = image;
        this.notify();
    }

    async generateImage(prompt, objectId, instance, id, type) {
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
            }).then(async (response) => {
                const imageHandler = new ImageHandler(response);
                this.attach(imageHandler);
                this.notify(objectId, instance);
                if (response.status === 200) {
                    const data = await response.arrayBuffer();
                    const arrayBuffer = new StoredImage(data);
                    arrayBuffer.storeImage(data, id, type); 
                }
            }).catch(err => {
                throw err;
            }); 
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new StableImage();