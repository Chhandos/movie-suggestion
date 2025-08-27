from flask import Flask,jsonify,request
from model.main import load_model
from flask_cors import CORS  # ✅ Add this line


app=Flask(__name__)
CORS(app)  # ✅ This enables CORS for all routes and origins


newdf,similarity_matrix,movies=load_model()





@app.route("/recommend",methods=["POST"])

def recommend_movie():
    print("api hit")
    data=request.get_json()
    print("Received data from frontend:", data)  # Add this

    if not data or "movie" not in data:
        return jsonify({"error": "Movie title needed"}),400
    
    movie=data["movie"]



    if movie not in newdf["title"].values:
        return jsonify({"error": "Movie not found"}),404
    
    try:
        index = newdf[newdf["title"] == movie].index[0]
        distances = similarity_matrix[index]
        movie_indices = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:9]
        indices=[i[0] for i in movie_indices]
        recommended_movies=movies.iloc[indices]#rturns dataframe
        result=recommended_movies.to_dict(orient="records")#convert the df to list of dict
        return jsonify({"recommended":result}),200    

    except Exception as e:
        print(f"Error in recommendation: {e}")  # Add this line

        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)



#result = [


#   {
#     "id": 101,
#     "title": "Iron Man 2",
#     "overview": "With the world now aware...",
#     "genres": ["Action"],
#     "keywords": ["armor", "..."],
#     "cast": ["Tony", "..."],
#     "crew": ["Jon"]
#   },
#   {
#     "id": 102,
#     "title": "Thor",
#     "overview": "The powerful but arrogant...",
#     "genres": ["Adventure"],
#     "keywords": ["god", "..."],
#     "cast": ["Thor", "..."],
#     "crew": ["Kenneth"]
#   }
# ]



        # print(f"\nTop 5 recommendations for '{movie}':")
        # for i in movie_list:
        # print(newdf.iloc[i[0]].title)



# Python dict = JSON object.

# Python list = JSON array.

