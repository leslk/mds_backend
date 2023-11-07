const Observer = require('./observer.js');

class ImageHandler extends Observer{
    constructor(response) {
        super();
        this.imageUrl = process.env.HOST + `/images/placeholder.png`;
        this.response = response;
    }

    async update(objectId, instance) {
        if (this.response.status === 200) {
            console.log('success');
        } else {
            const object = await instance.findOne(objectId);
            object.setImageUrl(this.imageUrl);
            object.setDescription(object.description);
            object.save();
            console.log({'error' : `status code ${this.response.status}, ${this.response.statusText}`});
        }
    }
}

module.exports = ImageHandler;