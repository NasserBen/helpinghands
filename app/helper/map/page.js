"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function HelperMap() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showListView, setShowListView] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/task");
        if (response.ok) {
          const tasks = await response.json();
          const availableTasks = tasks.filter(
            (task) => !task.helper && !task.completed
          );
          setAvailableTasks(availableTasks);
        } else {
          console.error("Failed to fetch tasks");
          setAvailableTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setAvailableTasks([]);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        console.warn(
          "Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file"
        );
        setMapError(true);
        setShowListView(true);
        return;
      }

      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const mapOptions = {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13,
        mapId: "DEMO_MAP_ID",
      };

      const mapInstance = new Map(mapRef.current, mapOptions);
      setMap(mapInstance);

      availableTasks.forEach((task) => {
        console.log(
          `Adding marker for task "${task.title}" at:`,
          task.location,
          `Address: ${task.address}`
        );

        const marker = new AdvancedMarkerElement({
          map: mapInstance,
          position: task.location,
          title: `${task.title} - ${task.address}`,
        });

        marker.addListener("click", () => {
          setSelectedTask(task);
        });
      });
    };

    if (mapRef.current && availableTasks.length > 0) {
      initMap();
    }
  }, [availableTasks]);

  const handleAcceptTask = async (taskId) => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        alert("Please sign in to accept tasks");
        return;
      }

      const response = await fetch(`/api/task/${taskId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ helperId: userId }),
      });

      if (response.ok) {
        setAvailableTasks((prev) => prev.filter((task) => task.id !== taskId));
        setSelectedTask(null);
        alert("Task accepted! Check your helper dashboard for details.");
      } else {
        alert("Failed to accept task. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting task:", error);
      alert("Error accepting task. Please try again.");
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Available Tasks</h1>
          <p className="text-sm text-gray-600">
            {availableTasks.length} tasks nearby
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {!mapError && (
            <button
              onClick={() => setShowListView(!showListView)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showListView
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {showListView ? "Map View" : "List View"}
            </button>
          )}
          {mapError && (
            <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
              Map unavailable - showing list view
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {!showListView && !mapError && (
          <div ref={mapRef} className="w-full h-full" />
        )}

        {!showListView && mapError && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-3xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Map Unavailable
              </h3>
              <p className="text-gray-600 mb-4">
                Google Maps API key not configured.
              </p>
              <button
                onClick={() => setShowListView(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Task List
              </button>
            </div>
          </div>
        )}

        {showListView && (
          <div className="h-full overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {availableTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {task.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {task.timeEstimate}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        {task.price}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                          task.urgency
                        )}`}
                      >
                        {task.urgency} priority
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptTask(task.id);
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
                  >
                    Accept Task
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTask && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTask.title}
                  </h2>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Description
                    </h3>
                    <p className="text-gray-700">{selectedTask.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Location
                    </h3>
                    <p className="text-gray-700">{selectedTask.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                        Payment
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedTask.price}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                        Time Estimate
                      </h3>
                      <p className="text-gray-700">
                        {selectedTask.timeEstimate}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(
                        selectedTask.urgency
                      )}`}
                    >
                      {selectedTask.urgency} priority
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAcceptTask(selectedTask.id)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
                  >
                    Accept Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
