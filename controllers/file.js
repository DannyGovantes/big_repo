const factory = require('./factoryHandler');
const File = require('./../models/file');
const Homework = require('./../models/homework');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/user');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/docs/homework');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${req.user.id}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    cb(null, true);
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadFile = upload.single('doc');

exports.createFile = catchAsync(async (req, res, next) => {
    let filePath = '';
    if (req.file) filePath = req.file.filename;
    const fileData = req.body;
    const homeworkSlug = req.body.homework;
    const homework = await Homework.findOneAndUpdate({ slug: homeworkSlug }, { $push: { deliveredBy: req.user.id } }, { new: true });
    const user = await User.findByIdAndUpdate(req.user.id, { $push: { homeworks: homework._id } });
    fileData.homework = homework._id;
    fileData.deliveredBy = req.user.id;
    fileData.filePath = filePath;
    const file = await File.create(fileData);
    res.status(203).json({
        status: 'success',
        data: {
            file
        }
    })
})
exports.deleteFile = factory.deleteOne(File);