import React from 'react'
import styled from 'styled-components'
import { Text } from '@dailykit/ui'

import { Context } from '../../../context/tabs'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../components'

export default function WorkOrderTypeTunnel({ close }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }
   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select Type of Work Order"
            close={() => {
               close(1)
            }}
            next={() => {
               close(1)
            }}
            nextAction="Save"
         />
         <Spacer />
         <SolidTile onClick={() => addTab('Bulk Work Order', 'bulkOrder')}>
            <Text as="h1">Bulk Work Order</Text>
            <Text as="subtitle">
               Bulk Work Order is to create bulk items with changing processing
            </Text>
         </SolidTile>
         <br />
         <SolidTile onClick={() => addTab('Sachet Work Order', 'sachetOrder')}>
            <Text as="h1">Sachet Work Order</Text>
            <Text as="subtitle">
               Sachet Work Order is to create planned lot items by portioning
               and packaging
            </Text>
         </SolidTile>
      </TunnelContainer>
   )
}

const SolidTile = styled.button`
   width: 70%;
   display: block;
   margin: 0 auto;
   border: 1px solid #cecece;
   padding: 10px 20px;
   border-radius: 2px;
   background-color: #fff;

   &:hover {
      background-color: #f3f3f3;
      cursor: pointer;
   }
`
