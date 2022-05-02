const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const {promisify} = require('util');
const User = require('./../models/user')
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('../utils/mailer');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })
}
const createToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV ==='production' ? true : false,
        httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createToken(user, 201, res);
    
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Please provide email and password'), 400);
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await (user.verifyPassword(password, user.password))) return next(new AppError('Email not found or Incorrect Password', 401));
    const token = signToken(user._id);
    createToken(user, 200, res);
});
exports.logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 1500),
        httpOnly:true
    });
    res.status(200).json({
        status: 'success'
    });
    
}
exports.isLoggedIn = async (req, res, next) => {

    res.locals.user = null;
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) return next();

            if (user.changePasswordAfter(decoded.iat)) {
                return next();
            }
            res.locals.user = user; 
            return next();
        } catch (error) {
            return next();
        }
    }
    next();

};

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1];   
    
    } else if (req.cookies.jwt) {
        
        token = req.cookies.jwt;
    
    }
    if (!token) return next(new AppError('You are not logged in', 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('No user belongs to that token', 401));
    if (user.changePasswordAfter(decoded.iat)) return next(new AppError('Password recently changed.Log in again', 401));
    req.user = user;
    res.locals.user = user;
    next();
})

exports.permisons = (...roles) => {
    return catchAsync(async (req, res, next) => { 
        if (!roles.includes(req.user.role)) {
            return new AppError('You dont have permison to perform this action', 403);
        }
        next();
    })
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('There is no user with this email', 404));
    const resetToken = user.randomToken();
    await user.save({ validateBeforeSave: false });
    const URL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `It seems that you forgot your password. Its ok, use this link to reset your password: ${URL}\nIf you dont want to change your password, ignore this message`;
    try {
        await sendEmail({
            email: user.email,
            text: message,
            subject: 'Reset your password (Expires in 10 min)'
        });
        res.status(200).json({
            status: 'success',
            message:'Token sent to user'
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was a problem sending the email. Please try again later'), 500);
    }
    
})

exports.resetPassword = catchAsync(async (req, res, next) => {
 
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } });
    
    if (!user) return next(new AppError('Token is invalid. Maybe it expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    //update password
    await user.save();
    createToken(user, 200, res);
    
});
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.verifyPassword(req.body.currentPassword, user.password))) return next(new AppError('Your password is not correct', 401));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createToken(user, 200, res);
});