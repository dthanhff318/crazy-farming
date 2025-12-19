import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { PixelButton } from "../components/PixelButton";

export const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate("/");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create user in database with farm plots
      if (data.user) {
        const { error: createError } = await supabase.functions.invoke(
          "create_new_user",
          {
            body: { userId: data.user.id },
          }
        );

        if (createError) {
          console.error("Failed to create user data:", createError);
        }
      }

      setMessage("Account created successfully! You can now log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Switch to login mode after successful signup
      setTimeout(() => {
        setIsSignUp(false);
        setMessage(null);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign up"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setMessage(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-farm-sky-100 to-farm-green-100">
      <div className="w-full h-full flex flex-col items-center justify-center px-6 py-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-farm-brown-800 mb-4">
            🌾 Crazy Farming
          </h1>
          <p className="text-2xl text-farm-brown-600">
            {isSignUp
              ? "Start your farming adventure!"
              : "Welcome back, farmer!"}
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-farm-green-300 shadow-xl p-10 w-full max-w-lg">
          <h2 className="text-4xl font-bold text-farm-brown-800 mb-8 text-center">
            {isSignUp ? "Create Account" : "Login"}
          </h2>

          <form
            onSubmit={isSignUp ? handleSignUp : handleLogin}
            className="space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-xl">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="bg-farm-green-100 border-2 border-farm-green-300 text-farm-green-800 px-4 py-3 rounded-xl text-xl">
                {message}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-2xl font-semibold text-farm-brown-800 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 text-2xl rounded-xl border-2 border-farm-brown-300 focus:border-farm-green-400 focus:outline-none transition-colors"
                placeholder="farmer@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-2xl font-semibold text-farm-brown-800 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 text-2xl rounded-xl border-2 border-farm-brown-300 focus:border-farm-green-400 focus:outline-none transition-colors"
                placeholder={
                  isSignUp ? "At least 6 characters" : "Enter your password"
                }
              />
            </div>

            {/* Confirm Password Input - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-2xl font-semibold text-farm-brown-800 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 text-2xl rounded-xl border-2 border-farm-brown-300 focus:border-farm-green-400 focus:outline-none transition-colors"
                  placeholder="Re-enter your password"
                />
              </div>
            )}

            {/* Submit Button */}
            <PixelButton
              type="submit"
              disabled={loading}
              variant="success"
              className="w-full text-xl"
              style={{ minHeight: "64px" }}
            >
              {loading
                ? isSignUp
                  ? "Creating Account..."
                  : "Logging in..."
                : isSignUp
                ? "Sign Up"
                : "Login"}
            </PixelButton>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-xl text-farm-brown-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-farm-green-600 hover:text-farm-green-700 font-semibold text-xl"
              >
                {isSignUp ? "Login here" : "Sign up here"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-2xl text-farm-brown-600">
          {isSignUp
            ? "Join thousands of farmers today! 🚜"
            : "Start your farming adventure today! 🚜"}
        </p>
      </div>
    </div>
  );
};
