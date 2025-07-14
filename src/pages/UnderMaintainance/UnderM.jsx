import React from 'react'
import AnimatedLogo from '../../components/AnimatedLogo/AnimatedLogo'

const UnderM = () => {
  return (
    <div className='py-[2%] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-900 flex items-center justify-center'>
      <div className='max-w-2xl mx-auto text-center'>        {/* Animated Logo */}
        <div className='mb-4'>
          <AnimatedLogo
            width={220}
            height={204}
            className="mx-auto"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))' }}
            isInfinite={true}
          />
        </div>

        {/* Main Content */}
        <div className='bg-white/10 backdrop-blur-lg rounded-3xl p-3 shadow-2xl border border-white/20'>
          {/* Title */}
          <h1 className='text-lg md:text-xl font-bold text-white mb-2'>
            Under Maintenance
          </h1>
          
          {/* Subtitle */}
          <p className='text-sm text-blue-100 mb-3'>
            We're working hard to improve your experience
          </p>
          
          {/* Description */}
          <p className='text-xs text-blue-200 mb-4 max-w-prose leading-relaxed'>
            Our healthcare management system is currently undergoing scheduled maintenance 
            to bring you better features and improved performance. We'll be back shortly!
          </p>

          {/* Progress Indicator */}
          <div className='mb-4'>
            <div className='flex items-center justify-center mb-2'>
              <div className='flex space-x-1'>
                <div className='w-2 h-2 bg-white rounded-full animate-bounce'></div>
                <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
                <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='border-t border-white/20 pt-3'>
            <p className='text-blue-200 mb-2 text-xs'>
              Need immediate assistance?
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-3'>
              <a 
                href='mailto:support@campusmedix.com' 
                className='flex items-center space-x-1 text-white hover:text-blue-200 transition-colors duration-200 text-xs'
              >
                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></path>
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></path>
                </svg>
                <span>support@campusmedix.com</span>
              </a>
              <a 
                href='tel:+1234567890' 
                className='flex items-center space-x-1 text-white hover:text-blue-200 transition-colors duration-200 text-xs'
              >
                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z'></path>
                </svg>
                <span>+84 0986-838-888</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-4 text-blue-200 text-xs'>
          <p>Thank you for your patience and understanding</p>
          <p className='mt-1'>© 2025 CampusMedix - Healthcare Management System</p>
        </div>
      </div>
    </div>
  )
}

export default UnderM
