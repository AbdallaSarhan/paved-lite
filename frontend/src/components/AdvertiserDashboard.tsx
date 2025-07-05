import React, { useEffect, useState } from "react";
import "../pages/Auth.css";
import { authService } from "../services/authService";
import { FaSyncAlt } from "react-icons/fa";

const AdvertiserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [budget, setBudget] = useState("");
  const [sentRequests, setSentRequests] = useState<{
    [publisherId: number]: string;
  }>({});
  const [history, setHistory] = useState<any[]>([]);
  const [tab, setTab] = useState<"explore" | "history">("explore");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      const data = await authService.getPublishers();
      setPublishers(data);
    } catch (err: any) {
      setError("Failed to load newsletters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const sent = await authService.getAdvertiserSentRequests();
      // Map publisherId to status
      const sentMap: { [publisherId: number]: string } = {};
      sent.forEach((req: any) => {
        sentMap[req.publisher_id] = req.status;
      });
      setSentRequests(sentMap);
      setHistory(sent);
    } catch (err) {
      // Ignore error for now
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const openModal = (publisher: any) => {
    setSelectedPublisher(publisher);
    setMessage("");
    setBudget("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPublisher(null);
    setMessage("");
    setBudget("");
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPublisher) return;
    setSending(true);
    try {
      await authService.sendRequest(selectedPublisher.id, message, budget);
      setNotification("Request sent successfully!");
      setSentRequests((prev) => ({
        ...prev,
        [selectedPublisher.id]: "pending",
      }));
      closeModal();
    } catch (err: any) {
      setNotification(err.message || "Failed to send request.");
    } finally {
      setSending(false);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleRefresh = () => {
    if (tab === "explore") {
      fetchPublishers();
    } else {
      fetchSentRequests();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-content">
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2>Welcome, {user.name || user.email}!</h2>
          {user.company_name && <p>Representing: {user.company_name}</p>}
        </div>
        <span className={`account-type-badge ${user.role}`}>
          {user.role === "publisher" ? "Publisher" : "Advertiser"}
        </span>
      </div>

      <div
        className="advertiser-tabs-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 0,
        }}
      >
        <div className="advertiser-tabs">
          <button
            className={`advertiser-tab${tab === "explore" ? " active" : ""}`}
            onClick={() => setTab("explore")}
          >
            Explore
          </button>
          <button
            className={`advertiser-tab${tab === "history" ? " active" : ""}`}
            onClick={() => setTab("history")}
          >
            Request History
          </button>
        </div>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          title="Refresh"
          style={{
            marginLeft: 16,
            padding: "0.5em 1em",
            borderRadius: 8,
            border: "none",
            background: "#f3f4f6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            fontSize: 18,
          }}
        >
          <FaSyncAlt style={{ marginRight: 6 }} /> Refresh
        </button>
      </div>

      {tab === "explore" && (
        <>
          <div className="explore-section-header">
            <div className="explore-section-title">Explore Newsletters</div>
            <div className="explore-section-subtitle">
              Browse and connect with top publishers to promote your brand.
            </div>
          </div>
          {notification && (
            <div className="notification-banner">{notification}</div>
          )}
          {loading ? (
            <div>Loading newsletters...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="publishers-grid">
              {publishers.length === 0 ? (
                <div>No newsletters found.</div>
              ) : (
                publishers.map((publisher) => {
                  // Use first letter of newsletter name or user name for avatar
                  const avatarLetter = (
                    publisher.newsletter_name ||
                    publisher.name ||
                    "N"
                  )
                    .charAt(0)
                    .toUpperCase();
                  return (
                    <div key={publisher.id} className="publisher-card">
                      <div className="publisher-header">
                        <div className="publisher-header-left">
                          <div className="publisher-avatar">{avatarLetter}</div>
                          <div className="publisher-title">
                            {publisher.newsletter_name || publisher.name}
                          </div>
                        </div>
                        {publisher.category && (
                          <span className="publisher-category-badge">
                            {publisher.category}
                          </span>
                        )}
                      </div>
                      <div className="publisher-description">
                        {publisher.description}
                      </div>
                      <div className="publisher-stats">
                        <div className="stat">
                          <span className="stat-label">Audience:</span>
                          <span className="stat-value">
                            {publisher.subscriber_count || "N/A"}
                          </span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Category:</span>
                          <span className="stat-value">
                            {publisher.category || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="publisher-actions"
                        style={{ justifyContent: "center" }}
                      >
                        {sentRequests[publisher.id] === "pending" ? (
                          <span className="request-status-badge pending">
                            Request Pending
                          </span>
                        ) : (
                          <button
                            className="btn-reachout"
                            onClick={() => openModal(publisher)}
                          >
                            Reach Out
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {tab === "history" && (
        <div className="advertiser-history-list">
          {history.length === 0 ? (
            <div className="empty-state">No requests yet.</div>
          ) : (
            history.map((req) => (
              <div key={req.id} className="advertiser-history-card">
                <div className="advertiser-history-header">
                  <div className="advertiser-history-title">
                    {req.publisher?.newsletter_name ||
                      req.publisher?.name ||
                      req.publisher?.email}
                  </div>
                  <span style={{ color: "#6b7280", fontSize: "0.97rem" }}>
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div
                  style={{
                    color: "#374151",
                    fontSize: "1rem",
                    marginBottom: 4,
                  }}
                >
                  {req.message}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      color: "#2563eb",
                      fontWeight: 600,
                      fontSize: "1.01rem",
                    }}
                  >
                    Budget: {req.budget}
                  </div>
                  <span
                    className={`request-status-badge ${req.status} advertiser-history-status`}
                    style={{ marginTop: 0, marginLeft: 16 }}
                  >
                    {req.status === "pending"
                      ? "Pending"
                      : req.status === "accepted"
                      ? "Accepted"
                      : req.status === "completed"
                      ? "Completed"
                      : "Declined"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {modalOpen && selectedPublisher && (
        <div className="modal-overlay show-modal">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  Reach Out to{" "}
                  {selectedPublisher.newsletter_name || selectedPublisher.name}
                </h3>
                <div className="modal-subtitle">
                  Send a message to introduce your brand and campaign.
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={closeModal}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
            </div>
            <hr className="modal-divider" />
            <form onSubmit={handleSendRequest}>
              <label className="form-label" htmlFor="reachout-message">
                Message
              </label>
              <textarea
                id="reachout-message"
                className="form-input"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message to introduce your brand and campaign..."
                required
                style={{ marginBottom: 20 }}
              />
              <label className="form-label" htmlFor="reachout-budget">
                Budget
              </label>
              <input
                id="reachout-budget"
                className="form-input"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $500-1000"
                required
                style={{ marginBottom: 20 }}
              />
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeModal}
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                  style={{ minWidth: 140 }}
                >
                  {sending ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiserDashboard;
