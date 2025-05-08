import React, { useState } from "react";

const images = [
  "/images/login-bg-2.jpg",
  "https://via.placeholder.com/800x400.png?text=Slide+2",
  "/images/login-bg-2.jpg",
  "https://via.placeholder.com/800x400.png?text=Slide+3",
  "/images/login-bg-2.jpg",
  "https://via.placeholder.com/800x400.png?text=Slide+4",
  "/images/login-bg-2.jpg",
  "https://via.placeholder.com/800x400.png?text=Slide+5",
  "/images/login-bg-2.jpg",
  "https://via.placeholder.com/800x400.png?text=Slide+6",
  "/images/login-bg-2.jpg",
  "https://via.placeholder.com/800x400.png?text=Slide+6",
  "/images/login-bg-2.jpg",
  "https://via.placeholder.com/800x400.png?text=Slide+6",
];

interface Props {}
const ImageCarousel: React.FC<Props> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full max-w-4xl mx-auto">
      {/* Carousel Images */}
      <div className="overflow-hidden relative h-full">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full flex-shrink-0 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Prev/Next Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
      >
        Next
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-gray-800" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
