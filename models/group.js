const mongoose = require('mongoose');
const slugify  = require('slugify');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,'Groups must have a name']
    },
    slug: String,
    school: {
        type: String,
        required:[true,'Groups must have an school']
    },
    sequence: {
        type: String,
        required: [true,'Groups must have a sequence'],
        upercase: true,
    },
    description: {
        type: String,
    },
    profesor: [{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    }],
    students: [{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    }],
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        
    }],
}, {
    toJSON: {virtuals: true},
    toObject:{virtuals:true}    
});
groupSchema.virtual('homework', {
    ref: 'Homework',
    foreignField: 'group',
    localField: '_id'
});

groupSchema.pre('save', function (next) {
    const sluggedName = `${this.name} ${this.sequence} ${this.school}`;
    this.slug = slugify(sluggedName, { lower: true });
    next();
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;