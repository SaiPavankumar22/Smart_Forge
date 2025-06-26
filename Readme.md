# Manufacturing Industry Predictive Analysis Web Application

## Problem Statement
Manufacturing industries face challenges in ensuring material quality in manufacturing processes. Defects increase costs and reduce efficiency. Our application uses predictive models to analyze material properties, detect defects, predict product lifespan, machine failures, and provide actionable recommendations, improving quality control and reducing waste.

## Features

### User Dashboard
- Users must log in to their accounts.
- The opening page displays:
  - Previous prediction details.
  - Bookmarked educational material.
  - User notifications and website announcements.
  - Major breakthroughs in the manufacturing industry.

### Sidebar Navigation
The sidebar consists of three primary sections:

#### 1) Predictive Models
This section includes four major models specifically designed for rolling process manufacturing industries:
- **Material Prediction**: 
  - **Property Prediction**: Users select a material and input parameters within a given range. The model predicts output parameters such as Ultimate Tensile Strength (UTS), elongation, etc.
  - **Defect Detection**: Users upload an image of a surface defect. The model identifies the defect type and provides solutions to overcome the issue.
- **Product Lifespan Prediction**: Predicts the lifespan of a product based on multiple manufacturing conditions.
- **Machine Failure Prediction**: Uses real-time sensor data from actual machines to detect failure types (mechanical failure, operational failure, or no failure).

#### 2) Report Analysis
- Users upload an industry report.
- The system generates graphical visualizations of the data.
- AI-driven insights and suggestions are provided based on the report analysis.

#### 3) Educational Overview
This section bridges the gap between industries and students interested in manufacturing by providing detailed educational resources. It is divided into four segments:
- **Manufacturing Processes**: Detailed explanations of different manufacturing techniques.
- **Machines & Tools**: Information on various machines and tools used in the industry.
- **Case Studies**: Real-world projects and industrial case studies.
- **3D Visualization**: Video representations of manufacturing processes for better understanding.

### AI Chatbot
- A chatbot is integrated into the platform to assist users.
- It can answer queries related to mechanical engineering and industrial processes.
- The chatbot is not restricted to website-based queries but provides broader knowledge in the domain.

## Technology Stack
- **Backend**: Flask with MongoDB for data storage.
- **Frontend**: HTML, CSS, Bootstrap, and Chart.js for data visualization.
- **Machine Learning Models**: Used for predictive analysis (material properties, defects, lifespan, and failures).
- **AI Insights**: Integrated with LLaVA for intelligent recommendations.

## Conclusion
This web application serves as a powerful tool for manufacturing industries, helping them improve quality control, reduce waste, and optimize performance through predictive analysis and AI-driven insights. Additionally, it provides educational resources to bridge the knowledge gap between students and industry professionals.
