# ml_model.py
# This is the BRAIN of the app — it decides which learning path to recommend

import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

# ── TRAINING DATA ──────────────────────────────────────
# Think of this as examples we teach the model with.
# Each row = one example learner
# Numbers = their skill scores (0-10) for:
#            [python, math, webdev, databases, ml_basics]

TRAINING_DATA = np.array([
    [2, 3, 1, 1, 0],   # → beginner
    [1, 2, 2, 1, 0],   # → beginner
    [3, 2, 1, 2, 1],   # → beginner
    [5, 6, 4, 4, 3],   # → intermediate_ml
    [6, 7, 3, 5, 4],   # → intermediate_ml
    [4, 5, 6, 4, 2],   # → intermediate_web
    [3, 4, 7, 5, 2],   # → intermediate_web
    [5, 4, 5, 7, 3],   # → intermediate_data
    [4, 5, 4, 8, 3],   # → intermediate_data
    [8, 9, 6, 7, 7],   # → advanced_ml
    [9, 8, 7, 8, 8],   # → advanced_ml
    [7, 6, 9, 7, 5],   # → advanced_web
    [6, 5, 8, 6, 4],   # → advanced_web
    [7, 7, 6, 9, 6],   # → advanced_data
    [8, 8, 5, 9, 7],   # → advanced_data
])

LABELS = [
    "beginner", "beginner", "beginner",
    "intermediate_ml", "intermediate_ml",
    "intermediate_web", "intermediate_web",
    "intermediate_data", "intermediate_data",
    "advanced_ml", "advanced_ml",
    "advanced_web", "advanced_web",
    "advanced_data", "advanced_data",
]

# ── WHAT EACH PATH CONTAINS ────────────────────────────
LEARNING_PATHS = {
    "beginner": {
        "title": "🌱 Foundations First",
        "weeks": 8,
        "topics": [
            {"name": "Python Basics", "url": "https://python.org/about/gettingstarted/", "priority": "High"},
            {"name": "Math for CS - Khan Academy", "url": "https://khanacademy.org/math", "priority": "High"},
            {"name": "HTML & CSS - MDN", "url": "https://developer.mozilla.org/en-US/docs/Learn", "priority": "Medium"},
            {"name": "SQL Basics - SQLZoo", "url": "https://sqlzoo.net/", "priority": "Medium"},
            {"name": "Git & GitHub", "url": "https://learngitbranching.js.org/", "priority": "High"},
        ]
    },
    "intermediate_ml": {
        "title": "🤖 Machine Learning Track",
        "weeks": 12,
        "topics": [
            {"name": "NumPy & Pandas", "url": "https://pandas.pydata.org/docs/getting_started/", "priority": "High"},
            {"name": "Scikit-learn Tutorial", "url": "https://scikit-learn.org/stable/tutorial/", "priority": "High"},
            {"name": "Statistics for ML (Free Book)", "url": "https://statlearning.com/", "priority": "High"},
            {"name": "Matplotlib Visualization", "url": "https://matplotlib.org/stable/tutorials/", "priority": "Medium"},
            {"name": "Kaggle Competitions", "url": "https://kaggle.com/competitions", "priority": "Medium"},
        ]
    },
    "intermediate_web": {
        "title": "🌐 Full Stack Web Track",
        "weeks": 10,
        "topics": [
            {"name": "React.js Official Docs", "url": "https://react.dev/learn", "priority": "High"},
            {"name": "FastAPI Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "priority": "High"},
            {"name": "PostgreSQL Tutorial", "url": "https://postgresqltutorial.com/", "priority": "High"},
            {"name": "REST API Design", "url": "https://restfulapi.net/", "priority": "Medium"},
            {"name": "Docker Basics", "url": "https://docs.docker.com/get-started/", "priority": "Medium"},
        ]
    },
    "intermediate_data": {
        "title": "📊 Data Engineering Track",
        "weeks": 10,
        "topics": [
            {"name": "Advanced SQL", "url": "https://mode.com/sql-tutorial/", "priority": "High"},
            {"name": "Apache Spark Intro", "url": "https://spark.apache.org/docs/latest/quick-start.html", "priority": "High"},
            {"name": "Python ETL Pipelines", "url": "https://realpython.com/python-etl/", "priority": "High"},
            {"name": "Airflow Orchestration", "url": "https://airflow.apache.org/docs/", "priority": "Medium"},
            {"name": "Data Warehouse Concepts", "url": "https://datawarehouse4u.info/", "priority": "Medium"},
        ]
    },
    "advanced_ml": {
        "title": "🧠 Deep Learning & AI",
        "weeks": 16,
        "topics": [
            {"name": "Deep Learning - fast.ai", "url": "https://course.fast.ai/", "priority": "High"},
            {"name": "PyTorch Tutorials", "url": "https://pytorch.org/tutorials/", "priority": "High"},
            {"name": "HuggingFace NLP Course", "url": "https://huggingface.co/course/", "priority": "High"},
            {"name": "MLOps with MLflow", "url": "https://mlflow.org/docs/latest/", "priority": "Medium"},
            {"name": "ArXiv Research Papers", "url": "https://arxiv.org/list/cs.LG/recent", "priority": "Medium"},
        ]
    },
    "advanced_web": {
        "title": "⚡ Senior Engineer Track",
        "weeks": 14,
        "topics": [
            {"name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer", "priority": "High"},
            {"name": "Microservices Architecture", "url": "https://microservices.io/", "priority": "High"},
            {"name": "Kubernetes Tutorials", "url": "https://kubernetes.io/docs/tutorials/", "priority": "Medium"},
            {"name": "GraphQL Docs", "url": "https://graphql.org/learn/", "priority": "Medium"},
            {"name": "Web Performance - web.dev", "url": "https://web.dev/performance/", "priority": "High"},
        ]
    },
    "advanced_data": {
        "title": "🏗️ Data Architecture Track",
        "weeks": 14,
        "topics": [
            {"name": "Data Lakes - AWS Guide", "url": "https://aws.amazon.com/big-data/datalakes-and-analytics/", "priority": "High"},
            {"name": "Apache Kafka Docs", "url": "https://kafka.apache.org/documentation/", "priority": "High"},
            {"name": "dbt (Data Build Tool)", "url": "https://docs.getdbt.com/", "priority": "High"},
            {"name": "BigQuery / Snowflake", "url": "https://cloud.google.com/bigquery/docs", "priority": "Medium"},
            {"name": "Data Governance - DAMA", "url": "https://dama.org/", "priority": "Medium"},
        ]
    },
}


# ── THE MODEL CLASS ────────────────────────────────────
class LearningPathModel:
    def __init__(self):
        # StandardScaler: makes all scores fair (so python=8 and math=8 are treated equally)
        self.scaler = StandardScaler()
        # KNN with k=3: look at 3 closest matching learners and vote
        self.model = KNeighborsClassifier(n_neighbors=3)
        self._train()

    def _train(self):
        # Step 1: normalize the data
        X_scaled = self.scaler.fit_transform(TRAINING_DATA)
        # Step 2: teach the model
        self.model.fit(X_scaled, LABELS)
        print("✅ ML Model ready!")

    def predict(self, scores: dict) -> dict:
        # Convert dict to array in the right order
        features = np.array([[
            scores.get("python", 0),
            scores.get("math", 0),
            scores.get("webdev", 0),
            scores.get("databases", 0),
            scores.get("ml_basics", 0),
        ]])

        # Normalize with same scaler used in training
        X_scaled = self.scaler.transform(features)

        # Get prediction
        label = self.model.predict(X_scaled)[0]

        # Get confidence based on distance to nearest neighbor
        distances, _ = self.model.kneighbors(X_scaled)
        confidence = round(max(0, 1 - distances[0][0] / 10) * 100, 1)

        skill_keys = ["python", "math", "webdev", "databases", "ml_basics"]
        overall = round(sum(scores.get(k, 0) for k in skill_keys) / 5, 1)

        return {
            "path_label": label,
            "path": LEARNING_PATHS[label],
            "confidence": confidence,
            "overall_score": overall,
            "strengths": [k for k in skill_keys if scores.get(k, 0) >= 7],
            "weaknesses": [k for k in skill_keys if scores.get(k, 0) <= 3],
        }


# Create one shared model instance (loaded once when server starts)
model = LearningPathModel()