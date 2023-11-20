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

    async generateImage(prompt, objectId, instance, imageUrl, type) {
        try {
            const formData = new FormData();
            formData.append("prompt", prompt);

            const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
                method: "POST",
                headers: {
                    "x-api-key": process.env.STABLE_API_KEY,
                },
                body: formData
            });

            const imageHandler = new ImageHandler(response);
            this.attach(imageHandler);
            this.notify(objectId, instance);

            if (response.status === 200) {
                const data = await response.arrayBuffer();
                const arrayBuffer = new StoredImage(data);
                arrayBuffer.storeImage(data, imageUrl, type);
            } else {
                    console.log(res.status, `Error while generating Stable Diffusion image`)
            }
        } catch (err) {
            console.log(err.status || 500, `Error in generateImage function: ${err.message}`)
        }
    }
}

module.exports = new StableImage();