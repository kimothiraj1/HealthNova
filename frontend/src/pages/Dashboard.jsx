import { useState, useEffect } from 'react';
import { createHealthLog, getMyHealthLogs } from '../services/healthLogService';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [steps, setSteps] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [error, setError] = useState('');

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

      <h3>Your Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            {log.date.split('T')[0]} — Weight: {log.weight}kg, Sleep: {log.sleepHours}h, Steps: {log.steps}, Water: {log.waterIntake}L
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;