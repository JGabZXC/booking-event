import { useState } from "react";

export default function EventImagesCarousel({ imagesUrl }) {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? imagesUrl.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === imagesUrl.length - 1 ? 0 : prev + 1));
  };

  let content = null;

  if (imagesUrl.length > 0) {
    content = (
      <>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Event Gallery
        </h2>
        <div className="relative w-full max-w-2xl mx-auto">
          <img
            src={imagesUrl[currentImage]}
            alt={`Event image ${currentImage + 1}`}
            className="w-full h-80 object-cover rounded-lg"
          />
          {imagesUrl.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-pink-900 hover:bg-pink-700 text-white rounded-full p-2 shadow transition"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-900 hover:bg-pink-700 text-white rounded-full p-2 shadow transition"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {imagesUrl.map((_, idx) => (
                  <span
                    key={idx}
                    className={`block w-2 h-2 rounded-full ${
                      idx === currentImage ? "bg-pink-900" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </>
    );
  } else {
    content = (
      <div className="text-center text-gray-500">No images available</div>
    );
  }

  return content;
}
