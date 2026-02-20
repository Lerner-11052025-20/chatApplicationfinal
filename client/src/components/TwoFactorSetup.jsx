import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


function TwoFactorSetup() {
    const [qr, setQr] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const res = await axios.post(`${API_BASE_URL}/api/2fa/setup`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setQr(res.data.qr);
            } catch (err) {
                console.error(err);
                setMessage("Failed to load QR code.");
            } finally {
                setLoading(false);
            }
        };

        fetchQRCode();
    }, []);

    const verifyOtp = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/2fa/verify`,
                { token: otp },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setMessage(res.data.msg || "2FA Verified Successfully!");
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            console.error(err);
            setMessage("Invalid 2FA token. Please try again.");
        }
    };

    return (
        <div>
            {/* Cybersecurity Background Elements */}
            <div>
                <div>🔐</div>
                <div>🛡️</div>
                <div>💬</div>
                <div>📁</div>
            </div>

            <div>
                <div>
                    <div>
                        <div>✨</div>
                    </div>
                    <h2>Shield My Account</h2>
                    <p>Add an extra layer of security with MFA</p>
                </div>

                <div>
                    {loading ? (
                        <div>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75" /></svg>
                        </div>
                    ) : qr ? (
                        <div>
                            <img src={qr} alt="Scan QR Code" />
                        </div>
                    ) : (
                        <div>Identity vault currently unavailable.</div>
                    )}
                    <p>Scan this with Google Authenticator or Microsoft Auth.</p>
                </div>

                <form onSubmit={verifyOtp}>
                    <div>
                        <label>Verification Token</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="000000"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                    >
                        Verify & Active Protection
                    </button>
                </form>

                {message && (
                    <div>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TwoFactorSetup;
