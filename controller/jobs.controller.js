const Job = require("../model/jobs.model");
const { cloudinaryUpload } = require("../utils/cloudinaryUpload");
const throwError = require("../utils/error.handle").default;


exports.getJobs = async (req, res, next) => {

    const jobs = await Job.find();

    if (jobs.length > 0) {
        res.status(200).send(jobs)
    } else {
        throwError("No jobs found", 404);
        return;
    }
}

exports.getJobById = async (req, res, next) => {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
        throwError("No jobs found with this ID", 404);
        return;
    }

    res.status(200).send(job)
}


exports.newJob = async (req, res, next) => {
    req.body.user = req.user._id;
    const data = await Job.create(req.body);
    res.status(200).send({ data })
}

exports.updateJob = async (req, res, next) => {

    let jobs = await Job.findById(req.params.jobId);

    if (!jobs) {
        throwError("No jobs found", 404);
        return;
    }

    jobs = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
        new: true,
        runValidators: true,
        userFindAndUpdate: false
    });

    res.status(200).send(jobs)

}

exports.deleteJob = async (req, res, next) => {
    let jobs = await Job.findById(req.params.jobId);
    if (!jobs) {
        throwError("No jobs found with this ID", 404);
        return;
    }

    jobs = await Job.findByIdAndDelete(req.params.jobId);
    res.status(200).send("Job deleted successfully")
}

exports.applyJob = async (req, res, next) => {
    try {
        const jobId = req.params.jobId;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).send("No job found");
        }

        if (job.lastDate < new Date(Date.now)) {
            return res.status(400).send("You can't apply this job Date is over");
        }



        //User is applied for this job or not
        for (let i = 0; i <= job.length - 1; i++) {   ///Having issue in this method
            if (job.applicantApplied[i].id == req.user._id) {
                return res.status(400).send("You already applied for this job.")
            }
        }

        if (!req.file) {
            return res.status(404).send("No file uploaded");
        }

        const file = req.file;

        const fileUpload = await cloudinaryUpload(file.path);

        if (!fileUpload) {
            return res.status(500).send("Error uploading file to Cloudinary");
        }

        await Job.findByIdAndUpdate(jobId, {
            $push: {
                applicantApplied: {
                    id: req.user._id,
                    url: fileUpload.secure_url
                }
            }
        }, {
            new: true,
            runValidators: true,
        })
        res.status(200).send("Job applied successfully");
    } catch (error) {
        console.error("Error in uploadFile:", error);
        next(error);
    }
};

exports.getJobsByUser = async (req, res, next) => {
    try {

        const jobs = await Job.find({ 'applicantApplied.id': req.user._id });

        if (!jobs) {
            return res.status(404).send("No user found")
        }

        res.status(200).send(jobs)

    } catch (error) {
        next(error)
    }
}

exports.deleteUserData = async (req, res, next) => { ///Having issue in this method
    try {
        console.log("userdata")
        if (req.user.role === "User") {
            const jobs = await Job.findOneAndUpdate({ 'applicantApplied.id': req.user._id }, {
                $pull: { applicantApplied: { id: req.user._id } }
            }, {
                new: true
            })

            res.send(jobs)
        }


        // if (res.user.role === "User") {

        // }

    } catch (error) {
        next(error)
    }
}

exports.getJobPublished = async (req, res, next) => { ///Having issue in this method
    try {
        const jobs = await Job.find({ user: req.user._id });

        if (!jobs || jobs.length === 0) {
            return res.status(404).send("No jobs found");
        }

        res.status(200).send(jobs);

    } catch (error) {
        console.log(error)
        next(error)
    }
}