const mongoose = require('mongoose');

const timeSeriesSchema = new mongoose.Schema({

  timestamp: {type: Number, default: Math.floor(new Date() / 60000) },
  data: [
    {
      encryptedMessage: String,
      name: String,
      origin: String,
      destination: String,
      secret_key: String,
    },
  ],
});

const TimeSeriesModel = mongoose.model('TimeSeries', timeSeriesSchema);

module.exports = TimeSeriesModel;
