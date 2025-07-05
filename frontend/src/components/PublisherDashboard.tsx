import React, { useEffect, useState } from "react";
import "../pages/Auth.css";
import { authService } from "../services/authService";

const PublisherDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "active" | "inprogress" | "complete"
  >("active");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await authService.getPublisherRequests();
        setRequests(data);
      } catch (err: any) {
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleRequestAction = async (requestId: number, status: string) => {
    try {
      await authService.updateRequestStatus(requestId, status);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: status === "declined" ? "rejected" : status }
            : req
        )
      );
    } catch (err) {
      // Optionally show error
    }
  };

  // Filter requests based on selected tab
  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    if (filter === "active") return req.status === "pending";
    if (filter === "inprogress") return req.status === "accepted";
    if (filter === "complete")
      return req.status === "rejected" || req.status === "completed";
    return true;
  });

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
          {user.newsletter_name && <p>Managing: {user.newsletter_name}</p>}
        </div>
        <span className={`account-type-badge ${user.role}`}>
          {user.role === "publisher" ? "Publisher" : "Advertiser"}
        </span>
      </div>

      <div className="request-filter-tabs">
        <button
          className={`request-filter-tab${filter === "all" ? " active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`request-filter-tab${
            filter === "active" ? " active" : ""
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`request-filter-tab${
            filter === "inprogress" ? " active" : ""
          }`}
          onClick={() => setFilter("inprogress")}
        >
          In Progress
        </button>
        <button
          className={`request-filter-tab${
            filter === "complete" ? " active" : ""
          }`}
          onClick={() => setFilter("complete")}
        >
          Complete/Inactive
        </button>
      </div>

      {loading ? (
        <div>Loading requests...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">
          <p>No requests in this category.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {filteredRequests.map((request) => (
            <div className="request-card">
              <div className="request-card-header">
                <div className="request-card-title">
                  {request.advertiser?.company_name ||
                    request.advertiser?.name ||
                    request.advertiser?.email}
                </div>
                <span className="request-card-date">
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <hr className="request-card-divider" />
              <div className="request-card-message">{request.message}</div>
              <div className="request-card-bottom-row">
                <div className="request-card-budget">
                  Budget: {request.budget || "—"}
                </div>
                <span className={`request-status-badge ${request.status}`}>
                  {request.status === "pending"
                    ? "Pending"
                    : request.status === "accepted"
                    ? "Accepted"
                    : request.status === "completed"
                    ? "Completed"
                    : "Declined"}
                </span>
              </div>
              {request.status === "pending" || request.status === "accepted" ? (
                <div className="request-actions">
                  {request.status === "pending" ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleRequestAction(request.id, "accepted")
                        }
                        disabled={request.status !== "pending"}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          handleRequestAction(request.id, "declined")
                        }
                        disabled={request.status !== "pending"}
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleRequestAction(request.id, "completed")
                      }
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublisherDashboard;
