import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Auth.css";

interface ProfileData {
  // Common fields
  name: string;
  website?: string;
  description: string;

  // Publisher-specific fields
  newsletterName?: string;
  subscriberCount?: string;
  category?: string;
  publishingFrequency?: string;

  // Advertiser-specific fields
  companyName?: string;
  industry?: string;
  targetAudience?: string;
  budget?: string;
}

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    website: "",
    description: "",
    newsletterName: "",
    subscriberCount: "",
    category: "",
    publishingFrequency: "",
    companyName: "",
    industry: "",
    targetAudience: "",
    budget: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fetch profile from backend
    (async () => {
      try {
        const profile = await authService.getProfile();
        setProfileData({
          name: profile.name || "",
          website: profile.website || "",
          description: profile.description || "",
          newsletterName: profile.newsletter_name || "",
          subscriberCount: profile.subscriber_count || "",
          category: profile.category || "",
          publishingFrequency: profile.publishing_frequency || "",
          companyName: profile.company_name || "",
          industry: profile.industry || "",
          targetAudience: profile.target_audience || "",
          budget: profile.budget || "",
        });
      } catch (err) {
        // It's ok if there's no profile yet
      }
    })();
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Submitting profile data:", profileData);

      // Save profile to backend
      const updatedUser = await authService.updateProfile({
        name: profileData.name,
        website: profileData.website,
        description: profileData.description,
        newsletter_name: profileData.newsletterName,
        subscriber_count: profileData.subscriberCount,
        category: profileData.category,
        publishing_frequency: profileData.publishingFrequency,
        company_name: profileData.companyName,
        industry: profileData.industry,
        target_audience: profileData.targetAudience,
        budget: profileData.budget,
      });

      console.log("Profile saved successfully:", updatedUser);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const isPublisher = user.role === "publisher";
  const isAdvertiser = user.role === "advertiser";

  return (
    <div className="profile-setup-container">
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <div className="auth-header">
          <h2 className="auth-title">Complete Your Profile</h2>
          <p className="auth-subtitle">
            {isPublisher
              ? "Tell us about your newsletter to help advertisers find you"
              : "Tell us about your company to help publishers understand your needs"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              {isPublisher ? "Your Name" : "Contact Name"}
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="website" className="form-label">
              Website (Optional)
            </label>
            <input
              type="url"
              id="website"
              className="form-input"
              value={profileData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              {isPublisher ? "Newsletter Description" : "Company Description"}
            </label>
            <textarea
              id="description"
              className="form-input"
              rows={4}
              value={profileData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={
                isPublisher
                  ? "Describe what your newsletter covers and who it's for..."
                  : "Describe your company and what you do..."
              }
              required
            />
          </div>

          {/* Publisher-specific fields */}
          {isPublisher && (
            <>
              <div className="form-group">
                <label htmlFor="newsletterName" className="form-label">
                  Newsletter Name
                </label>
                <input
                  type="text"
                  id="newsletterName"
                  className="form-input"
                  value={profileData.newsletterName}
                  onChange={(e) =>
                    handleInputChange("newsletterName", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subscriberCount" className="form-label">
                  Subscriber Count
                </label>
                <select
                  id="subscriberCount"
                  className="form-input"
                  value={profileData.subscriberCount}
                  onChange={(e) =>
                    handleInputChange("subscriberCount", e.target.value)
                  }
                  required
                >
                  <option value="">Select range</option>
                  <option value="1-1000">1 - 1,000</option>
                  <option value="1001-5000">1,001 - 5,000</option>
                  <option value="5001-10000">5,001 - 10,000</option>
                  <option value="10001-50000">10,001 - 50,000</option>
                  <option value="50001+">50,001+</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  className="form-input"
                  value={profileData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="health">Health & Wellness</option>
                  <option value="finance">Finance</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="publishingFrequency" className="form-label">
                  Publishing Frequency
                </label>
                <select
                  id="publishingFrequency"
                  className="form-input"
                  value={profileData.publishingFrequency}
                  onChange={(e) =>
                    handleInputChange("publishingFrequency", e.target.value)
                  }
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </>
          )}

          {/* Advertiser-specific fields */}
          {isAdvertiser && (
            <>
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="form-input"
                  value={profileData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry" className="form-label">
                  Industry
                </label>
                <select
                  id="industry"
                  className="form-input"
                  value={profileData.industry}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                  required
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="targetAudience" className="form-label">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  className="form-input"
                  value={profileData.targetAudience}
                  onChange={(e) =>
                    handleInputChange("targetAudience", e.target.value)
                  }
                  placeholder="e.g., Small business owners, Tech professionals"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget" className="form-label">
                  Monthly Ad Budget
                </label>
                <select
                  id="budget"
                  className="form-input"
                  value={profileData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="100-500">$100 - $500</option>
                  <option value="501-1000">$501 - $1,000</option>
                  <option value="1001-5000">$1,001 - $5,000</option>
                  <option value="5001-10000">$5,001 - $10,000</option>
                  <option value="10000+">$10,000+</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
