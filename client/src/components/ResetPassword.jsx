import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

function ResetPassword() {
	const { token } = useParams()
	const navigate = useNavigate();

	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		setError(null);

		if (newPassword.length < 6) {
			setLoading(false);
			return setError("Password must be at least 6 characters");
		}
		if (newPassword !== confirmPassword) {
			setLoading(false);
			return setError("Passwords do not match");
		}

		try {
			const res = await axios.post(`http://localhost:3334/api/resetpassword/${token}`, {
				newPassword,
			});
			setMessage(res.data.message);
			setTimeout(() => navigate("/login"), 3000);
		} catch (err) {
			console.error("Reset Error:", err);
			setError(err.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

    return (
        <div className="center-screen">
            <div className="card" role="form" aria-label="Reset password form">
                <h2 className="title">Reset your password</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label" htmlFor="new-pass">New password</label>
                        <input
                            id="new-pass"
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="confirm-pass">Confirm password</label>
                        <input
                            id="confirm-pass"
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Resetting..." : "Reset password"}
                    </button>
                </form>
                {error && <p className="error" role="alert">{error}</p>}
                {message && <p className="success">{message}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;
