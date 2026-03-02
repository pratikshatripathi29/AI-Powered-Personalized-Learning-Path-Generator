<pre>                                    AI-Powered Personalized Learning Path Generator

  AI-powered web app that recommends personalized learning roadmaps based on your skill assessment using KNN algorithm | React · FastAPI · scikit-learn
<img width="1787" height="849" alt="image" src="https://github.com/user-attachments/assets/99b18251-3b9b-4828-9b43-1b1c390d342c" />
<img width="1197" height="855" alt="image" src="https://github.com/user-attachments/assets/e28fa137-ce63-4d34-870e-ba4c0a71c366" />
<img width="1603" height="580" alt="Screenshot 2026-03-02 231652" src="https://github.com/user-attachments/assets/eb108c5a-d1be-418c-8b7b-1652fae99d9f" />

- Built a full-stack AI web application that generates personalized
  learning roadmaps based on user skill assessments across 5 domains

- Implemented K-Nearest Neighbors (KNN) classification using scikit-learn
  to match learner profiles against training data and predict optimal paths
  across 7 distinct learning tracks

- Designed and deployed a RESTful API using FastAPI with automatic Swagger
  documentation, data validation via Pydantic, and CORS configuration for
  cross-origin requests

- Developed an interactive React.js frontend with real-time skill sliders,
  AI confidence scores, skill gap analysis, and a progress tracking checklist

- Applied StandardScaler normalization to skill vectors before model inference,
  improving KNN classification accuracy across varied input ranges

- Engineered distance-based confidence scoring using Euclidean distances from
  KNN's nearest neighbors to communicate model certainty to end users


 Skills Section

Languages:     Python, JavaScript (ES6+)
Frontend:      React.js, HTML5, CSS3
Backend:       FastAPI, REST APIs, Pydantic
ML / AI:       scikit-learn, KNN, StandardScaler, NumPy
Tools:         Git, GitHub, VS Code, Uvicorn
Concepts:      Machine Learning, Classification, API Design,
               Component-based UI, Data Normalization


COMMANDS TO REMEMBER:
─────────────────────────────────────────
Start backend:    uvicorn main:app --reload
Start frontend:   npm start
Save to GitHub:   git add . → git commit -m "msg" → git push
─────────────────────────────────────────
URLs:
App:          http://localhost:3000
API:          http://localhost:8000
API Docs:     http://localhost:8000/docs
