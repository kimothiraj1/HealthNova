import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createHealthLog, getMyHealthLogs } from '../services/healthLogService';
import { getPrediction } from '../services/predictionService';

function Dashboard() {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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

  const inputClass = "w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">HealthNova</h1>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Log Today's Health</h2>
          {error && <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sleep (hrs)</label>
              <input type="number" step="0.1" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Steps</label>
              <input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Water (L)</label>
              <input type="number" step="0.1" value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} required className={inputClass} />
            </div>
            <button
              type="submit"
              className="col-span-2 md:col-span-5 bg-blue-600 text-white font-medium rounded-md py-2 hover:bg-blue-700 transition-colors"
            >
              Save Log
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#2563eb" name="Weight (kg)" strokeWidth={2} />
              <Line type="monotone" dataKey="sleepHours" stroke="#16a34a" name="Sleep (hrs)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Logs</h2>
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log._id} className="py-3 text-sm text-slate-600 flex justify-between">
                <span className="font-medium text-slate-800">{log.date.split('T')[0]}</span>
                <span>Weight: {log.weight}kg · Sleep: {log.sleepHours}h · Steps: {log.steps} · Water: {log.waterIntake}L</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Get Sleep Quality Prediction</h2>
          <form onSubmit={handlePredictionSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Gender</label>
              <select value={predictionForm.Gender} onChange={(e) => handlePredictionChange('Gender', e.target.value)} className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" value={predictionForm.Age} onChange={(e) => handlePredictionChange('Age', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sleep Duration (hrs)</label>
              <input type="number" step="0.1" value={predictionForm.Sleep_Duration} onChange={(e) => handlePredictionChange('Sleep_Duration', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Activity (min/day)</label>
              <input type="number" value={predictionForm.Physical_Activity_Level} onChange={(e) => handlePredictionChange('Physical_Activity_Level', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stress Level (1-10)</label>
              <input type="number" value={predictionForm.Stress_Level} onChange={(e) => handlePredictionChange('Stress_Level', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>BMI Category</label>
              <select value={predictionForm.BMI_Category} onChange={(e) => handlePredictionChange('BMI_Category', e.target.value)} className={inputClass}>
                <option value="Normal">Normal</option>
                <option value="Overweight">Overweight</option>
                <option value="Obese">Obese</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Heart Rate</label>
              <input type="number" value={predictionForm.Heart_Rate} onChange={(e) => handlePredictionChange('Heart_Rate', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Daily Steps</label>
              <input type="number" value={predictionForm.Daily_Steps} onChange={(e) => handlePredictionChange('Daily_Steps', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Systolic BP</label>
              <input type="number" value={predictionForm.Systolic_BP} onChange={(e) => handlePredictionChange('Systolic_BP', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Diastolic BP</label>
              <input type="number" value={predictionForm.Diastolic_BP} onChange={(e) => handlePredictionChange('Diastolic_BP', e.target.value)} required className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Occupation</label>
              <select value={predictionForm.Occupation} onChange={(e) => handlePredictionChange('Occupation', e.target.value)} className={inputClass}>
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
            <button
              type="submit"
              className="col-span-2 md:col-span-4 bg-green-600 text-white font-medium rounded-md py-2 hover:bg-green-700 transition-colors"
            >
              Get Prediction
            </button>
          </form>

          {predictionError && <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mt-4">{predictionError}</p>}
          {prediction !== null && (
            <div className="bg-green-50 text-green-800 rounded-md px-4 py-3 mt-4 text-center">
              <span className="text-sm">Predicted Sleep Quality</span>
              <div className="text-3xl font-bold">{prediction} / 9</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;