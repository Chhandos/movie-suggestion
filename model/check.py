import pandas as pd

df=pd.read_csv("tmdb_5000_movies.csv")
cols=df.columns
print(df["homepage"].values[0])