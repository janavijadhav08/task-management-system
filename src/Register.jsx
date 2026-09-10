import { useState } from "react";

function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Account created successfully!");
    goToLogin();
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>TaskFlow</span>
        </div>

        <div className="visual-content">
          <span className="eyebrow">GET STARTED</span>

          <h1>
            Plan better.
            <br />
            <span>Work smarter.</span>
          </h1>

          <p>
            Create your TaskFlow account and organize
            your work in one simple workspace.
          </p>

          <div className="visual-features">
            <div>
              <div className="feature-icon">✓</div>
              <div>
                <strong>Create tasks</strong>
                <span>Keep track of everything you need to do.</span>
              </div>
            </div>

            <div>
              <div className="feature-icon">↗</div>
              <div>
                <strong>Track progress</strong>
                <span>Monitor your work from one dashboard.</span>
              </div>
            </div>

            <div>
              <div className="feature-icon">⚡</div>
              <div>
                <strong>Be productive</strong>
                <span>Focus on your goals and get things done.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="visual-footer">
          © 2026 TaskFlow. Manage smarter.
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">

          <div className="mobile-brand">
            <div className="brand-icon">✓</div>
            <span>TaskFlow</span>
          </div>

          <div className="form-heading">
            <h2>Create your account</h2>
            <p>
              Start managing your tasks with TaskFlow.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <span>♙</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span>●</span>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Confirm password</label>

              <div className="input-wrapper">
                <span>●</span>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>
            </div>

            <label className="remember">
              <input type="checkbox" required />
              <span>
                I agree to the Terms & Privacy Policy
              </span>
            </label>

            <button type="submit" className="login-btn">
              Create account
              <span>→</span>
            </button>

          </form>

          <div className="signup-text">
            Already have an account?

            <button
              type="button"
              onClick={goToLogin}
            >
              Sign in
            </button>
          </div>

          <div className="security-note">
            <span>🔒</span>
            Your information is securely protected.
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;