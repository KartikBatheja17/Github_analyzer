import React, { useState } from "react";
import axios from "axios";
import LanguageChart from "../components/LanguageChart";
import SkeletonCard from "../components/SkeletonCard";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username) return;

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await axios.get(
        `http://127.0.0.1:8000/api/analyze/${username}/`
      );

      console.log("API DATA:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center p-8">

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="beam beam1"></div>
        <div className="beam beam2"></div>
        <div className="beam beam3"></div>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-white">
        GitHub Analyzer
      </h1>

      {/* Search Box */}
      <div className="flex gap-2 mb-8 text-white">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border-2 rounded-lg w-40 border-pink-950"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Analyze
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Skeleton Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Real Data */}
      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">

          {/* Profile Card */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl shadow p-6 text-center text-white border-2 border-pink-950">
            <img
              src={data.profile?.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">{data.profile?.name}</h2>
            <div className="flex justify-around mt-4">
              <div>
                <p className="text-lg font-bold">{data.profile?.public_repos}</p>
                <p>Repos</p>
              </div>
              <div>
                <p className="text-lg font-bold">{data.profile?.followers}</p>
                <p>Followers</p>
              </div>
              <div>
                <p className="text-lg font-bold">{data.analysis?.total_stars}</p>
                <p>Stars</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl shadow p-6 text-center text-white border-2 border-pink-950">
            <h3 className="text-lg font-semibold mb-3">Languages</h3>
            {data.analysis?.languages_used && (
              <LanguageChart languages={data.analysis.languages_used} />
            )}
          </div>

          {/* Top Repositories */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl shadow p-6 text-center text-white border-2 border-pink-950">
            <h3 className="text-lg font-semibold mb-3">Top Repositories</h3>
            <ul className="space-y-2">
              {data.analysis?.top_repositories?.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    {repo.name}
                  </a>
                  ⭐ {repo.stars}
                </li>
              ))}
            </ul>
          </div>

          {/* Portfolio Score */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl shadow p-6 text-center text-white border-2 border-pink-950">
            <h3 className="text-lg font-semibold mb-3">Portfolio Score</h3>
            <p className="text-2xl font-bold">
              {data.analysis?.portfolio_score}/100
            </p>
            <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
              <div
                className="bg-red-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${data.analysis?.portfolio_score}%` }}
              ></div>
            </div>
          </div>

          {/* AI Developer Analysis */}
          {data.ai_analysis && (
            <div className="bg-black/50 backdrop-blur-md rounded-xl shadow p-6 text-left text-white border-2 border-pink-950 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">
                 AI Developer Analysis
              </h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {data.ai_analysis}
              </p>
            </div>
          )}

          {/* AI Summary */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl text-left text-white border-2 border-pink-950 shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-5">AI Summary</h3>
            <p>{data.summary}</p>
          </div>

          {/* Suggestions */}
          {data?.suggestions?.length > 0 && (
            <div className="bg-black/50 backdrop-blur-md rounded-xl shadow p-6 text-left text-white border-2 border-pink-950">
              <h3 className="text-lg font-semibold mb-3">Suggestions</h3>
              <ul className="list-disc ml-5 space-y-2">
                {data.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Dashboard;