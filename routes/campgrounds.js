import express from "express"
import asyncWrapper from "../utils/asyncWrapper.js"
import ExpressError from "../utils/ExpressError.js"
import Campground from "../models/campground.js"
import { isLoggedIn, isAuthor, validateCampgroundRequest } from "../middleware.js"
import {index, renderNewForm, createCampground, showCampground, renderEditForm, updateCampground, deleteCampground} from "../controllers/campgrounds.js"
import multer from 'multer'
import { storage } from "../cloudinary/index.js"
const upload = multer({ storage })

const router = express.Router()

router.route('/')
    .get(asyncWrapper(index))
    .post(isLoggedIn, upload.array('image'),validateCampgroundRequest, asyncWrapper(createCampground))


router.get('/new', isLoggedIn, renderNewForm )


router.route('/:id')
    .get(asyncWrapper(showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampgroundRequest, asyncWrapper(updateCampground))
    .delete(isLoggedIn, isAuthor, asyncWrapper(deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, asyncWrapper(renderEditForm))

export default router