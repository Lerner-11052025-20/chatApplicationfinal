import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router'

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate()

	const handleEmailChange = (e) => setEmail(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log("Logging in with:", { email, password });

		axios.post('http://localhost:3334/api/login', {
			email,
			password
		})
		.then(res => {
			console.log("User Logged IN", res.data)
			localStorage.setItem('token', res.data.token)
			navigate('/dashboard')
		})
		.catch(err => console.log(err))

		setEmail("");
		setPassword("");
	};

    return (
        <div className="center-screen">
            <div className="card" role="form" aria-label="Login form">
                <h2 className="title">Log in</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="input"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="your@email.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="input"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="row" style={{justifyContent:'space-between'}}>
                        <Link to='/forgotpass' className="muted">Forgot password?</Link>
                    </div>

                    <button type="submit" className="btn btn-primary" aria-label="Submit login">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
