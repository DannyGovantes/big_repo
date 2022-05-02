const factory = require('./factoryHandler');
const sharp = require('sharp');
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');
const multer = require('multer');
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    cb(null, true);
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateMe = catchAsync(async (req, res, next) => {

    let photoPath = ''; 
    if (req.file) photoPath = req.file.filename;
    const user = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email,
        photo: photoPath
    },
        {
            new: true,
            runValidators: true
        });
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    });
});
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
}