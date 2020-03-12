import mongoose from 'mongoose'

//mongoose uses callback by default. but we want the javascript global promise
mongoose.Promise = global.Promise;

// var dockerConn = 'mongodb://mongo:27017/premier-league' //using docker

const dockerConn = 'mongodb://localhost:27017/premier-league' //using docker

const mongoDB = process.env.MONGODB_URI || dockerConn;

mongoose.connect(mongoDB, {useNewUrlParser: true});

export default mongoose