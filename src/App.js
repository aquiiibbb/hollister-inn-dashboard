import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import Login from "./login";
import hotelLogo2 from './assets/logo.jpg';
import bg2 from './assets/bg.gif';

function DashboardContent({ onLogout }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      console.log("🔄 Fetching feedback data...");
      const response = await axios.get("https://hollister-inn-backend.onrender.com/feedback");
      console.log("📊 Dashboard API Response:", response.data);

      const feedbackData = response.data.data || response.data;
      console.log("📋 Processed feedback data:", feedbackData);

      setData(feedbackData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Dashboard API Error:", error);
      setLoading(false);
    }
  };



  const avgRating = data.length
    ? (data.reduce((s, i) => s + i.rating, 0) / data.length).toFixed(1)
    : "—";

  const filtered = filter === "all" ? data : data.filter(d => d.rating === Number(filter));

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`https://hollister-inn-backend.onrender.com/feedback/${id}`);
        setData(data.filter(item => item._id !== id));
        alert("Feedback deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete feedback");
      }
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={hotelLogo2} alt="Hotel Logo" />
        </div>

        <nav>
          <button className="nav-item active">📋 Feedback</button>
          <button className="nav-item">📊 Analytics</button>
          <button className="nav-item">⚙️ Settings</button>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <h1>Guest Feedback Dashboard</h1>
          <span className="badge">{data.length} Total</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Stat Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{data.length}</div>
            <div className="stat-label">Total Feedback</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">{data.filter(d => d.rating < 4).length}</div>
            <div className="stat-label">Needs Attention</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">😊</div>
            <div className="stat-value">{data.filter(d => d.rating >= 4).length}</div>
            <div className="stat-label">Happy Guests</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <span>Filter by rating:</span>
          {["all", "1", "2", "3", "4", "5"].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : "★".repeat(Number(f))}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        <div className="feedback-list">
          {loading ? (
            <div className="empty">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">📭 No feedback found.</div>
          ) : (
            filtered.map((item, i) => {
              console.log("🔍 Rendering item:", item); // Debug log
              return (
                <div key={item._id || i} className={`feedback-card rating-${item.rating}`}>

                  {/* Guest Details Section */}
                  <div className="guest-details">
                    <div className="guest-info-left">
                      <div className="guest-name">
                        <span className="user-icon">👤</span>
                        <span className="name-text">
                          {item.name || "Name not provided"}
                        </span>
                      </div>
                      <div className="contact-details">
                        <div className="contact-row">
                          <span className="contact-icon">📧</span>
                          <span className="contact-value">
                            {item.email || "Email not provided"}
                          </span>
                        </div>
                        <div className="contact-row">
                          <span className="contact-icon">📱</span>
                          <span className="contact-value">
                            {item.phone || "Phone not provided"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="guest-info-right">
                      <div className="rating-display">
                        <span className="stars">
                          {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                        </span>
                        <span className="rating-number">{item.rating}/5</span>
                      </div>
                      <div className="feedback-date">
                        {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => deleteFeedback(item._id)}
                        title="Delete this feedback"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div className="feedback-message">
                    <div className="message-header">FEEDBACK:</div>
                    <div className="message-content">
                      {item.message || "No message provided"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return <DashboardContent onLogout={() => setIsLoggedIn(false)} />;
}

export default App;
