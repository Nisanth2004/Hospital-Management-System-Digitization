import React from 'react'
import { testimonials } from '../assets/assets'

const Testimonials = () => {
  return (
    <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8 py-12">
      <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center'>
        They love us. You will too.
      </h2>

      {/* body section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex flex-col justify-between max-w-full md:mx-0 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            {/* Top part with quote */}
            <div className="flex flex-col px-6 pt-8 mb-6 space-y-5">
              <svg
                width="24"
                height="18"
                viewBox="0 0 24 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 dark:text-gray-600 fill-current"
              >
                <path
                  d="M24 7.3h-5.1L22.3 4H17l-3.4 6.9v10.3h10.3zM10.3 17.6V7.3H5L8.6 4H3.4L0 7.3v10.3h10.3z"
                  fill="currentColor"
                />
              </svg>

              <p className="text-gray-700 m-0" style={{ hyphens: "auto" }}>
                {testimonial.quote}
              </p>
            </div>

            {/* Bottom part with author info */}
            <div className="flex flex-col bg-gray-50 px-6 pt-3 pb-5 rounded-b-xl">
              <p className="font-semibold text-gray-900 m-0">
                {testimonial.author}
              </p>
              <p className="text-gray-500 text-sm m-0 mt-1">
                {testimonial.handle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
