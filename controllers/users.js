import User from "../models/user.js"

const renderRegistrationForm = (req, res) => {
    res.render('users/register')
}

const registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = await new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'New user successfully registered')
            res.redirect('/campgrounds')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}

const renderLoginForm = (req, res) => {
    res.render('users/login')
}

const login = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo ||  '/campgrounds'
    res.redirect(redirectUrl)
}

const logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

export {renderRegistrationForm, registerUser, renderLoginForm, login, logout}


