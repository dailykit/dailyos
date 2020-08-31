import React from 'react'
import { Text } from '@dailykit/ui'

export default function DataCard({ title, quantity, actionText }) {
   return (
      <div
         style={{
            margin: '4px 20px',
            border: '1px solid #f3f3f3',
            padding: '20px',
            borderRadius: '4px',
            minWidth: '120px',
         }}
      >
         <Text as="title">{title}</Text>

         <Text as="h2">{quantity === 0 ? quantity : 'N/A'}</Text>
         <hr style={{ border: '1px solid #f3f3f3' }} />
         {actionText && (
            <span style={{ color: '#00A7E1', marginTop: '5px' }}>
               {actionText}
            </span>
         )}
      </div>
   )
}
