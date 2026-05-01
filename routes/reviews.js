import express from "express"
import asyncWrapper from "../utils/asyncWrapper.js"
import ExpressError from "../utils/ExpressError.js"
import { validateReviewRequest, isLoggedIn, isReviewAuthor} from "../middleware.js"
import { createNewReview, deleteReview } from "../controllers/reviews.js"

const router = express.Router({mergeParams: true})

router.post('/', isLoggedIn, validateReviewRequest,asyncWrapper(createNewReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncWrapper(deleteReview))

export default router

