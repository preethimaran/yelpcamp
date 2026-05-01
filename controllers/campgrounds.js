import Campground from "../models/campground.js"
import { cloudinary } from "../cloudinary/index.js"
import * as maptilerClient from "@maptiler/client"
import campground from "../models/campground.js";
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const index = async (req, res, next) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}

const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

const createCampground = async (req, res, next) => {

    //Finding the geoData for the location entered
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 })
    if (!geoData.features || !geoData.features.length) {
        req.flash('error', 'Could not geocode the location. Please try again by entering a valid location')
        return res.redirect('/campgrounds/new')
    }

    //Creating a campground
    const camp = new Campground(req.body.campground)
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id

    //Saving Geoinfomation to created campground
    camp.geometry = geoData.features[0].geometry
    camp.location = geoData.features[0].place_name

    //Saving created campground
    await camp.save()
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

const showCampground = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }

        }).populate('author')
    if (!camp) {
        req.flash('error', 'This campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { camp })
}

const renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', 'This campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}

const updateCampground = async (req, res, next) => {
    const { id } = req.params

    //Finding the geoData for the location entered
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again by entering a valid location.');
        return res.redirect(`/campgrounds/${id}/edit`);
    }

    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true })

    //Saving Geoinfomation to created campground
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
    
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let i = 0; i < req.body.deleteImages.length; i++) {
            await cloudinary.uploader.destroy(req.body.deleteImages[i])
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated the Campground Information')
    res.redirect(`/campgrounds/${campground._id}`)
}

const deleteCampground = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds')
}

export { index, renderNewForm, createCampground, showCampground, renderEditForm, updateCampground, deleteCampground }