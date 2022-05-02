const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');


exports.getAll = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.find();
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});
exports.getOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(AppError('Not found'), 404);
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});
exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
});
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
});
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success'
    });
});