import React from 'react'

const EditIcon = ({ size = 16, color = '#fff', strokeWidth = 1.5 }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <polygon points="16 3 21 8 8 21 3 21 3 16 16 3" />
   </svg>
)

export default EditIcon
