const factory = require('./factoryHandler');
const Group = require('./../models/group');
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { async } = require('regenerator-runtime');


exports.createNewGroup = catchAsync(async (req, res, next) => {
    const groupDetails = req.body;
    const userID = req.user.id;
    groupDetails.profesor = userID;
    const group = await Group.create(groupDetails);
    if (!group) next(new AppError('No se creó el grupo. Inténtelo de nuevo', 204));
    const user = await User.findByIdAndUpdate(userID, { $push: { groups: group._id } });
    res.status(201).json({
        status: 'success',
        data: {
            group,
            user
        }
    });
});

exports.acceptUser = catchAsync(async (req, res, next) => {
    const slug = req.body.slug;
    const userID = req.body.student;
    const group = await Group.findOneAndUpdate({ slug: slug }, { $pull: { requests: userID }, $push: { students: userID } });
    if (!group) return (new AppError('Algo salió mal', 400));
    const user = await User.findByIdAndUpdate(userID, { $push: { groups: group._id } });
    res.status(201).json({
        status: 'success',
        data: {
            user,
            group
        }
    })

})
exports.requestAccess = catchAsync(async (req, res, next) => {
    const slug = req.body.slug;
    const group = await Group.findOneAndUpdate({ slug: slug }, { $push: { requests: req.user.id } });
    res.status(201).json({
        status: 'success',
        data: {
            group
        }
    })
})

exports.getAllGroups = factory.getAll(Group);
exports.getGroup = factory.getOne(Group);
exports.createGroup = factory.createOne(Group);
exports.updateGroup = factory.updateOne(Group);
exports.deleteGroup = factory.deleteOne(Group);