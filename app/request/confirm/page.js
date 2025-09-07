"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmRequest() {
  const [responseData, setResponseData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedRequest = sessionStorage.getItem("helpRequest");
    if (storedRequest) {
      const parsed = JSON.parse(storedRequest);

      const formattedResponse = {
        issue: parsed.helpText.split(".")[0] || "Task request",
        price: parsed.price,
        address: parsed.address,
        timeEstimate: parsed.estimatedTime,
        description: parsed.helpText,
        category: "general",
      };
      setResponseData(formattedResponse);
    } else {
      router.push("/request");
    }
  }, [router]);

  const handleEdit = () => {
    router.push("/request");
  };

  const handlePost = async () => {
    if (responseData) {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          alert("Please sign in to post tasks");
          return;
        }

        const taskData = {
          title: responseData.issue,
          description: responseData.description,
          price: responseData.price,
          address: responseData.address,
          estimatedDuration: responseData.timeEstimate,
          creatorId: userId,
          category: responseData.category || "general",
        };

        const response = await fetch("/api/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          sessionStorage.removeItem("helpRequest");
          alert(
            "Task posted successfully! You can now see it on the helper map."
          );
          router.push("/helper/map");
        } else {
          alert("Failed to create task. Please try again.");
        }
      } catch (error) {
        console.error("Error creating task:", error);
        alert("Error creating task. Please try again.");
      }
    }
  };

  if (!responseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-green-600 text-lg font-bold">...</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Finding the perfect helper
          </h2>
          <p className="text-gray-600">
            We're analyzing your request and matching you with trusted helpers
            nearby...
          </p>

          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span>Analyzing your task</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-100"></div>
              <span>Finding helpers in your area</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-200"></div>
              <span>Calculating pricing</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perfect! Here's your task summary
          </h1>
          <p className="text-lg text-gray-600">
            Review the details and confirm to connect with a helper
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {responseData.image && (
            <div className="h-64 bg-gray-100">
              <img
                src={URL.createObjectURL(responseData.image)}
                alt="Task"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Task
                  </h3>
                  <p className="text-xl font-semibold text-gray-900">
                    {responseData.issue}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Location
                  </h3>
                  <p className="text-gray-700">{responseData.address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Estimated Time
                  </h3>
                  <p className="text-gray-700">{responseData.timeEstimate}</p>
                </div>
              </div>

              <div className="md:text-right">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Estimated Cost
                  </h3>
                  <p className="text-4xl font-bold text-green-600">
                    {responseData.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Final price may vary based on actual work required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleEdit}
            className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            ← Edit Request
          </button>

          <button
            onClick={handlePost}
            className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Confirm & Find Helper
          </button>
        </div>

        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <span className="text-green-600 text-lg font-bold">i</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens next?
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• We'll connect you with a verified helper in your area</li>
                <li>
                  • You'll receive their contact information and estimated
                  arrival time
                </li>
                <li>• Payment is processed securely after task completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
