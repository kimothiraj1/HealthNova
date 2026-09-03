const axios = require('axios');

const getPrediction = async (req, res, next) => {
  try {
    const {
      Gender, Age, Sleep_Duration, Physical_Activity_Level,
      Stress_Level, BMI_Category, Heart_Rate, Daily_Steps,
      Systolic_BP, Diastolic_BP, Occupation
    } = req.body;

    const response = await axios.post(`${process.env.ML_API_URL}/predict`, {
      Gender, Age, Sleep_Duration, Physical_Activity_Level,
      Stress_Level, BMI_Category, Heart_Rate, Daily_Steps,
      Systolic_BP, Diastolic_BP, Occupation
    });

    res.json({
      message: 'Prediction generated successfully',
      prediction: response.data.predicted_quality_of_sleep
    });
  } catch (err) {
    if (err.response) {
      // The ML API responded, but with an error (e.g., validation failure)
      return res.status(err.response.status).json({
        error: 'ML API rejected the request',
        details: err.response.data
      });
    } else if (err.request) {
      // The ML API never responded at all (e.g., it's not running)
      return res.status(503).json({
        error: 'ML API is unavailable. Please try again later.'
      });
    }
    next(err);
  }
};

module.exports = { getPrediction };