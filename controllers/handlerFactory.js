const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if(!data) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!data) {
        return next(new AppError('Document not found', 404));
    }

    res.status(201).json({
        status: 'success',
        data: {
            data
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    
    const data = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data
        }
    });
});

exports.getOne = Model => catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id);
     
     if(!data) {
         return next(new AppError('Document not found', 404));
     }
 
     res.status(200).json({
         status: 'success',
         data: {
            data
         }
     });
});

 exports.getAll = (Model, validationObject={}) => catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(validationObject), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});

exports.getAllAsc = (Model, validationObject={}) => catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(validationObject), req.query)
    .lazyLoader()

    const data = await features.query;

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});

exports.search = (Model, col) => catchAsync(async (req, res, next) => {
    let validationObject= req.query.search != '' ? { [col]: { $regex: req.query.search, $options: 'i' } } : {}
    const features = new APIFeatures(Model.find(validationObject), req.query)
    .lazyLoader()
    
    const data = await features.query;

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});

exports.getCountIsExist = (Model, prop) => catchAsync( async (req, res, next) => {

    let isExist = false;
    const data = await Model.findOne({[prop]: req.params.id, user: req.user.id});

    if(data) isExist = true;

    let count = await Model.countDocuments({[prop]: req.params.id});

    res.status(200).json({
        status: 'success',
        data: {
            count,
            isExist
        }
    });
});