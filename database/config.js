const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB connection successful.');
  } catch (err) {
    console.log(err);
    throw new Error('Error connecting to database: ' + err);
  }
}

module.exports = {
  dbConnection,
}