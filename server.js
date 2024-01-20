const config = require('./utils/config');
const mongoose = require ('mongoose');
const app = require('./app');

console.log('connecting to MongoDB');
mongoose.connect(config.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.PORT,()=>{
        console.log(`server is running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });