import { useState } from "react";
import {
  LogIn,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
        "http://localhost:5000/api/auth/login",
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
          data.message || "Login failed"
        );
      }

      localStorage.setItem(
        "aicommerce-token",
        data.token
      );

      localStorage.setItem(
        "aicommerce-user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Login successful!"
      );

      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      setMessage(
        error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          <LogIn size={24} />
        </div>

        <span className="eyebrow">
          WELCOME BACK
        </span>

        <h1>
          Login
        </h1>

        <p className="auth-description">
          Sign in to continue shopping.
        </p>

        <form onSubmit={handleSubmit}>

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
                placeholder="Enter your password"
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
          </label>


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>


        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}


        <p className="auth-switch">
          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Login;