import "./Profile.css";
import { useEffect, useState } from "react";
import axios from "axios";

function authHeader(){
    const token = localStorage.getItem("token");
    return token ? {Authorization: 'Bearer${token}'}: {};
}

function Profile(){
    //get logged in user id from local storage
    const userId = localStorage.getItem("userId");

   const [form, setForm] = useState({
        full_name: "",
        email: "",
        bio: "",
        savings_goal: "",
        savings_amount: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    //load saved profile when page opens
    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8000/profile/${userId}`, { headers: authHeader() })
            .then(res => {
                const d = res.data;
                setForm({
                    full_name: d.full_name || "",
                    email: d.email || "",
                    bio: d.bio || "",
                    savings_goal: d.savings_goal ?? "",
                    savings_amount: d.savings_amount ?? "",
                });
            })
            .catch(() => setError("Could not load profile."))
            .finally(() => setLoading(false));
    }, [userId]);
 
    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
 
    async function handleSave() {
        setSaving(true);
        setMessage("");
        setError("");
        try {
            await axios.put(
                `http://localhost:8000/profile/${userId}`,
                {
                    ...form,
                    savings_goal: parseFloat(form.savings_goal) || 0,
                    savings_amount: parseFloat(form.savings_amount) || 0,
                },
                { headers: authHeader() }
            );
            setMessage("Profile saved!");
            setTimeout(() => setMessage(""), 3000);
        } catch {
            setError("Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    }
 
    const username = localStorage.getItem("username") || "User";
    const initials = username.slice(0, 2).toUpperCase();
 
    if (loading) return <div className="profile-page"><p className="profile-loading">Loading...</p></div>;
 
    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-avatar">{initials}</div>
                <h1>@{username}</h1>
 
                <div className="profile-section-label">Personal info</div>
 
                <div className="profile-field">
                    <label>Full name</label>
                    <input
                        name="full_name"
                        placeholder="Your full name"
                        value={form.full_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="profile-field">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="profile-field">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        placeholder="Tell us a little about yourself..."
                        value={form.bio}
                        onChange={handleChange}
                    />
                </div>
 
                <div className="profile-section-label">Savings tracker</div>
 
                <div className="profile-row">
                    <div className="profile-field">
                        <label>Savings goal (£)</label>
                        <input
                            name="savings_goal"
                            type="number"
                            placeholder="0.00"
                            value={form.savings_goal}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Current amount (£)</label>
                        <input
                            name="savings_amount"
                            type="number"
                            placeholder="0.00"
                            value={form.savings_amount}
                            onChange={handleChange}
                        />
                    </div>
                </div>
 
                {form.savings_goal > 0 && (
                    <div className="savings-progress">
                        <div className="savings-bar-track">
                            <div
                                className="savings-bar-fill"
                                style={{ width: `${Math.min(100, (form.savings_amount / form.savings_goal) * 100).toFixed(1)}%` }}
                            />
                        </div>
                        <p className="savings-label">
                            £{parseFloat(form.savings_amount || 0).toFixed(2)} of £{parseFloat(form.savings_goal || 0).toFixed(2)} saved
                            &nbsp;({Math.min(100, ((form.savings_amount / form.savings_goal) * 100)).toFixed(1)}%)
                        </p>
                    </div>
                )}
 
                {message && <p className="profile-success">{message}</p>}
                {error && <p className="profile-error">{error}</p>}
 
                <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save changes"}
                </button>
            </div>
        </div>
    );
}
 
export default Profile;
