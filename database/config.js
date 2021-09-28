const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    mongoose.set('returnOriginal', false);

    console.log('MongoDB connection successful.');
  } catch (err) {
    throw new Error('Error connecting to database: ' + err);
  }
}

module.exports = {
  dbConnection,
}