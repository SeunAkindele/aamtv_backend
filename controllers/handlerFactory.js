const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Search = require('../models/searchModel');

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
exports.deleteCustomOne = (Model, prop) => catchAsync(async (req, res, next) => {
    const data = await Model.findOneAndDelete({[prop]: req.params.id, user: req.user.id});

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

exports.getArtistVideos = (Model) => catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find({user: req.params.id}), req.query)
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

exports.searchMany = (Model1, Model2, col1, col2) => catchAsync(async (req, res, next) => {
    let validationObject1= req.query.search != '' ? { [col1]: { $regex: req.query.search, $options: 'i' } } : {};
    let validationObject2= req.query.search != '' ? { [col2]: { $regex: req.query.search, $options: 'i' } } : {};

    const features1 = new APIFeatures(Model1.find(validationObject1), req.query)
    .lazyLoader()
    const features2 = new APIFeatures(Model2.find(validationObject2), req.query)
    .lazyLoader()
    
    const artists = await features1.query;
    const videos = await features2.query;

    // Saving recent artits searches
    Model1.findOne({ name: { $regex: new RegExp(req.query.search, 'i') } }, async (err, results) => {
        if (err) {
            console.error(err);
        } else {
            if(results){
                let obj = {
                    artist: results._id,
                    user: req.user.id,
                    category: 'artist'
                }
                const count = await Search.countDocuments({artist: results._id, user: req.user.id});
                            
                if(count < 1){
                    await Search.create(obj);
                }
            }
        }
    });

    // Saving recent video searches
    Model2.findOne({ title: { $regex: new RegExp(req.query.search, 'i') } }, async (err, results) => {
        
        if (err) {
            console.error(err);
        } else {
            if(results){
                let obj = {
                    video: results._id,
                    user: req.user.id,
                    category: 'video'
                }
                const count = await Search.countDocuments({video: results._id, user: req.user.id});
                            
                if(count < 1){
                    await Search.create(obj);
                }
            }
        }
    });

    res.status(200).json({
        status: 'success',
        results: artists.length + videos.length,
        data: {
            artists,
            videos
        }
    });
});

exports.getCountIsExist = (Model, prop) => catchAsync( async (req, res, next) => {

    let isExist = false;
    const data = prop ? await Model.findOne({[prop]: req.params.id, user: req.user.id}) : await Model.findOne({user: req.user.id});

    if(data) isExist = true;

    let count = prop ? await Model.countDocuments({[prop]: req.params.id}) : await Model.countDocuments({user: req.params.id});

    res.status(200).json({
        status: 'success',
        data: {
            count,
            isExist
        }
    });
});