"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const name = sessionStorage.getItem("userName");
    setIsLoggedIn(!!userId);
    setUserName(name || "User");
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-3">
              <Image
                src="/helping-hands-logo.png"
                alt="Helping Hands Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">
                Helping Hands
              </span>
            </div>
          </Link>

          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === "/"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    href="/request"
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      pathname === "/request" || pathname.startsWith("/request")
                        ? "text-green-600 font-semibold"
                        : "text-gray-700 hover:text-green-600"
                    }`}
                  >
                    Request Help
                  </Link>
                  <Link
                    href="/helper/map"
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      pathname === "/helper/map" ||
                      pathname.startsWith("/helper")
                        ? "text-green-600 font-semibold"
                        : "text-gray-700 hover:text-green-600"
                    }`}
                  >
                    Become a Helper
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Hi, {userName}
                </span>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("userId");
                    sessionStorage.removeItem("userName");
                    sessionStorage.removeItem("userPhone");
                    sessionStorage.removeItem("helpRequest");
                    sessionStorage.removeItem("confirmedRequest");
                    setIsLoggedIn(false);
                    setUserName("");
                    window.location.href = "/";
                  }}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors duration-200"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
