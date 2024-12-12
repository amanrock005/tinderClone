import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = true;
  return (
    <form className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
         placeholder-gray-400 focus:outline-none focus-right-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label>Password</label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
           focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading
            ? "bg-pink-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700 focus:outline-none focus:rink-2 focus:ring-offset-2 focus:ring-pink"
        }`}
        disabled={loading}
      >
        {loading ? "Signing in ..." : "Sign in"}
      </button>
    </form>
  );
}
