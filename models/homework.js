const mongoose = require('mongoose');
const slugify = require('slugify');

const homeworkSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Homework must have a name'],
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Homework must have a description']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    timeLimit: {
        type: Date,
        required:[true,'Homework must have a time limit']
    },
    canUploadAfterTime: {
        type: Boolean,
        default: true
    },
    deliveredBy: [{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    }],
    group: {
        type: mongoose.Schema.ObjectId,
        ref:'Group'
    }

});

homeworkSchema.pre('save', function (next) {
    const sluggedName = `${this.name} ${this.group}`;
    this.slug = slugify(sluggedName, { lower: true });
    next();
});

const Homework = mongoose.model('Homework', homeworkSchema);
module.exports = Homework;