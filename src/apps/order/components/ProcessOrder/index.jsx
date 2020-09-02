import React from 'react'
import { TextButton } from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import { ScaleIcon } from '../../assets/icons'
import { useOrder, useConfig } from '../../context'
import { InlineLoader } from '../../../../shared/components'
import { FETCH_ORDER_SACHET, UPDATE_ORDER_SACHET } from '../../graphql'
import {
   Wrapper,
   StyledHeader,
   StyledMode,
   StyledMain,
   StyledStat,
   StyledWeigh,
   StyledPackaging,
   StyledSOP,
   StyledButton,
   ManualWeight,
} from './styled'

export const ProcessOrder = () => {
   const {
      state: { current_view, mealkit },
      switchView,
   } = useOrder()
   const { state } = useConfig()
   const [weight, setWeight] = React.useState(0)
   const [sachet, setSachet] = React.useState(null)
   const [scaleState, setScaleState] = React.useState('low')
   const [updateSachet] = useMutation(UPDATE_ORDER_SACHET)
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

   React.useEffect(() => {
      if (sachet) {
         if (Number(weight) < sachet.quantity) {
            setScaleState('low')
         } else if (Number(weight) > sachet.quantity) {
            setScaleState('above')
         } else if (Number(weight) === sachet.quantity) {
            setScaleState('match')
         }
      }
   }, [weight, sachet])

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
            <InlineLoader />
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
               <StyledStat status={sachet.status}>{sachet.status}</StyledStat>
            </section>
            <section>
               <section>
                  <span>Supplier Item</span>
                  <span>
                     {(sachet.bulkItemId &&
                        sachet?.bulkItem?.supplierItem?.name) ||
                        ''}
                     {(sachet.sachetItemId &&
                        sachet?.sachetItem?.bulkItem?.supplierItem?.name) ||
                        ''}
                     {!sachet?.bulkItemId && !sachet?.sachetItemId && 'NA'}
                  </span>
               </section>
               <section>
                  <span>Processing Name</span>
                  <span>{sachet.processingName}</span>
               </section>
               <section>
                  <span>Quantity</span>
                  <span>{sachet.quantity}gm</span>
               </section>
            </section>
            <StyledWeigh state={scaleState}>
               <span>
                  <ScaleIcon size={24} color="#fff" />
               </span>
               <h2>{weight || 'Weighing scale is not active!'}</h2>
               <span />
            </StyledWeigh>
            {sachet.status !== 'PACKED' &&
               state.scale.weight_simulation.value.isActive && (
                  <ManualWeight>
                     <input
                        type="number"
                        value={weight}
                        placeholder="Enter weight"
                        onChange={e => setWeight(e.target.value)}
                     />
                     <TextButton
                        type="outline"
                        onClick={() => setWeight(sachet.quantity)}
                     >
                        Match Amount
                     </TextButton>
                  </ManualWeight>
               )}
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
         <StyledButton
            type="button"
            disabled={
               sachet.status === 'PACKED' || Number(weight) !== sachet.quantity
            }
            onClick={() =>
               updateSachet({
                  variables: {
                     id: sachet.id,
                     _set: {
                        status: 'PACKED',
                        isLabelled: true,
                        isPortioned: true,
                     },
                  },
               })
            }
         >
            {sachet.status === 'PACKED' ? 'Packed' : 'Mark Packed'}
         </StyledButton>
         <StyledButton
            type="button"
            disabled={sachet.isAssembled || sachet.status === 'PENDING'}
            onClick={() =>
               updateSachet({
                  variables: {
                     id: sachet.id,
                     _set: {
                        isAssembled: true,
                     },
                  },
               })
            }
         >
            {sachet.isAssembled ? 'Assembled' : 'Mark Assembled'}
         </StyledButton>
      </Wrapper>
   )
}
