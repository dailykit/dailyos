import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import Loader from '../Loader'
import { useOrder } from '../../context/order'
import { FETCH_ORDER_SACHET } from '../../graphql'
import {
   Wrapper,
   StyledHeader,
   StyledMode,
   StyledMain,
   StyledStatus,
   StyledWeigh,
   StyledPackaging,
   StyledSOP,
} from './styled'

import { WeighIcon } from '../../assets/icons'

export const ProcessOrder = () => {
   const {
      state: { current_view, mealkit },
      switchView,
   } = useOrder()
   const [sachet, setSachet] = React.useState(null)
   const { loading, error } = useSubscription(FETCH_ORDER_SACHET, {
      variables: {
         id: mealkit.sachet_id,
      },
      onSubscriptionData: async ({
         subscriptionData: { data: { orderSachet = {} } = {} },
      }) => {
         setSachet(orderSachet)
      },
   })

   const changeView = view => {
      switchView(view)
   }

   if (!mealkit.sachet_id) {
      return (
         <Wrapper>
            <StyledMode>
               <label htmlFor="mode">Mode</label>
               <select
                  id="mode"
                  name="mode"
                  value={current_view}
                  onChange={e => changeView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="MEALKIT">Meal Kit</option>
                  <option value="INVENTORY">Inventory</option>
                  <option value="READYTOEAT">Ready to Eat</option>
               </select>
            </StyledMode>
            <span>No product selected!</span>
         </Wrapper>
      )
   }
   if (loading || !sachet)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error)
      return (
         <Wrapper>
            <StyledMode>
               <label htmlFor="mode">Mode</label>
               <select
                  id="mode"
                  name="mode"
                  value={current_view}
                  onChange={e => changeView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="MEALKIT">Meal Kit</option>
                  <option value="INVENTORY">Inventory</option>
                  <option value="READYTOEAT">Ready to Eat</option>
               </select>
            </StyledMode>
            <span>{error.message}</span>
         </Wrapper>
      )
   return (
      <Wrapper>
         <StyledMode>
            <label htmlFor="mode">Mode</label>
            <select
               id="mode"
               name="mode"
               value={current_view}
               onChange={e => changeView(e.target.value)}
            >
               <option value="SUMMARY">Summary</option>
               <option value="MEALKIT">Meal Kit</option>
               <option value="INVENTORY">Inventory</option>
               <option value="READYTOEAT">Ready to Eat</option>
            </select>
         </StyledMode>
         <StyledHeader>
            <h3>{mealkit?.name}</h3>
         </StyledHeader>
         <StyledMain>
            <section>
               <h4>{sachet.ingredientName}</h4>
               <StyledStatus>Under Processing</StyledStatus>
            </section>
            <section>
               <span>
                  {(sachet.bulkItemId &&
                     sachet?.bulkItem?.supplierItem?.name) ||
                     ''}
                  {(sachet.sachetItemId &&
                     sachet?.sachetItem?.bulkItem?.supplierItem?.name) ||
                     ''}
                  {!sachet?.bulkItemId && !sachet?.sachetItemId && 'NA'}
               </span>
               <span>{sachet.processingName}</span>
               <span>{sachet.quantity}gm</span>
            </section>
            <StyledWeigh>
               <span>
                  <WeighIcon />
               </span>
               <h2>Weighing scale is not active!</h2>
               <span />
            </StyledWeigh>
         </StyledMain>
         <StyledPackaging>
            <h3>Packaging</h3>
            <span>{sachet?.packging?.name || 'N/A'}</span>
            <div title={sachet?.packging?.name || 'N/A'}>
               {sachet?.packging?.assets?.images[0] && (
                  <img
                     src={sachet?.packging?.assets?.images[0].url}
                     alt={sachet?.packging?.name || 'N/A'}
                     title={sachet?.packging?.name || 'N/A'}
                  />
               )}
            </div>
         </StyledPackaging>
         <StyledSOP>
            <h3>SOP</h3>
            <div>
               {sachet.bulkItemId &&
                  Object.keys(sachet?.bulkItem?.sop?.images).length > 0 && (
                     <img
                        src={sachet?.bulkItem?.sop?.images[0].url}
                        alt="SOP"
                     />
                  )}
               {sachet.sachetItemId &&
                  Object.keys(sachet?.sachetItem?.bulkItem?.sop?.images)
                     .length > 0 && (
                     <img
                        src={sachet?.sachetItem?.bulkItem?.sop?.images[0].url}
                        alt="SOP"
                     />
                  )}
            </div>
         </StyledSOP>
      </Wrapper>
   )
}
