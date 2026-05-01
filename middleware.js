import Campground from "./models/campground.js"
import Review from "./models/review.js"
import { campgroundSchema, reviewSchema } from "./schemas.js"
import ExpressError from "./utils/ExpressError.js"

const validateCampgroundRequest = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReviewRequest = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if(req.method=== 'GET'){
        req.session.returnTo = req.originalUrl}
        req.flash('error', 'You must be logged in first')
        return res.redirect('/login')
    }
    next()
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorised to do that!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorised to do that!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

export { isLoggedIn, storeReturnTo, isAuthor, validateCampgroundRequest, validateReviewRequest, isReviewAuthor }