const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geolocation.utils")
const User = require("./user.model");


const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter job title"],
        trim: true,
        maxLength: [100, "Job title can not exceed 100 characters."]
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    company: {
        type: String,
        required: true
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: ["Business", "Banking", "Education/Training", "Telecommunication", "IT", "Others"]
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: ["Permanent", "Part Time", "Internship"]
        }
    },
    minEducation: {
        type: String,
        required: true,
        enum: {
            values: ["Bachelors", "Masters", "Phd"]
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience: {
        type: String,
        required: true,
        enum: {
            values: ["No Experience", "1 Yrs - 2 Yrs", "2 Yrs - 5 Yrs"]
        }
    },
    salary: {
        type: Number,
        required: true
    },
    published: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        deafult: new Date().setDate(new Date().getDate() + 10)
    },

    applicantApplied: {
        type: [{
            id: String,
            url: String
        }],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true
    }
}, {
    versionKey: false
})

jobSchema.pre("save", function (next) {
    this.title = slugify(this.title, { lower: true });
    next();
})

// jobSchema.pre("save", async function (next) {
//     const loc = await geocoder.geocode(this.address);
//     this.location = {
//         type: "Point",
//         coordinates: [loc[0].longitude, loc[0].latitude],
//         formattedAddress: loc[0].formattedAddress,
//         city: loc[0].city,
//         state: loc[0].stateCode,
//         zipcode: loc[0].zipcode,
//         country: loc[0].country
//     };
//     next();
// })


module.exports = mongoose.model("Jobs", jobSchema);