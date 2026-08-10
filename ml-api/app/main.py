from fastapi import FastAPI
import joblib
import pandas as pd
from app.schemas import SleepPredictionInput

app = FastAPI(title="HealthNova ML API")

# Load model and scaler once, when the server starts
model = joblib.load("app/models/random_forest_sleep_quality.pkl")
scaler = joblib.load("app/models/scaler.pkl")

# The exact 21 columns, in the exact order the model was trained on
FEATURE_COLUMNS = [
    'Gender', 'Age', 'Sleep Duration', 'Physical Activity Level', 'Stress Level',
    'BMI Category', 'Heart Rate', 'Daily Steps', 'Systolic_BP', 'Diastolic_BP',
    'Occupation_Accountant', 'Occupation_Doctor', 'Occupation_Engineer', 'Occupation_Lawyer',
    'Occupation_Manager', 'Occupation_Nurse', 'Occupation_Sales Representative',
    'Occupation_Salesperson', 'Occupation_Scientist', 'Occupation_Software Engineer',
    'Occupation_Teacher'
]

NUMERIC_COLS_TO_SCALE = ['Age', 'Sleep Duration', 'Physical Activity Level', 'Stress Level',
                          'Heart Rate', 'Daily Steps', 'Systolic_BP', 'Diastolic_BP']

@app.get("/")
def read_root():
    return {"message": "HealthNova ML API is running"}


@app.post("/predict")
def predict_sleep_quality(input_data: SleepPredictionInput):
    # Step 1: build a dict matching our original (pre-encoding) column names
    row = {
        'Gender': 0 if input_data.Gender == "Male" else 1,
        'Age': input_data.Age,
        'Sleep Duration': input_data.Sleep_Duration,
        'Physical Activity Level': input_data.Physical_Activity_Level,
        'Stress Level': input_data.Stress_Level,
        'BMI Category': {"Normal": 0, "Overweight": 1, "Obese": 2}[input_data.BMI_Category],
        'Heart Rate': input_data.Heart_Rate,
        'Daily Steps': input_data.Daily_Steps,
        'Systolic_BP': input_data.Systolic_BP,
        'Diastolic_BP': input_data.Diastolic_BP,
    }

    # Step 2: add all Occupation_ columns, defaulting to False, set the matching one to True
    for col in FEATURE_COLUMNS:
        if col.startswith('Occupation_'):
            occupation_name = col.replace('Occupation_', '')
            row[col] = (occupation_name == input_data.Occupation)

    # Step 3: build a single-row DataFrame in the exact correct column order
    df_input = pd.DataFrame([row])[FEATURE_COLUMNS]

    # Step 4: scale the numeric columns using the SAME fitted scaler from training
    df_input[NUMERIC_COLS_TO_SCALE] = scaler.transform(df_input[NUMERIC_COLS_TO_SCALE])

    # Step 5: predict
    prediction = model.predict(df_input)[0]

    return {"predicted_quality_of_sleep": round(float(prediction), 2)}