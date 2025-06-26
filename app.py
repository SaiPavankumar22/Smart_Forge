from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import pandas as pd
import os
import joblib
import requests
from werkzeug.utils import secure_filename
import numpy as np
import cv2
import os
import pickle
from werkzeug.utils import secure_filename
import tensorflow as tf
import keras




app = Flask(__name__)
CORS(app)



client = MongoClient("mongodb://localhost:27017/")
db = client["smartforge"]
users_collection = db["users"]


# Handle signup form submission
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    mobile = data.get("mobile")
    password = data.get("password")

    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "Email already registered"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store user in database
    users_collection.insert_one({
        "name": name,
        "email": email,
        "mobile": mobile,
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password").encode('utf-8')

    # Check if user exists
    user = users_collection.find_one({"email": email})
    
    if user and bcrypt.checkpw(password, user["password"]):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401
    



@app.route('/')
def land():
    return render_template('landing.html')

@app.route('/home')
def home():
    return render_template('index.html')

# Serve the signup page
@app.route('/signup', methods=['GET'])
def signup_page():
    return render_template('signup1.html')

@app.route('/login')
def login_page():
    return render_template('login1.html')

@app.route('/al_3003.html')
def al_3003():
    return render_template('al_3003.html')

@app.route('/al_5052.html')
def al_5052():
    return render_template('al_5052.html')

@app.route('/al_6061.html')
def al_6061():
    return render_template('al_6061.html')

@app.route('/al_3105.html')
def al_3105():
    return render_template('al_3105.html')

@app.route('/steel_1045.html')
def steel_1045():
    return render_template('steel_1045.html')

@app.route('/stainless_steel.html')
def stainless_steel():
    return render_template('stainless_steel.html')

@app.route('/steel_hstl.html')
def steel_hstl():
    return render_template('steel_hstl.html')

@app.route('/report-analysis.html')
def report():
    return render_template('report-analysis.html')


@app.route('/failure')
def failure():
    return render_template('failure.html')

@app.route('/premium')
def premium():
    return render_template('premium.html')

@app.route('/accounts')
def accounts():
    return render_template('accounts.html')


@app.route('/lifespan')
def lifespan():
    return render_template('lifespan.html')


@app.route('/edu')
def edu():
    return render_template('edu.html')

@app.route('/manufacturing_process')
def manufacturing_process():
    return render_template('manufacturing_process.html')

@app.route('/defect')
def defect():
    return render_template('defect.html')




app.config['UPLOAD_FOLDER'] = 'static/uploads'

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


#report analysis code
def process_excel(file_path):
    df = pd.read_excel(file_path)
    

    charts = {
            "month_vs_quantity": df[['Month', 'Quantity Produced']].to_dict(orient='records'),
            "month_vs_production_rate": df[['Month', 'Production Rate']].to_dict(orient='records'),
            "shift_efficiency_vs_month": df[['Month', 'Shift Efficiency (%)']].to_dict(orient='records'),
            "month_vs_defect_rate": df[['Month', 'Defect Rate (%)']].to_dict(orient='records'),
            "month_vs_rejection_rate": df[['Month', 'Rejection Rate (%)']].to_dict(orient='records'),
            "month_vs_raw_material_inventory": df[['Month', 'Raw Material Inventory']].to_dict(orient='records'),
            "inventory_turnover_vs_month": df[['Month', 'Inventory Turnover Ratio']].to_dict(orient='records'),
            "month_vs_supplier_performance": df[['Month', 'Supplier Performance Score']].to_dict(orient='records'),
            "month_vs_ontime_delivery": df[['Month', 'On-time Delivery Rate (%)']].to_dict(orient='records'),
            "month_vs_revenue": df[['Month', 'Revenue']].to_dict(orient='records'),
            "month_vs_net_profit": df[['Month', 'Net Profit Margin (%)']].to_dict(orient='records'),
            "month_vs_equipment_uptime": df[['Month', 'Equipment Uptime (%)']].to_dict(orient='records'),
            "month_vs_maintenance_cost": df[['Month', 'Maintenance Cost']].to_dict(orient='records'),
            "month_vs_accident_rate": df[['Month', 'Accident Rate (%)']].to_dict(orient='records')
        
    }
    return charts




# Groq API Key
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# API endpoint
GROQ_URL ="https://api.groq.com/openai/v1/chat/completions"

# Function to send a request to Groq API
def ask_groq(prompt):
    payload = {
        "model": "llama3-70b-8192",  # Change the model if needed
        "messages": [
            {"role": "system", "content": "You are an AI that analyzes manufacturing data."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(GROQ_URL, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"Error: {response.status_code} - {response.text}"

# Generate insights from manufacturing data
def generate_insights(data):
    query = f"""
    Given the following manufacturing performance data:
    {data}
    Provide detailed insights.
    Note:the output should be in plain text not markdown format
    """
    return ask_groq(query)

# Generate suggestions based on insights
def generate_suggestions(insights):
    query = f"""
    Given the following insights:
    {insights}
    Provide actionable improvement suggestions.
    Note:the output should be in plain text not markdown format
    """
    return ask_groq(query)



@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    try:
        file.save(file_path)
    except PermissionError:
        print(f"Permission denied: {file_path}")
        return jsonify({"error": "Permission denied"}), 500
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        return jsonify({"error": str(e)}), 500
    try:
        chart_data = process_excel(file_path)
        insights = generate_insights(chart_data)
        suggestions = generate_suggestions(insights)
        return jsonify({"charts": chart_data, "insights": insights, "suggestions": suggestions})
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({"error": str(e)}), 500

#End of report analysis code

#start of al_3003 code


@app.route("/predict", methods=["POST"])
def predict():
    try:
        targets = ["Ultimate Tensile Strength", "Elongation", "Electrical Conductivity", "Hardness"]

        def predict_output(inputs):
            """Load ML models and make predictions."""
            input_data = pd.DataFrame([inputs])  # Convert input dictionary to DataFrame
            predictions = {}

            for target in targets:
                model_filename = f"{target.replace(' ', '_').lower()}_al_3003.pkl"
                try:
                    with open(model_filename, "rb") as f:
                        model = pickle.load(f)
                    predictions[target] = model.predict(input_data)[0]  # Predict and store result
                except Exception as e:
                        predictions[target] = f"Error loading model: {str(e)}"

            return predictions

        
        data = request.get_json()  # Get JSON input from frontend
        key_mapping = {
        'castingTemp': 'Casting Temperature (°C)',
        'homogenizationTemp': 'Cooling Temperature (°C)',
        'homogenizationTime': 'Bar Entry Temperature (°C)',
        'hotRollingTemp': 'Casting Speed (mm/min)',
        'hotRollingReduction': 'Emulsion Temperature (°C)',
        'coldRollingReduction': 'Emulsion Pressure (bar)',
        'annealingTemp': 'Emulsion Concentration (%)',
        'annealingTime': 'Quench Pressure (bar)',
        'coolingRate': 'Rolling Pressure (MPa)'}

        transformed_data = {key_mapping[key]: float(value) for key, value in data.items()}

        required_fields = ["castingTemp", "homogenizationTemp", "homogenizationTime", "hotRollingTemp", 
                           "hotRollingReduction", "coldRollingReduction", "annealingTemp", "annealingTime", "coolingRate"]
        
        
        # Ensure all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Get predictions
        predictions = predict_output(transformed_data)
        rounded_predictions = {key: round(value, 4) for key, value in predictions.items()}



        return jsonify(rounded_predictions)  # Send response as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#End of al_3003 code

#start of al_3105 code

@app.route("/al3105", methods=["POST"])
def al3105():
    try:
        targets = ["Ultimate Tensile Strength", "Elongation", "Electrical Conductivity", "Hardness"]

        def predict_output(inputs):
            """Load ML models and make predictions."""
            input_data = pd.DataFrame([inputs])  # Convert input dictionary to DataFrame
            predictions = {}

            for target in targets:
                model_filename = f"{target.replace(' ', '_').lower()}_al_3105.pkl"
                try:
                    with open(model_filename, "rb") as f:
                        model = pickle.load(f)
                    predictions[target] = model.predict(input_data)[0]  # Predict and store result
                except Exception as e:
                        predictions[target] = f"Error loading model: {str(e)}"

            return predictions

        
        data = request.get_json()  # Get JSON input from frontend
        key_mapping = {
        'castingTemp': 'Casting Temperature (°C)',
        'homogenizationTemp': 'Cooling Temperature (°C)',
        'homogenizationTime': 'Bar Entry Temperature (°C)',
        'hotRollingTemp': 'Casting Speed (mm/min)',
        'hotRollingReduction': 'Emulsion Temperature (°C)',
        'coldRollingReduction': 'Emulsion Pressure (bar)',
        'annealingTemp': 'Emulsion Concentration (%)',
        'annealingTime': 'Quench Pressure (bar)',
        'coolingRate': 'Rolling Pressure (MPa)'}

        transformed_data = {key_mapping[key]: float(value) for key, value in data.items()}

        required_fields = ["castingTemp", "homogenizationTemp", "homogenizationTime", "hotRollingTemp", 
                           "hotRollingReduction", "coldRollingReduction", "annealingTemp", "annealingTime", "coolingRate"]
        
        
        # Ensure all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Get predictions
        predictions = predict_output(transformed_data)
        rounded_predictions = {key: round(value, 4) for key, value in predictions.items()}



        return jsonify(rounded_predictions)  # Send response as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#End of al_3105 code

#start of al_5052 code
@app.route("/al5052", methods=["POST"])
def al5052():
    try:
        targets = ["Ultimate Tensile Strength", "Elongation", "Electrical Conductivity", "Hardness"]

        def predict_output(inputs):
            """Load ML models and make predictions."""
            input_data = pd.DataFrame([inputs])  # Convert input dictionary to DataFrame
            predictions = {}

            for target in targets:
                model_filename = f"{target.replace(' ', '_').lower()}_al_5052.pkl"
                try:
                    with open(model_filename, "rb") as f:
                        model = pickle.load(f)
                    predictions[target] = model.predict(input_data)[0]  # Predict and store result
                except Exception as e:
                        predictions[target] = f"Error loading model: {str(e)}"

            return predictions

        
        data = request.get_json()  # Get JSON input from frontend
        key_mapping = {
        'castingTemp': 'Casting Temperature (°C)',
        'homogenizationTemp': 'Cooling Temperature (°C)',
        'homogenizationTime': 'Bar Entry Temperature (°C)',
        'hotRollingTemp': 'Casting Speed (mm/min)',
        'hotRollingReduction': 'Emulsion Temperature (°C)',
        'coldRollingReduction': 'Emulsion Pressure (bar)',
        'annealingTemp': 'Emulsion Concentration (%)',
        'annealingTime': 'Quench Pressure (bar)',
        'coolingRate': 'Rolling Pressure (MPa)'}

        transformed_data = {key_mapping[key]: float(value) for key, value in data.items()}

        required_fields = ["castingTemp", "homogenizationTemp", "homogenizationTime", "hotRollingTemp", 
                           "hotRollingReduction", "coldRollingReduction", "annealingTemp", "annealingTime", "coolingRate"]
        
        
        # Ensure all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Get predictions
        predictions = predict_output(transformed_data)
        rounded_predictions = {key: round(value, 4) for key, value in predictions.items()}



        return jsonify(rounded_predictions)  # Send response as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#End of al_5052 code


#start of al_6061 code
@app.route("/al6061", methods=["POST"])
def al6061():
    try:
        targets = ["Ultimate Tensile Strength", "Elongation", "Electrical Conductivity", "Hardness"]

        def predict_output(inputs):
            """Load ML models and make predictions."""
            input_data = pd.DataFrame([inputs])  # Convert input dictionary to DataFrame
            predictions = {}

            for target in targets:
                model_filename = f"{target.replace(' ', '_').lower()}_al_6061.pkl"
                try:
                    with open(model_filename, "rb") as f:
                        model = pickle.load(f)
                    predictions[target] = model.predict(input_data)[0]  # Predict and store result
                except Exception as e:
                        predictions[target] = f"Error loading model: {str(e)}"

            return predictions

        
        data = request.get_json()  # Get JSON input from frontend
        key_mapping = {
        'castingTemp': 'Casting Temperature (°C)',
        'homogenizationTemp': 'Cooling Temperature (°C)',
        'homogenizationTime': 'Bar Entry Temperature (°C)',
        'hotRollingTemp': 'Casting Speed (mm/min)',
        'hotRollingReduction': 'Emulsion Temperature (°C)',
        'coldRollingReduction': 'Emulsion Pressure (bar)',
        'annealingTemp': 'Emulsion Concentration (%)',
        'annealingTime': 'Quench Pressure (bar)',
        'coolingRate': 'Rolling Pressure (MPa)'}

        transformed_data = {key_mapping[key]: float(value) for key, value in data.items()}

        required_fields = ["castingTemp", "homogenizationTemp", "homogenizationTime", "hotRollingTemp", 
                           "hotRollingReduction", "coldRollingReduction", "annealingTemp", "annealingTime", "coolingRate"]
        
        
        # Ensure all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Get predictions
        predictions = predict_output(transformed_data)
        rounded_predictions = {key: round(value, 4) for key, value in predictions.items()}



        return jsonify(rounded_predictions)  # Send response as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#End of al_6061 code


#start of Stainless steel code
@app.route("/stainless", methods=["POST"])
def Stainlesssteel():
    try:
        targets = ["Ultimate Tensile Strength", "Elongation", "Electrical Conductivity", "Hardness"]

        def predict_output(inputs):
            """Load ML models and make predictions."""
            input_data = pd.DataFrame([inputs])  # Convert input dictionary to DataFrame
            predictions = {}

            for target in targets:
                model_filename = f"{target.replace(' ', '_').lower()}_stainless_steel.pkl"
                try:
                    with open(model_filename, "rb") as f:
                        model = pickle.load(f)
                    predictions[target] = model.predict(input_data)[0]  # Predict and store result
                except Exception as e:
                        predictions[target] = f"Error loading model: {str(e)}"

            return predictions

        
        data = request.get_json()  # Get JSON input from frontend
        key_mapping = {
        'castingTemp': 'Casting Temperature (°C)',
        'homogenizationTemp': 'Cooling Temperature (°C)',
        'homogenizationTime': 'Bar Entry Temperature (°C)',
        'hotRollingTemp': 'Casting Speed (mm/min)',
        'hotRollingReduction': 'Emulsion Temperature (°C)',
        'coldRollingReduction': 'Emulsion Pressure (bar)',
        'annealingTemp': 'Emulsion Concentration (%)',
        'annealingTime': 'Quench Pressure (bar)',
        'coolingRate': 'Rolling Pressure (MPa)'}

        transformed_data = {key_mapping[key]: float(value) for key, value in data.items()}

        required_fields = ["castingTemp", "homogenizationTemp", "homogenizationTime", "hotRollingTemp", 
                           "hotRollingReduction", "coldRollingReduction", "annealingTemp", "annealingTime", "coolingRate"]
        
        
        # Ensure all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Get predictions
        predictions = predict_output(transformed_data)
        rounded_predictions = {key: round(value, 4) for key, value in predictions.items()}



        return jsonify(rounded_predictions)  # Send response as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#End of Stainless steel code

#start of steel_1045 code
@app.route("/steel1045", methods=["POST"])
def steel1045():
    try:
        targets = ["Ultimate Tensile Strength", "Elongation", "Electrical Conductivity", "Hardness"]

        def predict_output(inputs):
            """Load ML models and make predictions."""
            input_data = pd.DataFrame([inputs])  # Convert input dictionary to DataFrame
            predictions = {}

            for target in targets:
                model_filename = f"{target.replace(' ', '_').lower()}_steel_1045.pkl"
                try:
                    with open(model_filename, "rb") as f:
                        model = pickle.load(f)
                    predictions[target] = model.predict(input_data)[0]  # Predict and store result
                except Exception as e:
                        predictions[target] = f"Error loading model: {str(e)}"

            return predictions

        
        data = request.get_json()  # Get JSON input from frontend
        key_mapping = {
        'castingTemp': 'Casting Temperature (°C)',
        'homogenizationTemp': 'Cooling Temperature (°C)',
        'homogenizationTime': 'Bar Entry Temperature (°C)',
        'hotRollingTemp': 'Casting Speed (mm/min)',
        'hotRollingReduction': 'Emulsion Temperature (°C)',
        'coldRollingReduction': 'Emulsion Pressure (bar)',
        'annealingTemp': 'Emulsion Concentration (%)',
        'annealingTime': 'Quench Pressure (bar)',
        'coolingRate': 'Rolling Pressure (MPa)'}

        transformed_data = {key_mapping[key]: float(value) for key, value in data.items()}

        required_fields = ["castingTemp", "homogenizationTemp", "homogenizationTime", "hotRollingTemp", 
                           "hotRollingReduction", "coldRollingReduction", "annealingTemp", "annealingTime", "coolingRate"]
        
        
        # Ensure all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Get predictions
        predictions = predict_output(transformed_data)
        rounded_predictions = {key: round(value, 4) for key, value in predictions.items()}



        return jsonify(rounded_predictions)  # Send response as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#End of steel_1045 code


#start of steel_hsla code
@app.route("/hstl", methods=["POST"])
def steelhstl():
    try:
        targets = ["Ultimate Tensile Strength", "Elongation", "Electrical Conductivity", "Hardness"]

        def predict_output(inputs):
            """Load ML models and make predictions."""
            input_data = pd.DataFrame([inputs])  # Convert input dictionary to DataFrame
            predictions = {}

            for target in targets:
                model_filename = f"{target.replace(' ', '_').lower()}_steel_hsla.pkl"
                try:
                    with open(model_filename, "rb") as f:
                        model = pickle.load(f)
                    predictions[target] = model.predict(input_data)[0]  # Predict and store result
                except Exception as e:
                        predictions[target] = f"Error loading model: {str(e)}"

            return predictions

        
        data = request.get_json()  # Get JSON input from frontend
        key_mapping = {
        'castingTemp': 'Casting Temperature (°C)',
        'homogenizationTemp': 'Cooling Temperature (°C)',
        'homogenizationTime': 'Bar Entry Temperature (°C)',
        'hotRollingTemp': 'Casting Speed (mm/min)',
        'hotRollingReduction': 'Emulsion Temperature (°C)',
        'coldRollingReduction': 'Emulsion Pressure (bar)',
        'annealingTemp': 'Emulsion Concentration (%)',
        'annealingTime': 'Quench Pressure (bar)',
        'coolingRate': 'Rolling Pressure (MPa)'}

        transformed_data = {key_mapping[key]: float(value) for key, value in data.items()}

        required_fields = ["castingTemp", "homogenizationTemp", "homogenizationTime", "hotRollingTemp", 
                           "hotRollingReduction", "coldRollingReduction", "annealingTemp", "annealingTime", "coolingRate"]
        
        
        # Ensure all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Get predictions
        predictions = predict_output(transformed_data)
        print(predictions)
        rounded_predictions = {key: round(value, 4) for key, value in predictions.items()}



        return jsonify(rounded_predictions)  # Send response as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#End of steel_1045 code



model_filename = "best_life_span_model.pkl"
with open(model_filename, "rb") as f:
    model1 = pickle.load(f)


@app.route('/lifes', methods=['POST'])
def life():
    try:
        data = request.json  # Get JSON data from frontend
        print(data)
        
        # Convert categorical inputs (Load Type & Environment Type) into numerical values
        load_mapping = {"static": 0, "dynamic": 1, "impact": 2}
        environment_mapping = {
            "air": 0, "gaseous": 1, "liquid": 2, "radiation": 3, "thermal": 4, "vacuum": 5
        }
        
        processed_input = {
            "UTS (MPa)": float(data.get("uts", 0)),
            "Elongation (%)": float(data.get("elongation", 0)),
            "Conductivity (% IACS)": float(data.get("conductivity", 0)),
            "Hardness (Brinell HB)": float(data.get("hardness", 0)),
            "Load Conditions": load_mapping.get(data.get("load_type"), 0),
            "Environment Mode": environment_mapping.get(data.get("environment"), 0)
        }
        
        # Make prediction
        lifespan = predict_lifespan(processed_input)
        print(lifespan)
        return jsonify({"lifespan": lifespan})
    except Exception as e:
        return jsonify({"error": str(e)})
    
def predict_lifespan(input_data):
    input_df = pd.DataFrame([input_data])
    print(input_df)
    prediction = model1.predict(input_df)[0]  # Predict Life Span (months)
    return max(0, prediction)  # Ensure no negative values


model__filename = "Failure_Classification_Model.pkl"
with open(model__filename, "rb") as f:
    model2 = pickle.load(f)


# API route for predictions
@app.route("/failures", methods=["POST"])
def failures():
    try:
        # Get JSON data from request
        data = request.json

        # Ensure all required fields are provided
        required_fields = [
            "spindle_speed", "feed_rate", "cutting_depth", "vibration_levels",
            "motor_temperature", "lubrication_pressure", "ambient_temperature", "machine_usage_hours"
        ]
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing input fields"}), 400

        # Convert data to a DataFrame
        input_data = pd.DataFrame([{
            "Spindle Speed (RPM)": data["spindle_speed"],
            "Feed Rate (mm/rev)": data["feed_rate"],
            "Cutting Depth (mm)": data["cutting_depth"],
            "Vibration Levels (in/sec)": data["vibration_levels"],
            "Motor Temperature (°C)": data["motor_temperature"],
            "Lubrication Pressure (Bar)": data["lubrication_pressure"],
            "Ambient Temperature (°C)": data["ambient_temperature"],
            "Machine Usage Hours": data["machine_usage_hours"]
        }])

        # Make prediction
        prediction = model2.predict(input_data)[0]
        if(prediction == 1):
            prediction = "Mechanical Failure"
        elif(prediction == 2):
            prediction = "Operational Failure"
        elif(prediction == 3):
            prediction = "No Failure"

        return jsonify({"failure_type": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



model = tf.keras.models.load_model(r'D:\project_M\surface_defect.h5')

# Define class labels
class_labels = ["Crazing", "Inclusion", "Patches", "Pitted", "Rolled", "Scratches"]

# Groq API details
GROQ_API_KEY2 = os.environ.get("GROQ_API_KEY2")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# Function to send request to Groq API
def ask_groq(prompt):
    payload = {
        "model": "llama3-70b-8192",  # Change the model if needed
        "messages": [
            {"role": "system", "content": "You are an AI that analyzes surface defects of metal meterials."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY2}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(GROQ_URL, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
        return response.json()["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        print("Error fetching reason from Groq API:", e)
        return "Reason unavailable due to API error."

# Function to preprocess image
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    image = cv2.resize(image, (224, 224))  # Resize to model input size
    image = image / 255.0  # Normalize
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image = tf.image.resize(image, (200, 200))
    return image

# Route to handle image prediction
@app.route('/pre', methods=['POST'])
def pre():
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Preprocess image and make prediction
    image = preprocess_image(filepath)
    prediction = model.predict(image)[0]  # Get first batch result

    # Find the index of the highest probability
    max_index = np.argmax(prediction)
    defect_type = class_labels[max_index]

    # Fetch reason from Groq API
    prompt = f"Explain why {defect_type} occurs as surface defects of hot-rolled metals. Provide simple and short.Note:the output should be in plain text not markdown format"
    reason = ask_groq(prompt)

    return jsonify({'defect': defect_type, 'reason': reason})





GROQ_API_KEY3 = os.environ.get("GROQ_API_KEY3")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# Function to communicate with Groq API
def ask_groq(prompt):
    payload = {
        "model": "llama3-70b-8192",  # Use appropriate model
        "messages": [
            {"role": "system", "content": (
                "You are a highly experienced manufacturing and mechanical engineering expert. "
                "Provide clear, concise, and professional answers related to manufacturing processes, "
                "materials, mechanical systems, and industrial best practices. Keep responses simple, "
                "accurate, and to the point.IMPORTANT:strictly provide the answer in plain text not markdown format"
            )},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5,
        "max_tokens": 300
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY3}",
        "Content-Type": "application/json"
    }

    response = requests.post(GROQ_URL, json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"Error: {response.status_code} - {response.text}"

# Define Flask route for chatbot interaction
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"response": "Please enter a valid message."})

    bot_response = ask_groq(user_message)
    return jsonify({"response": bot_response})


if __name__ == '__main__':
    app.run(debug=True)
