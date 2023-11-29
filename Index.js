const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const app = express();


const jobs = require("./routes/jobs");
const auth = require("./routes/auth");
const user = require("./routes/user");
const connectDatabase = require("./config/db")
dotenv.config({ path: "./config/config.env" })
app.use(express.json());
app.use(cookieParser());

//DB Connection
connectDatabase();


//Routes
app.use("/api/v1", jobs);
app.use("/api/v1", user);
app.use(auth)


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})














