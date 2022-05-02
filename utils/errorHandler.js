const castError = err => {
    const message = `Invalid ${err.path} is: ${err.value}`;
    return new AppError(message, 400);
}
const duplicateError = err =>{
    
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Invalid field: Duplicated value (${value})`;
    return new AppError(message, 400);

}

const validationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `ERROR::Validation on these values: ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const developmentError = (err,req, res) => {
    
    if (req.originalUrl.startsWith('/api')) {
        
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message
    });
}

const productionError = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        console.error('ERROR::::::::', err);
        return res.status(500).json({
            status: 'fail',
            message: 'Something went wrong :('
        });
    }
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message
        });
        
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later'
    });
}
const jwtTokenError = () => new AppError('Invalid token. Pleas Log in again', 401);
const jwtExpiredTokenError = () => new AppError('Expired token. Please log in again', 401);


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    if (process.env.NODE_ENV === 'development') {
        developmentError(err,req,res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (error.name === 'CastError') error = castError(error)
        if (err.code === 11000) error = duplicateError(error);
        if (err.name === 'ValidationError') error = validationError(error);
        if (err.name === 'JsonWebTokenError') error = jwtTokenError();
        if (err.name === 'TokenExpiredError') error = jwtExpiredTokenError();
        productionError(error,req,res);
    }
}