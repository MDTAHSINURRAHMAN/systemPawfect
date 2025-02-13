import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/reviews");
      return data;
    },
  });

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(reviews.length - 3, 0) : prevIndex - 3
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent">
          What Our Members Say
        </h2>

        <div className="relative">
          <div className="flex gap-6 transition-transform duration-500">
            {reviews
              .slice(currentIndex, currentIndex + 3)
              .map((review, index) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-8 shadow-xl flex-1 border border-orange-100 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={review.userImage}
                      alt={review.userName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {review.userName}
                      </h3>
                      <p className="text-orange-500">
                        Reviewed {review.trainerName}
                      </p>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    &ldquo;{review.review}&rdquo;
                  </p>
                  <p className="text-sm text-gray-400 mt-4">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>

          {reviews.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white p-3 rounded-full shadow-lg hover:bg-orange-50 transition-colors duration-300"
              >
                <FaChevronLeft className="w-6 h-6 text-orange-500" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white p-3 rounded-full shadow-lg hover:bg-orange-50 transition-colors duration-300"
              >
                <FaChevronRight className="w-6 h-6 text-orange-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
