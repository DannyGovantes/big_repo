const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,'User must have a name']
    },
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: true,
        lowercase: true,
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'profesor'],
        default: 'student',

    },
    password: {
        type: String,
        required: [true, 'User must have a pasword'],
        select:false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must have a password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message:'Passwords do not match.'
        }
    },
    groups: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Group'
    }],
    homeworks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'File'
    }],
    active: {
        type: Boolean,
        default:true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})
//TODO: Reactivar la cuenta
userSchema.pre(/^find/, function (next) {
    this.find({ active: {$ne:false} });
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.methods.verifyPassword  = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (jwtRequestedAt) {
    if (!this.passwordChangedAt) return false;
    const passwordChangedIAT = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtRequestedAt < passwordChangedIAT;
}

userSchema.methods.randomToken = function () {
    const rndtoken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(rndtoken).digest('hex');
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    return rndtoken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;