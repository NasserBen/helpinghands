"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    password: "",
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.number || !formData.password) {
      alert("Please fill in all required fields");
      return;
    }

    if (isSignUp && !formData.name) {
      alert("Please enter your name");
      return;
    }

    try {
      const endpoint = isSignUp ? "/api/user/signup" : "/api/user/signin";
      const payload = isSignUp
        ? {
            name: formData.name,
            phoneNumber: formData.number,
            password: formData.password,
          }
        : { phoneNumber: formData.number, password: formData.password };

      console.log("Attempting authentication:", endpoint, payload);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Auth response:", data);

      if (response.ok) {
        sessionStorage.setItem("userId", data.user.id.toString());
        sessionStorage.setItem("userName", data.user.name);
        sessionStorage.setItem("userPhone", data.user.phoneNumber);

        console.log("User authenticated successfully:", data.user);

        router.push("/request");
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Join Helping Hands" : "Welcome back"}
          </h1>
          <p className="text-gray-600">
            {isSignUp
              ? "Create your account to get started"
              : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors duration-200"
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors duration-200 text-gray-900"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors duration-200 text-gray-900"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-4 rounded font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
