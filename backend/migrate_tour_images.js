require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('./src/models/Tour');
const TourImage = require('./src/models/TourImage');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours. Checking for missing images...`);

        for (const tour of tours) {
            if (!tour.imageUrl) {
                const image = await TourImage.findOne({ tourId: tour._id });
                if (image) {
                    tour.imageUrl = image.imageUrl;
                    await tour.save();
                    console.log(`Updated tour "${tour.name}" with image: ${image.imageUrl}`);
                } else {
                    console.log(`No image found for tour "${tour.name}"`);
                }
            }
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
