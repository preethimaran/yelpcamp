import mongoose from "mongoose"
import Campground from '../models/campground.js'
import cities from './cities.js'
import { descriptors, places } from "./seedHelpers.js"



// Connecting to mongodb
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
        console.log('MONGO CONNECTION IS OPEN')
    } catch (err) {
        console.log(`ERROR!!: ${err}`)
    }
}

main()

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '69e8cf24c9fbe3f30b2ce226',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium corrupti doloribus, sapiente voluptate reiciendis facilis dolorem eaque fugit, illo odio repellendus ipsum. Rerum distinctio voluptatum dolor suscipit repudiandae numquam fugiat.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dvzr43dl3/image/upload/v1777372168/YelpCamp/hdsk4vdd0k8uuclsmlbn.jpg',
                    filename: 'YelpCamp/hdsk4vdd0k8uuclsmlbn',
                },
                {
                    url: 'https://res.cloudinary.com/dvzr43dl3/image/upload/v1777372168/YelpCamp/kigr7fefhxxbeqypqieg.jpg',
                    filename: 'YelpCamp/kigr7fefhxxbeqypqieg',
                }
            ],

        })
        await camp.save()
    }
}

async function runSeed() {
    try {
        await seedDB()
        await mongoose.connection.close()
        console.log('Seed Data successfully inserted!! connection closed!')
    } catch (err) {
        console.log(err)
    }
}

runSeed()