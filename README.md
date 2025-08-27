Movie Suggestion System

This is a **Movie Suggestion System** built using the **Bag of Words (BoW)** approach and **Cosine Similarity** for content-based filtering.  
It combines a **Next.js frontend**, an **Express.js backend**, and a **Flask ML server** to deliver recommendations.

---

##  Tech Stack
- **Frontend:** Next.js (React-based UI)
- **Backend (API):** Express.js
- **Machine Learning Model:** Flask (Python, scikit-learn, NLP)
- **Data:** TMDB dataset (`tmdb_5000_movies.csv`, `tmdb_5000_credits.csv`)

---

##  How It Works
1. **Bag of Words (BoW) Representation**  
   - We extract important features from movies such as **title, genres, keywords, cast, crew**.  
   - These features are combined into a single string per movie.  
   - The BoW model converts these strings into a **vector representation**.

2. **Cosine Similarity**  
   - Measures the similarity between two movie vectors.  
   - If the angle between two vectors is small (cosine similarity close to 1), the movies are highly similar.  
   - This is how recommendations are generated.

3. **Flow**  
   - User searches a movie in **Next.js frontend**.  
   - Request is sent to **Express.js backend**.  
   - Express forwards the query to the **Flask ML server**.  
   - Flask finds similar movies using BoW + Cosine Similarity and returns recommendations.  
   - Results are displayed in frontend.

---


