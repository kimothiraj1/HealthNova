from pydantic import BaseModel
from typing import Literal

class SleepPredictionInput(BaseModel):
    Gender: Literal["Male", "Female"]
    Age: int
    Sleep_Duration: float
    Physical_Activity_Level: int
    Stress_Level: int
    BMI_Category: Literal["Normal", "Overweight", "Obese"]
    Heart_Rate: int
    Daily_Steps: int
    Systolic_BP: int
    Diastolic_BP: int
    Occupation: Literal[
        "Accountant", "Doctor", "Engineer", "Lawyer", "Manager",
        "Nurse", "Sales Representative", "Salesperson", "Scientist",
        "Software Engineer", "Teacher"
    ]