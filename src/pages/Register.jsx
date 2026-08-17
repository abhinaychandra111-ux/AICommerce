import { useState } from "react";
import {
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setMessage(
        "Account created successfully! Redirecting to login..."
      );

      setForm({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      setMessage(
        error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          <UserPlus size={24} />
        </div>

        <span className="eyebrow">
          AICOMMERCE
        </span>

        <h1>
          Create Account
        </h1>

        <p className="auth-description">
          Create your account and start shopping.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Full Name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </label>


          <label>
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>


          <label>
            Password

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <span className="password-hint">
              Use at least 6 characters.
            </span>

          </label>


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}


        <p className="auth-switch">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Register;