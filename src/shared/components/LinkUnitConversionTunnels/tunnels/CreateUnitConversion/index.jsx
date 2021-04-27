import React from 'react'
import { Flex, TunnelHeader } from '@dailykit/ui'

const CreateUnitConversion = ({ closeTunnel }) => {
   return (
      <>
         <TunnelHeader
            title="Create Unit Conversion"
            close={() => closeTunnel(2)}
            right={{
               title: 'Create',
               action: () => closeTunnel(2),
            }}
         />
         <Flex padding="16px">Create Unit Conversion</Flex>
      </>
   )
}

export default CreateUnitConversion
