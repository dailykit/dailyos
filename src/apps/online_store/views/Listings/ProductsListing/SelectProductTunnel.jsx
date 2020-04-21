import React from 'react'
import styled from 'styled-components'
import { Text } from '@dailykit/ui'

import { Context } from '../../../context/tabs'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../components'

export default function SelectProductTunnel({ close }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }
   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select Type of Product"
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
            onClick={() => addTab('Inventory Product', 'inventoryProduct')}
         >
            <Text as="h1">Inventory Product</Text>
            <Text as="subtitle">
               Inventory product is just an item, supplied or bought
            </Text>
         </SolidTile>
         <br />
         <SolidTile onClick={() => addTab('Advanced Product', 'product')}>
            <Text as="h1">Advanced Product</Text>
            <Text as="subtitle">
               Advanced product is an item with your recipes, sold as Meal Kits
               as well as Ready to Eat
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
