const factory = require('./factoryHandler');
const Homework = require('./../models/homework');
const catchAsync = require('./../utils/catchAsync');
const cloudinary = require('./../utils/cloudinary');
const Group = require('./../models/group');
const AppError = require('./../utils/appError');
const multer = require('multer');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/docs/homework');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `homework-${req.user.id}-${Date.now()}.${ext}`);
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
exports.uploadHomework = catchAsync(async (req, res, next) => {
    res.status(201).json({
        status: 'success'
    })
});

exports.getAllHomework = factory.getAll(Homework);
exports.getHomework = factory.getOne(Homework);
exports.createHomework = catchAsync(async (req, res, next) => {
    const homeworkData = {
        name: req.body.name,
        description: req.body.description,
        timeLimit: req.body.timeLimit,
    }
    const group = await Group.findOne({ slug: req.body.group });
    if (!group) return next(new AppError('No se encontro el grupo', 400));
    homeworkData.group = group._id;
    const homework = await Homework.create(homeworkData);
    res.status(201).json({
        status: 'success',
        data: {
            homework
        }
    });
});
exports.updateHomework = factory.updateOne(Homework);
exports.deleteHomework = factory.deleteOne(Homework);