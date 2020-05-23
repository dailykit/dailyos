import { Text } from '@dailykit/ui'
import React from 'react'

import { Spacer, TunnelContainer, TunnelHeader } from '../../../components'
import { Context } from '../../../context/tabs'
import { SolidTile } from '../styled'

export default function WorkOrderTypeTunnel({ close }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }
   return (
      <TunnelContainer>
         <TunnelHeader
            title="select type of packaging"
            close={() => {
               close(1)
            }}
            next={() => {
               close(1)
            }}
            nextAction="Save"
         />
         <Spacer />
         <SolidTile
            onClick={() => {
               dispatch({
                  type: 'SET_PACKAGING_ID',
                  payload: '',
               })

               addTab('New Packaging', 'sachetPackaging')
            }}
         >
            <Text as="h1">Sachets</Text>
            <Text as="subtitle">
               Sachets are used for packaging ingredients for a meal kit.
            </Text>
         </SolidTile>
         <br />
         <SolidTile
            onClick={() => addTab('New Packaging', 'assemblyPackaging')}
         >
            <Text as="h1">Assembly Packet</Text>
            <Text as="subtitle">
               Assembly packet is used to assemble all the sacheted ingredients
               into one kit.
            </Text>
         </SolidTile>
      </TunnelContainer>
   )
}
