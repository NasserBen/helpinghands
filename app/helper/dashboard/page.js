"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HelperDashboard() {
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, total: 0 });

  useEffect(() => {
    const fetchHelperData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;

        // Fetch tasks where current user is the helper
        const response = await fetch(
          `/api/task/my?role=helper&userId=${userId}`
        );
        if (response.ok) {
          const tasks = await response.json();
          console.log("Helper tasks fetched:", tasks);

          // Separate active and completed tasks
          const active = tasks.filter((task) => !task.completed);
          const completed = tasks.filter((task) => task.completed);

          setAcceptedTasks(active);
          setCompletedTasks(completed);

          // Calculate earnings
          const completedEarnings = completed.reduce((sum, task) => {
            const price = parseFloat(task.price.replace("$", ""));
            return sum + price;
          }, 0);

          // For demo purposes, assume some earnings distribution
          setEarnings({
            today:
              active.length > 0
                ? parseFloat(active[0].price.replace("$", ""))
                : 0,
            week: completedEarnings,
            total: completedEarnings,
          });
        } else {
          console.error("Failed to fetch helper tasks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching helper data:", error);
        setAcceptedTasks([]);
        setCompletedTasks([]);
        setEarnings({ today: 0, week: 0, total: 0 });
      }
    };

    fetchHelperData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/task/${taskId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const task = acceptedTasks.find((t) => t.id === taskId);
        if (task) {
          setAcceptedTasks((prev) => prev.filter((t) => t.id !== taskId));
          setCompletedTasks((prev) => [
            {
              ...task,
              completedAt: "Just now",
              completed: true,
              rating: 5,
            },
            ...prev,
          ]);

          // Update earnings
          const taskEarning = parseFloat(task.price.replace("$", ""));
          setEarnings((prev) => ({
            today: prev.today + taskEarning,
            week: prev.week + taskEarning,
            total: prev.total + taskEarning,
          }));
        }
      } else {
        alert("Failed to complete task. Please try again.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Error completing task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Helper Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Track your tasks and earnings</p>
          </div>
          <Link
            href="/helper/map"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Find More Tasks
          </Link>
        </div>

        {/* Earnings Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Today's Earnings
            </h3>
            <p className="text-3xl font-bold text-green-600">
              ${earnings.today}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              +{acceptedTasks.length} active task
              {acceptedTasks.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              This Week
            </h3>
            <p className="text-3xl font-bold text-blue-600">${earnings.week}</p>
            <p className="text-sm text-gray-600 mt-1">
              {completedTasks.length} tasks completed
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Total Earned
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              ${earnings.total}
            </p>
            <p className="text-sm text-gray-600 mt-1">All time earnings</p>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Active Tasks
          </h2>
          {acceptedTasks.length > 0 ? (
            <div className="space-y-4">
              {acceptedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold">
                          In Progress
                        </span>
                      </div>
                      <span className="text-green-100 text-sm">
                        Accepted today
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {task.title}
                          </h3>
                          <p className="text-gray-600">{task.address}</p>
                          <p className="text-sm text-gray-500">
                            {task.timeEstimate}
                          </p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Customer Contact
                          </h4>
                          <p className="text-gray-700">{task.customerName}</p>
                          <p className="text-blue-600 font-medium">
                            {task.customerPhone}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {task.price}
                          </p>
                          <p className="text-sm text-gray-500">
                            Payment on completion
                          </p>
                        </div>

                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
                        >
                          Mark Complete
                        </button>

                        <button className="w-full bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">
                          Contact Customer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No active tasks
              </h3>
              <p className="text-gray-600 mb-6">
                Ready to help someone? Find available tasks nearby!
              </p>
              <Link
                href="/helper/map"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse Available Tasks
              </Link>
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Completions
          </h2>
          {completedTasks.length > 0 ? (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">✓</span>
                        <span className="text-white font-medium text-sm">
                          Completed
                        </span>
                      </div>
                      <span className="text-blue-100 text-xs">
                        {task.completedAt}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{task.address}</p>
                        <p className="text-sm text-gray-500">
                          Customer: {task.customerName}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          {task.price}
                        </p>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < task.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            ({task.rating}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-3xl">📜</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No completed tasks yet
              </h3>
              <p className="text-gray-600">
                Your completed tasks and earnings will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
