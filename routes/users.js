import express from "express"
import asyncWrapper from "../utils/asyncWrapper.js"
import ExpressError from "../utils/ExpressError.js"
import passport from "passport"
import { storeReturnTo } from "../middleware.js"
import { login, logout, registerUser, renderLoginForm, renderRegistrationForm } from "../controllers/users.js"


const router = express.Router()

router.route('/register')
    .get(renderRegistrationForm)
    .post(asyncWrapper(registerUser))

router.route('/login')
    .get(renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login)

router.get('/logout', logout)

export default router