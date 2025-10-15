import React, { useState } from "react";
import axios from "axios";

function SignUp() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [conPass, setConPass] = useState("");

	const changeUsername = (e) => setUsername(e.target.value);
	const changeEmail = (e) => setEmail(e.target.value);
	const changePassword = (e) => setPassword(e.target.value);
	const changeConPass = (e) => setConPass(e.target.value);

	const FormSubmit = (e) => {
		e.preventDefault();
		console.log("Form Data:", {
			username,
			email,
			password,
			confirmPassword: conPass,
		});

    setUsername("");
    setEmail("");
    setPassword("");
    setConPass("");

    axios.post("http://localhost:3334/api/signup", {
      username,
      email,
      password,
    })
    .then(res => console.log("User created!", res))
    .catch(err => {
		if(err.response && err.response.data && err.response.data.message) alert(err.response.data.message)
		else alert("Something Went Wrong")
	});
	};

    return (
        <div className="center-screen">
            <div className="card" role="form" aria-label="Sign up form">
                <h2 className="title">Create account</h2>
                <form className="form" onSubmit={FormSubmit}>
                    <div className="field">
                        <label className="label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            className="input"
                            type="text"
                            value={username}
                            onChange={changeUsername}
                            placeholder="yourname"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="input"
                            type="email"
                            value={email}
                            onChange={changeEmail}
                            placeholder="you@example.com"
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
                            onChange={changePassword}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            minLength={6}
                        />
                        <span className="helper">At least 6 characters.</span>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="confirm">Confirm Password</label>
                        <input
                            id="confirm"
                            className="input"
                            type="password"
                            value={conPass}
                            onChange={changeConPass}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Create account</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
