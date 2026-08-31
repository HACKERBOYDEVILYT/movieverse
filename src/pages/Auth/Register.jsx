import { Link } from "react-router-dom";

export default function Register() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">JOIN MOVIEVERSE</span>

        <h1>Create account</h1>

        <p>Registration system will be connected in the next phase.</p>

        <Link to="/" className="auth-button">
          Back to Home
        </Link>

        <Link to="/login" className="auth-secondary">
          Already have an account?
        </Link>
      </div>
    </main>
  );
}
