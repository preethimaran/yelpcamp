// if(process.env.NODE_ENV !== "production"){
//     const dotenv = await import('dotenv')
//     dotenv.config()
// }
import sanitizeV5 from "./utils/mongoSanitizeV5.js"
import 'dotenv/config';  // ESM way
import express from "express"
import mongoose from "mongoose"
import { fileURLToPath } from 'url'
import path from "node:path"
import ejsMate from "ejs-mate"
import methodOverride from "method-override"
import ExpressError from "./utils/ExpressError.js"
import campgroundRoutes from "./routes/campgrounds.js"
import reviewRoutes from "./routes/reviews.js"
import userRoutes from "./routes/users.js"
import session from "express-session"
import MongoStore from 'connect-mongo'
import flash from "connect-flash"
import passport from "passport"
import LocalStratergy from "passport-local"
import User from "./models/user.js"
import helmet from "helmet"

// const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'
const port = process.env.PORT || 3000
const app = express()
app.set('query parser', 'extended');



// Set Up
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.set('view engine', 'ejs') // setting view engine to be ejs
app.engine('ejs', ejsMate) //telling it to use ejsMate engine to parse ejs instead of the default engine
app.set('views', path.join(__dirname, "views")) // setting the path where the view files will be found
app.use(express.static(path.join(__dirname, "public"))) // setting the directory where static files will be found

app.use(sanitizeV5({ replaceWith: '_' }));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

const secret = process.env.SECRET || 'thisshouldbeabettersecret' 
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

const sessionOptions = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionOptions))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
]
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
]
const connectSrcUrls = [
    "https://api.maptiler.com/",
]

const fontSrcUrls= []

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'","blob:"],
            objectSrc: [],
            imgSrc:[
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontScr: ["'self'", ...fontSrcUrls]
        }
    })
)



app.use(passport.initialize())
app.use(passport.session())
//Passport, we would like you to use the local strategy
//And for the local stratergy the authentication method is located on the User
passport.use(new LocalStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

// Connecting to mongodb

main()
    .catch(err => console.log(err))


async function main() {
    await mongoose.connect(dbUrl)
    console.log('MONGO CONNECTION IS OPEN')
}


app.get('/', (req, res) => {
    res.render('home')
})


app.all('/{*all_path}', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err })
})

// API Routing
app.listen(port, () => {
    console.log(`Serving on Port: ${port}`)
})
