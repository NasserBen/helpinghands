"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestHelp() {
  const [helpText, setHelpText] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSend = () => {
    if (!helpText.trim()) {
      alert("Please describe what you need help with");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }

    if (!price.trim()) {
      alert("Please enter how much you're willing to pay");
      return;
    }

    if (!estimatedTime.trim()) {
      alert("Please enter estimated time needed");
      return;
    }

    const requestData = {
      helpText,
      address,
      price,
      estimatedTime,
      image: selectedImage,
      timestamp: new Date().toISOString(),
    };

    sessionStorage.setItem("helpRequest", JSON.stringify(requestData));

    router.push("/request/confirm");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What do you need help with?
          </h1>
          <p className="text-lg text-gray-600">
            Describe your task and we'll connect you with the right helper
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="space-y-6">
            {/* Task Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Task Description
              </label>
              <textarea
                value={helpText}
                onChange={(e) => setHelpText(e.target.value)}
                placeholder="e.g., My kitchen sink is clogged and water won't drain..."
                className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base transition-colors duration-200 text-gray-900 bg-white"
                rows={6}
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 123 Main St, San Francisco, CA 94102"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base transition-colors duration-200 text-gray-900 bg-white"
              />
              <p className="text-sm text-gray-500 mt-2">
                This helps us find helpers in your area and show your task on
                the map
              </p>
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                How much will you pay?
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., $25"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base transition-colors duration-200 text-gray-900 bg-white"
              />
            </div>

            {/* Estimated Time Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                How long do you think it will take?
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g., 1 hour, 30 minutes, 2-3 hours"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base transition-colors duration-200 text-gray-900 bg-white"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Add Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedImage.name}
                    </p>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-green-600 text-lg font-semibold">
                          +
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">Add a photo</p>
                      <p className="text-sm text-gray-500">
                        Help us understand your task better
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSend}
          disabled={
            !helpText.trim() ||
            !address.trim() ||
            !price.trim() ||
            !estimatedTime.trim()
          }
          className={`w-full py-3 rounded font-semibold text-lg transition-colors duration-200 ${
            helpText.trim() &&
            address.trim() &&
            price.trim() &&
            estimatedTime.trim()
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>

        {/* Quick Tips */}
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Tips for better results
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Be specific about what needs to be done</li>
            <li>• Include any tools or materials needed</li>
            <li>• Mention your preferred time frame</li>
            <li>• Add photos to help helpers understand the task</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
