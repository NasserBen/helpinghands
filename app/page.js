import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find the perfect <span className="text-green-500">helper</span>{" "}
              for any task
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Connect with skilled helpers in your area. Get things done quickly
              and affordably.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/request"
                className="w-full sm:w-auto bg-green-500 text-white px-8 py-4 rounded font-semibold text-lg hover:bg-green-600 transition-colors duration-200"
              >
                Get Help Now
              </Link>

              <Link
                href="/helper/map"
                className="w-full sm:w-auto border border-green-500 text-green-500 px-8 py-4 rounded font-semibold text-lg hover:bg-green-50 transition-colors duration-200"
              >
                Become a Helper
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
