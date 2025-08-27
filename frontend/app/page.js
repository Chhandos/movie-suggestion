"use client"
import React, { useState, useEffect } from 'react'

const Page = () => {
const apikey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const [maincast, setMaincast] = useState([])
  const [search, setSearch] = useState({ movie: "" })
  const [posterpath, setPosterPath] = useState([])
  const [heroimg, setHeroImg] = useState(null)
  const [mainid, setMainId] = useState(null)
  const [maindetails, setMainDetails] = useState({})
  const [movielist, setMovieList] = useState([])
  const [loading, setLoading] = useState(false)

  const getMoviePoster = async (movieName) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${encodeURIComponent(movieName)}`);
      const data = await res.json();
      const movie = data.results[0];
      return {
        title: movie.title,
        poster_path: movie.poster_path,
        id: movie.id,
        release_date: movie.release_date,
        overview: movie.overview,
        popularity: movie.vote_average
      }
    } catch (err) {
      console.error("TMDb API error:", err);
      return null;
    }
  };

  const getMainCastDetail = async (id) => {
    try { 
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apikey}`);
      const info = await res.json()
      const cast = info.cast.slice(0, 5).map(member => ({
        name: member.name,
        profile_path: `https://image.tmdb.org/t/p/w500${member.profile_path}`
      }))
      setMaincast(cast)
    } catch (err) {
      console.error("TMDb API error:", err)
    }
  }

  const getHeroImage = async (movieName) => {
    const path = await getMoviePoster(movieName);
    if (!path) return;

    const pathLink = `https://image.tmdb.org/t/p/w500${path.poster_path}`;
    setHeroImg(pathLink);
    setMainDetails(path);
    setMainId(path.id);
    await getMainCastDetail(path.id);
  }

  const getImages = async (list) => {
    const paths = await Promise.all(list.map(async (movie) => {
      const path = await getMoviePoster(movie.title);
      return {
        title: movie.title,
        path: `https://image.tmdb.org/t/p/w500${path.poster_path}`
      }
    }))
    setPosterPath(paths);
  }

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  }

  const fetchRecommendation = async (movieName) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moviename: movieName })
      });
      const data = await res.json();
      if (res.ok) {
        const list = data.recommended;
        setMovieList(list);
        await getImages(list);
        await getHeroImage(movieName);
      } else {
        console.log(data.error);
      }
    } catch (err) {
      console.error("Recommendation error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleClick = async () => {
    await fetchRecommendation(search.movie);
  }

  const handleRecommendationClick = async (title) => {
    // setSearch({ movie: title });
    await fetchRecommendation(title);
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {/* Navbar */}
      <div className="navbar h-20 bg-blue-950 flex items-center justify-between px-6">
        <div className="text-2xl font-bold">🎬 Movie Recommender</div>
        <div className="flex items-center gap-4 w-full max-w-xl">
          <input
            onChange={handleChange}
            name="movie"
            type="text"
            placeholder="Enter a movie name..."
            className="flex-1 px-4 py-2 rounded-lg text-black outline-none bg-white"
          />
          <button
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading screen */}
      {loading && (
        <div className="text-center py-12 text-lg animate-pulse">Loading...</div>
      )}

      {/* Hero Section */}
      {!loading && heroimg && (
        <div className="herosection container mx-auto py-10 px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <img
              src={heroimg}
              alt="Hero Poster"
              className="max-h-[500px] w-auto object-contain rounded-xl shadow-xl"
            />
            <div className="space-y-6 text-lg">
              <h1 className="text-3xl font-bold">{maindetails.title}</h1>
              <p><span className="font-semibold">Release Date:</span> {maindetails.release_date}</p>
              <p><span className="font-semibold">Overview:</span> {maindetails.overview}</p>
              <p><span className="font-semibold">User Rating:</span> {maindetails.popularity}</p>
            </div>
          </div>

          {/* Cast Section */}
         {maincast.length > 0 && (
  <div className="mt-12">
    <h2 className="text-2xl font-semibold mb-4 text-center">Main Cast</h2>
    <div className="flex overflow-x-auto space-x-6 px-2">
      {maincast.map((cast, index) =>
        cast.profile_path && (
          <div
            key={index}
            className="min-w-[150px] bg-gray-900 rounded-2xl overflow-hidden shadow-md flex-shrink-0"
          >
            <img
              src={cast.profile_path}
              alt={cast.name}
              className="w-full h-[200px] object-cover"
            />
            <p className="p-2 text-center text-white">{cast.name}</p>
          </div>
        )
      )}
    </div>
  </div>
)}

        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && posterpath.length !== 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-center text-3xl font-semibold mb-6">Other Movies You Might Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posterpath.map((movie, index) => (
              <div
                onClick={() => handleRecommendationClick(movie.title)}
                key={index}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-gray-800 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={movie.path}
                  alt={movie.title}
                  className="w-auto h-full object-cover"
                />
                <div className="p-4 text-center">
                  <p className="text-lg font-medium text-white">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page;
