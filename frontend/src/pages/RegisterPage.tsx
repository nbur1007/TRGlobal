import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../api/user";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  // One state variable per field. These are "controlled inputs" — React
  // holds the value, the input displays it, onChange keeps them in sync.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      try {
        console.log({ name, email, password });
        await createUser({ name, email, password });
      } catch (err) {
        setError("Registration Failed");
        return;
      }

      try {
        await login({ email, password });
        navigate("/");
      } catch {
        navigate("/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <h1>Create an account</h1>
      <div className="user-form">
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}

          <label htmlFor="name">Name:</label>
          <br></br>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
          <br></br>

          <label htmlFor="email">Email:</label>
          <br></br>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br></br>

          <label htmlFor="password">Password:</label>
          <br></br>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={10}
          />
          <br></br>

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
