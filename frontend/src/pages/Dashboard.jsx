import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createHealthLog, getMyHealthLogs } from '../services/healthLogService';
import { getPrediction } from '../services/predictionService';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [steps, setSteps] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [error, setError] = useState('');

  const [predictionForm, setPredictionForm] = useState({
    Gender: 'Male',
    Age: '',
    Sleep_Duration: '',
    Physical_Activity_Level: '',
    Stress_Level: '',
    BMI_Category: 'Normal',
    Heart_Rate: '',
    Daily_Steps: '',
    Systolic_BP: '',
    Diastolic_BP: '',
    Occupation: 'Software Engineer'
  });
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState('');

  const fetchLogs = async () => {
    try {
      const data = await getMyHealthLogs();
      setLogs(data.logs);
    } catch (err) {
      setError('Failed to load logs');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createHealthLog({ date, weight, sleepHours, steps, waterIntake });
      setDate('');
      setWeight('');
      setSleepHours('');
      setSteps('');
      setWaterIntake('');
      fetchLogs();
    } catch (err) {
      setError('Failed to save log');
    }
  };

  const handlePredictionChange = (field, value) => {
    setPredictionForm({ ...predictionForm, [field]: value });
  };

  const handlePredictionSubmit = async (e) => {
    e.preventDefault();
    setPredictionError('');
    setPrediction(null);

    try {
      const data = await getPrediction(predictionForm);
      setPrediction(data.prediction);
    } catch (err) {
      setPredictionError('Failed to get prediction. Is the ML API running?');
    }
  };

  const chartData = [...logs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((log) => ({
      date: log.date.split('T')[0],
      weight: log.weight,
      sleepHours: log.sleepHours
    }));

  return (
    <div>
      <h2>Dashboard</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>
        <div>
          <label>Sleep Hours</label>
          <input type="number" step="0.1" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} required />
        </div>
        <div>
          <label>Steps</label>
          <input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} required />
        </div>
        <div>
          <label>Water Intake (L)</label>
          <input type="number" step="0.1" value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} required />
        </div>
        <button type="submit">Save Log</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
          <Line type="monotone" dataKey="sleepHours" stroke="#82ca9d" name="Sleep (hrs)" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Your Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            {log.date.split('T')[0]} — Weight: {log.weight}kg, Sleep: {log.sleepHours}h, Steps: {log.steps}, Water: {log.waterIntake}L
          </li>
        ))}
      </ul>

      <h3>Get Sleep Quality Prediction</h3>
      <form onSubmit={handlePredictionSubmit}>
        <div>
          <label>Gender</label>
          <select value={predictionForm.Gender} onChange={(e) => handlePredictionChange('Gender', e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Age</label>
          <input type="number" value={predictionForm.Age} onChange={(e) => handlePredictionChange('Age', e.target.value)} required />
        </div>
        <div>
          <label>Sleep Duration (hrs)</label>
          <input type="number" step="0.1" value={predictionForm.Sleep_Duration} onChange={(e) => handlePredictionChange('Sleep_Duration', e.target.value)} required />
        </div>
        <div>
          <label>Physical Activity (min/day)</label>
          <input type="number" value={predictionForm.Physical_Activity_Level} onChange={(e) => handlePredictionChange('Physical_Activity_Level', e.target.value)} required />
        </div>
        <div>
          <label>Stress Level (1-10)</label>
          <input type="number" value={predictionForm.Stress_Level} onChange={(e) => handlePredictionChange('Stress_Level', e.target.value)} required />
        </div>
        <div>
          <label>BMI Category</label>
          <select value={predictionForm.BMI_Category} onChange={(e) => handlePredictionChange('BMI_Category', e.target.value)}>
            <option value="Normal">Normal</option>
            <option value="Overweight">Overweight</option>
            <option value="Obese">Obese</option>
          </select>
        </div>
        <div>
          <label>Heart Rate</label>
          <input type="number" value={predictionForm.Heart_Rate} onChange={(e) => handlePredictionChange('Heart_Rate', e.target.value)} required />
        </div>
        <div>
          <label>Daily Steps</label>
          <input type="number" value={predictionForm.Daily_Steps} onChange={(e) => handlePredictionChange('Daily_Steps', e.target.value)} required />
        </div>
        <div>
          <label>Systolic BP</label>
          <input type="number" value={predictionForm.Systolic_BP} onChange={(e) => handlePredictionChange('Systolic_BP', e.target.value)} required />
        </div>
        <div>
          <label>Diastolic BP</label>
          <input type="number" value={predictionForm.Diastolic_BP} onChange={(e) => handlePredictionChange('Diastolic_BP', e.target.value)} required />
        </div>
        <div>
          <label>Occupation</label>
          <select value={predictionForm.Occupation} onChange={(e) => handlePredictionChange('Occupation', e.target.value)}>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Teacher">Teacher</option>
            <option value="Engineer">Engineer</option>
            <option value="Accountant">Accountant</option>
            <option value="Lawyer">Lawyer</option>
            <option value="Manager">Manager</option>
            <option value="Salesperson">Salesperson</option>
            <option value="Sales Representative">Sales Representative</option>
            <option value="Scientist">Scientist</option>
          </select>
        </div>
        <button type="submit">Get Prediction</button>
      </form>

      {predictionError && <p style={{ color: 'red' }}>{predictionError}</p>}
      {prediction !== null && <p><strong>Predicted Sleep Quality: {prediction} / 9</strong></p>}
    </div>
  );
}

export default Dashboard;