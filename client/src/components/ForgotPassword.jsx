import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
    const [token, setToken] =useState('')
	const [resetLink, setResetLink] = useState(null); // dev only
    const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		setError(null);
		setResetLink(null);

		if (!email || !email.includes("@")) {
			setLoading(false);
			return setError("Please enter a valid email address");
		}

		try {
			const res = await axios.post("http://localhost:3334/api/forgotpassword", { email });
			setMessage(res.data.message || "Reset link generated");
			setResetLink(res.data.resetLink);
            setToken(res.data.token)
		} catch (err) {
			console.error("Forgot Password Error:", err);
			setError(err.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

    return (
        <div className="center-screen">
            <div className="card" role="form" aria-label="Forgot password form">
                <h2 className="title">Forgot password</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label" htmlFor="fp-email">Email</label>
                        <input
                            id="fp-email"
                            className="input"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>

                {error && <p className="error" role="alert">{error}</p>}
                {message && <p className="success">{message}</p>}

                {resetLink && (
                    <div className="col" style={{marginTop: 12}}>
                        <h4 className="muted" style={{margin:0}}>{resetLink}</h4>
                        <button className="btn btn-ghost" onClick={() => navigate(`/resetpassword/${token}`)}>Open reset page</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
