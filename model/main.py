import numpy as np
import pandas as pd
import ast
import nltk
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity




def load_model():
    ps = PorterStemmer()
    def stem(obj):
       return " ".join([ps.stem(i) for i in obj.split()])
    movies = pd.read_csv("model/tmdb_5000_movies.csv")
    credit = pd.read_csv("model/tmdb_5000_credits.csv")

    movies = pd.merge(movies, credit, on="title")
    movies = movies[["id", "title", "overview", "genres", "keywords", "cast", "crew"]]
    movies.dropna(inplace=True)

    def convert(obj):
        L = []
        for i in ast.literal_eval(obj):
            L.append(i["name"])
        return L

    def convert3(obj):
        L = []
        counter = 0
        for i in ast.literal_eval(obj):
            if counter < 3:
                L.append(i["name"])
                counter += 1
            else:
                break
        return L

    def fetch_director(obj):
        L = []
        for i in ast.literal_eval(obj):
            if i["job"] == "Director":
                L.append(i["name"])
        return L

    movies["genres"] = movies["genres"].apply(convert)
    movies["keywords"] = movies["keywords"].apply(convert)
    movies["cast"] = movies["cast"].apply(convert3)
    movies["crew"] = movies["crew"].apply(fetch_director)
    movies["overview"] = movies["overview"].apply(lambda x: x.split())

    movies["cast"] = movies["cast"].apply(lambda x: [i.replace(" ", "") for i in x])
    movies["genres"] = movies["genres"].apply(lambda x: [i.replace(" ", "") for i in x])
    movies["keywords"] = movies["keywords"].apply(lambda x: [i.replace(" ", "") for i in x])
    movies["crew"] = movies["crew"].apply(lambda x: [i.replace(" ", "") for i in x])

    movies["tags"] = movies["overview"] + movies["genres"] + movies["keywords"] + movies["cast"] + movies["crew"]

    newdf = movies[["id", "title", "tags"]].copy()
    newdf["tags"] = newdf["tags"].apply(lambda x: " ".join(x))
    newdf["tags"] = newdf["tags"].apply(lambda x: x.lower())
    newdf["tags"] = newdf["tags"].apply(stem)

    cv = CountVectorizer(max_features=5000, stop_words="english")
    vectors = cv.fit_transform(newdf["tags"]).toarray()

    similarity_matrix = cosine_similarity(vectors)

    return newdf, similarity_matrix,movies


# def recommend(movie, newdf, similarity_matrix):
#     index = newdf[newdf["title"] == movie].index[0]
#     distances = similarity_matrix[index]
#     movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:9]

#     print(f"\nTop 5 recommendations for '{movie}':")
#     for i in movie_list:
#         print(newdf.iloc[i[0]].title)


# # Example usage:
# # 
