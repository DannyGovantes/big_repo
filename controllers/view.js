const catchAsync = require('./../utils/catchAsync');
const Group = require('./../models/group');
const User = require('./../models/user');
const Homework = require('./../models/homework');
const AppError = require('./../utils/appError');
const { async } = require('regenerator-runtime');

exports.getHome = catchAsync(async (req, res, next) => {
    res.status(200).render('overview');
});
exports.getLogin = (req, res) => {
    res.status(200).render('login',{
        title: 'Login'
    });
}
exports.getSignUp = (req, res) => {
    res.status(200).render('signup',{
        title: 'Signup'
    });
}
exports.getGroup = catchAsync(async (req, res, next) => {
    const group = await Group.findOne({ slug: req.params.groupSlug }).populate({
        path: 'profesor',
        select: 'name email'
    }).populate({
        path: 'homework'
    }).populate({
        path: 'students',
        select: 'name'
    }).populate({
        path: 'requests',
        select: 'name'
    });
    if (!group ) {
        return next(new AppError('URL not found', 404));
    }
    const profesors = group.profesor.map(profesor => profesor._id.toString());
    const students = group.students.map(student => student._id.toString());
    res.status(200).render('group', {
        title: `${group.name}`,
        group,
        profesors,
        students
    });
});
exports.getGroups = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
        path: 'groups'
    });
    res.status(200).render('groups', {
        title: 'Mis grupos',
        groups: user.groups
    });
});

exports.getHomework = catchAsync(async (req, res, next) => {
    const homework = await Homework.findOne({ slug: req.params.slug }).populate({
        path: 'deliveredBy',
       
    });

    if (!homework) return next(new AppError('URL not found'), 404);
    res.status(200).render('homework', {
        title: `${homework.name}`,
        homework
    });
});
exports.getNewGroup = (req, res) => {
    res.status(200).render('new_group', {
       title: 'Crea un grupo' 
    });
}

exports.getProfesor = (req, res) => {
    res.status(200).render('profesor', {
        title: 'Invitar alumnos'
    });
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'My cuenta'
    });
}
exports.homeworkOverview = (req, res) => {
    res.status(200).render('home');
}
