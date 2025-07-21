require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog');

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 4444;

// mongoose.connect('mongodb://localhost:27017/Youtube-Blog')
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(`Mongo DB Connected`))
    .catch((err) => console.log('mongoDB Error', err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.get('/', async(req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
});

app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));