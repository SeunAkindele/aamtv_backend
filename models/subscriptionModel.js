const mongoose = require('mongoose');

subscriptionSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiredAt: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    plan: {
        type: String
    },
    transactionRef: {
        type: String
    },
    amount: {
        type: String
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;