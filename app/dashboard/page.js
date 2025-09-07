"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [currentTask, setCurrentTask] = useState(null);
  const [pastTasks, setPastTasks] = useState([]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;

        // Fetch tasks created by current user
        const response = await fetch(
          `/api/task/my?role=creator&userId=${userId}`
        );
        if (response.ok) {
          const tasks = await response.json();
          console.log("User tasks fetched:", tasks);

          // Separate active and completed tasks
          const active = tasks.filter((task) => !task.completed && task.helper);
          const completed = tasks.filter((task) => task.completed);

          // Set current task (most recent active task)
          if (active.length > 0) {
            setCurrentTask(active[0]);
          }

          setPastTasks(completed);
        } else {
          console.error("Failed to fetch user tasks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user tasks:", error);
        setCurrentTask(null);
        setPastTasks([]);
      }
    };

    fetchUserTasks();
  }, []);

  const handleDone = async () => {
    if (currentTask) {
      try {
        const response = await fetch(`/api/task/${currentTask.id}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Move current task to past tasks
          setPastTasks((prev) => [
            { ...currentTask, completed: true },
            ...prev,
          ]);
          setCurrentTask(null);
        } else {
          alert("Failed to mark task as complete. Please try again.");
        }
      } catch (error) {
        console.error("Error completing task:", error);
        alert("Error completing task. Please try again.");
      }
    }
  };

  const handleSupport = () => {
    console.log("Support requested");
    // In a real app, this would open a support chat or call
    alert("Support feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your tasks and track progress
            </p>
          </div>
          <Link
            href="/request"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            + New Request
          </Link>
        </div>

        {/* Current Tasks */}
        {currentTask ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Active Task
            </h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Status Banner */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">
                      In Progress
                    </span>
                  </div>
                  <span className="text-green-100 text-sm">
                    Task ID: #12345
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Task Image */}
                  <div className="md:col-span-1">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      {currentTask.image ? (
                        <img
                          src={URL.createObjectURL(currentTask.image)}
                          alt="Task"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">📋</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                        Task
                      </h3>
                      <p className="text-xl font-semibold text-gray-900">
                        {currentTask.issue}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                        Location
                      </h3>
                      <p className="text-gray-700">{currentTask.address}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                        Estimated Time
                      </h3>
                      <p className="text-gray-700">
                        {currentTask.timeEstimate}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                        Price
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {currentTask.price}
                      </p>
                    </div>
                  </div>

                  {/* Helper Info & Actions */}
                  <div className="md:col-span-1">
                    <div className="bg-blue-50 rounded-xl p-6 mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Your Helper
                      </h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {currentTask.helper.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {currentTask.helper.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {currentTask.helper.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Available now</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleDone}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
                      >
                        ✓ Mark Complete
                      </button>
                      <button
                        onClick={handleSupport}
                        className="w-full bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                      >
                        💬 Get Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Active Tasks
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No active tasks
              </h3>
              <p className="text-gray-600 mb-6">
                Ready to get some help? Create your first request!
              </p>
              <Link
                href="/request"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                + Request Help
              </Link>
            </div>
          </div>
        )}

        {/* Past Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Task History
          </h2>
          {pastTasks.length > 0 ? (
            <div className="space-y-4">
              {pastTasks.map((task, index) => (
                <div
                  key={task.id || index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Completed Status Banner */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">✓</span>
                        <span className="text-white font-medium text-sm">
                          Completed
                        </span>
                      </div>
                      <span className="text-green-100 text-xs">2 days ago</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      {/* Task Image */}
                      <div className="md:col-span-1">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                          {task.image ? (
                            <img
                              src={URL.createObjectURL(task.image)}
                              alt="Task"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-2xl">📋</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="md:col-span-2 space-y-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {task.issue}
                        </h3>
                        <p className="text-gray-600">{task.address}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{task.timeEstimate}</span>
                          <span>•</span>
                          <span className="font-semibold text-green-600">
                            {task.price}
                          </span>
                        </div>
                      </div>

                      {/* Helper Info */}
                      <div className="md:col-span-1 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <div>
                            <p className="text-sm text-gray-500">
                              Completed by
                            </p>
                            <p className="font-semibold text-gray-900">
                              {task.helper.name}
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">
                              {task.helper.name[0]}
                            </span>
                          </div>
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
                Your task history will appear here once you complete your first
                request.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
