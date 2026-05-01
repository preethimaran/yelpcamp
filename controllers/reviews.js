import Campground from "../models/campground.js"
import Review from "../models/review.js"
import ExpressError from "../utils/ExpressError.js"

const createNewReview = async (req, res, next) =>{
    // Obtaining the id of the campground and finding that campground
    const {id} = req.params
    const camp = await Campground.findById(id)

    // Obtaining body and rating of the submitted review and creating new review
    const {body, rating} = req.body.review
    const review = new Review({body, rating})
    review.author = req.user._id
    await review.save()

    //Linking the campground with the review and saving the changes
    camp.reviews.push(review)
    await camp.save()

    req.flash('success','New Review has been added')
    res.redirect(`/campgrounds/${camp._id}`)
    
}

const deleteReview = async (req, res, next) => {
    const {id, reviewId} = req.params
    const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    if (!camp){
        throw new ExpressError('Campground not found', 404)
    }
    const review = await Review.findByIdAndDelete(reviewId)
    console.log(review)
    req.flash('success','The selected review has been deleted')
    res.redirect(`/campgrounds/${id}`)
}

export {createNewReview, deleteReview}