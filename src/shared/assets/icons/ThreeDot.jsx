import React from 'react'

const ThreeDotIcon = ({ size = 20, color = '#555B6E' }) => {
   return (
      <svg
         width={size}
         height={size}
         viewBox="0 0 5 20"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
      >
         <circle cx="2.33313" cy="2" r="2" fill={color} />
         <circle cx="2.33313" cy="9.99991" r="2" fill={color} />
         <circle cx="2.33313" cy="17.9999" r="2" fill={color} />
      </svg>
   )
}

export default ThreeDotIcon
