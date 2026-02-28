import React, { useState } from "react";
import { analyzerUser } from "../services/api";

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

      const res = await analyzerUser(username);
      setData(res.data);
    } catch (err) {
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>GitHub Analyzer 🚀</h1>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Analyze
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={styles.card}>
          <img
            src={data.profile?.avatar}
            alt="avatar"
            style={styles.avatar}
          />

          <h2>{data.profile?.name}</h2>

          <div style={styles.stats}>
            <div>
              <h3>{data.profile?.public_repos}</h3>
              <p>Repos</p>
            </div>
            <div>
              <h3>{data.profile?.followers}</h3>
              <p>Followers</p>
            </div>
            <div>
              <h3>{data.analysis?.total_stars}</h3>
              <p>Stars</p>
            </div>
          </div>

          <hr />

          <h3>Languages</h3>
          <ul>
            {data.analysis?.languages_used &&
              Object.entries(data.analysis.languages_used).map(
                ([lang, count]) => (
                  <li key={lang}>
                    {lang} — {count}
                  </li>
                )
              )}
          </ul>

          <hr />

          <h3>Top Repositories</h3>
          <ul>
            {data.analysis?.top_repositories?.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {repo.name}
                </a>{" "}
                ⭐ {repo.stars}
              </li>
            ))}
          </ul>

          <hr />

          <h3>AI Summary</h3>
          <p>{data.ai_summary}</p>

          <h3>Suggestions</h3>
          <ul>
            {data.suggestions?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center"
  },
  title: {
    marginBottom: "20px"
  },
  searchBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    padding: "8px",
    width: "60%",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#667eea",
    color: "white",
    cursor: "pointer"
  },
  card: {
    marginTop: "20px"
  },
  avatar: {
    width: "100px",
    borderRadius: "50%",
    marginBottom: "10px"
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    margin: "15px 0"
  }
};

export default Dashboard;