import React, { useContext, useReducer, useState } from 'react'
import {
   ButtonTile,
   IconButton,
   Input,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui/'

import AddIcon from '../../../../assets/icons/Add'
import FormHeading from '../../../../components/FormHeading'
import Items from './Items'
import Availability from './Availability'
import AddItemsTunnel from './Tunnels/AddItemTunnel'
import AvailabilityTunnel from './Tunnels/AvailabilityTunnel'
import ProductDescriptionTunnel from './Tunnels/ProductDescriptionTunnel'
import SelectRecipesTunnel from './Tunnels/SelectRecipesTunnel'
import SetPricingTunnel from './Tunnels/SetPricingTunnel'
import AccompanimentTypeTunnel from './Tunnels/AccompanimentTypeTunnel'
import SelectAccompanimentsTunnel from './Tunnels/SelectAccompanimentsTunnel'

import {
   InventoryProductContext,
   reducers,
   state as initialState,
} from '../../../../context/product/inventoryProduct'
import { Context } from '../../../../context/tabs'
import { FormActions, MainFormArea, Stats, StyledWrapper } from '../../styled'

export default function AddProductForm() {
   const [inventoryProductState, inventoryProductDispatch] = useReducer(
      reducers,
      initialState
   )
   const [tunnels, openTunnel, closeTunnel] = useTunnel(7)
   const { state, dispatch } = useContext(Context)
   const [productName, setProductName] = useState('')

   const handlePublish = () => {}

   const handleSave = () => {}

   const handleTabNameChange = title => {
      if (title.length > 0) {
         dispatch({
            type: 'SET_TITLE',
            payload: { title, oldTitle: state.current.title },
         })
      } else {
         dispatch({
            type: 'SET_TITLE',
            payload: {
               title: 'Untitled Product',
               oldTitle: state.current.title,
            },
         })
      }
   }

   return (
      <>
         <InventoryProductContext.Provider
            value={{ inventoryProductState, inventoryProductDispatch }}
         >
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <AddItemsTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={2}>
                  <SelectRecipesTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={3}>
                  <ProductDescriptionTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={4} size="lg">
                  <SetPricingTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={5}>
                  <AvailabilityTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={6}>
                  <AccompanimentTypeTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={7}>
                  <SelectAccompanimentsTunnel close={closeTunnel} />
               </Tunnel>
            </Tunnels>
            <StyledWrapper>
               <FormHeading>
                  <div>
                     <Input
                        label="Untitled Product"
                        type="text"
                        name="productName"
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                        onBlur={e => handleTabNameChange(productName)}
                     />
                  </div>

                  <FormActions>
                     <TextButton
                        onClick={handleSave}
                        type="ghost"
                        style={{ margin: '0px 10px' }}
                     >
                        save
                     </TextButton>

                     <TextButton
                        onClick={handlePublish}
                        type="solid"
                        style={{ margin: '0px 10px' }}
                     >
                        Publish
                     </TextButton>
                  </FormActions>
               </FormHeading>

               <MainFormArea>
                  <Availability open={openTunnel} />
                  <hr style={{ border: '1px solid #dddddd' }} />
                  <br />

                  <Stats>
                     <h4 style={{ display: 'flex', alignItems: 'center' }}>
                        Items (
                        {inventoryProductState.items[0].label?.length > 0
                           ? inventoryProductState.items?.length
                           : '0'}
                        )
                        <IconButton type="ghost" onClick={() => openTunnel(1)}>
                           <AddIcon color="#000" />
                        </IconButton>
                     </h4>
                  </Stats>
                  {inventoryProductState.items[0].label?.length === 0 ? (
                     <ButtonTile
                        type="primary"
                        size="sm"
                        text="Add Items"
                        onClick={e => openTunnel(1)}
                        style={{ margin: '20px 0' }}
                     />
                  ) : (
                     <Items open={openTunnel} />
                  )}
               </MainFormArea>
            </StyledWrapper>
         </InventoryProductContext.Provider>
      </>
   )
}
