const mongoose = require('mongoose');

const {Schema,model} = mongoose


const timeSeriesSchema = new Schema({

  timestamp: {type: Number, default: Math.floor(new Date() / 60000) },
  data: [
    {
      name: String,
      origin: String,
      destination: String,
    },
  ],
});

const TimeSeries = model('TimeSeries', timeSeriesSchema);

module.exports = TimeSeries;
