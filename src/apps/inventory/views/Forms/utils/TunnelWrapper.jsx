import { Flex } from '@dailykit/ui'
import React from 'react'

export const TunnelWrapper = ({ children }) => (
   <Flex padding="16px 32px" style={{ overflowY: 'auto' }} height="100%">
      {children}
   </Flex>
)
