import React from 'react'
import styled from 'styled-components'
import { Text } from '@dailykit/ui'

import { toast } from 'react-toastify'

import { Context } from '../../../context/tabs'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../components'
import { useMutation } from '@apollo/react-hooks'

import { CREATE_COMBO_PRODUCT } from '../../../graphql'

import { randomSuffix } from '../../../../../shared/utils'

export default function SelectProductTunnel({ close }) {
   const { dispatch } = React.useContext(Context)

   // Mutations
   const [createComboProduct] = useMutation(CREATE_COMBO_PRODUCT, {
      onCompleted: data => {
         toast.success('Product created!')
         addTab(
            'Combo Product',
            'comboProduct',
            data.createComboProduct.returning[0].id
         )
      },
   })

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   const createProduct = type => {
      const object = {
         name: type + '-' + randomSuffix(),
      }
      switch (type) {
         case 'combo': {
            createComboProduct({
               variables: {
                  objects: [object],
               },
            })
         }
         default:
            return
      }
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
         <br />
         <SolidTile
            onClick={() => addTab('Inventory Product', 'inventoryProduct')}
         >
            <Text as="h1">Inventory Product</Text>
            <Text as="subtitle">
               Inventory product is just an item, supplied or bought
            </Text>
         </SolidTile>
         <br />
         <SolidTile
            onClick={() => addTab('Simple Product', 'simpleRecipeProduct')}
         >
            <Text as="h1">Simple Recipe Product</Text>
            <Text as="subtitle">
               Simple Recipe product is only one recipes, sold as Meal Kits as
               well as Ready to Eat
            </Text>
         </SolidTile>
         <br />
         <SolidTile
            onClick={() =>
               addTab('Customizable Product', 'customizableProduct')
            }
         >
            <Text as="h1">Customizable Product</Text>
            <Text as="subtitle">
               Customizable product has recipe options with one recipe as
               default
            </Text>
         </SolidTile>
         <br />
         <SolidTile onClick={() => createProduct('combo')}>
            <Text as="h1">Combo Product</Text>
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
