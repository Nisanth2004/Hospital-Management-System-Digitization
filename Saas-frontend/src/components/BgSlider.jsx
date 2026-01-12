import React, { useState } from 'react';
import { assets, categories } from '../assets/assets';

const BgSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeCategory, setActiveCategory] = useState('People');

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="mb-16 relative">
      {/* Section title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
        Stunning quality
      </h2>

      {/* Category Selector */}
      <div className="flex justify-center mb-10 flex-wrap">
        <div className="inline-flex gap-4 bg-gray-100 p-2 rounded-full flex-wrap justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full font-medium ${
                activeCategory === category
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Image Comparison Container */}
      <div className="relative w-full max-w-4xl m-auto h-[500px] rounded-xl overflow-hidden shadow-lg">
        {/* After Image */}
        <img
          src={assets.people}
          alt="Removed Background"
          className="w-full h-full object-cover absolute top-0 left-0"
        />

        {/* Before Image (Clipped) */}
        <img
          src={assets.people_org}
          alt="Original"
          className="w-full h-full object-cover absolute top-0 left-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        />

        {/* Vertical Slider Handle */}
        <div
          className="absolute top-0 h-full w-1 bg-white z-20"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Optional circle for drag handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-500 rounded-full shadow"></div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute w-full bottom-0 opacity-0 z-30 cursor-ew-resize"
          style={{ height: '100%', left: 0 }}
        />
      </div>
    </div>
  );
};

export default BgSlider;
