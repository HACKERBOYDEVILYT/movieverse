import { Link } from "react-router-dom";

export default function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">WELCOME BACK</span>

        <h1>Sign in</h1>

        <p>Login system will be connected in the next phase.</p>

        <Link to="/" className="auth-button">
          Back to Home
        </Link>

        <Link to="/register" className="auth-secondary">
          Create an account
        </Link>
      </div>
    </main>
  );
}
