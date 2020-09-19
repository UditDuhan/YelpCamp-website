const mongoose = require("mongoose");
// var Comment = require("./comment");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
// campgroundSchema.pre('findByIdAndRemove', async function () {
//     await Comment.remove({
//         _id: {
//             $in: this.comments
//         }
//     });
// });

module.exports = mongoose.model("Campground", campgroundSchema);