const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    filePath: {
        type: String,
        required: [true,'Every file has a path']
    },
    summary: {
        type:String
    },
    deliveredBy: {
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    deliveredAt: {
        type: Date,
        default: Date.now()
    },
    grade: {
        type: Number,
        min: 0,
        max: 10
    },
    homework: {
        type: mongoose.Schema.ObjectId,
        ref: 'Homework'
    }
});
const File = mongoose.model('File', fileSchema);
module.exports = File;

