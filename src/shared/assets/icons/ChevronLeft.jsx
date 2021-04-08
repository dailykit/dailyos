import React from 'react'

const ChevronLeft = ({ size = 24, color = '#00A7E1' }) => {
   return (
      <svg
         width={size}
         height={size}
         viewBox={`0 0 ${size} ${size}`}
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
      >
         <path
            d="M7.25 1.25L1.75 6.75L7.25 12.25"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
         />
      </svg>
   )
}

export default ChevronLeft
