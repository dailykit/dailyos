import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { TextButton, IconButton, CloseIcon } from '@dailykit/ui'
import { useSubscription, useMutation, useLazyQuery } from '@apollo/react-hooks'

import { ScaleIcon } from '../../assets/icons'
import { useOrder, useConfig } from '../../context'
import { InlineLoader } from '../../../../shared/components'
import {
   FETCH_ORDER_SACHET,
   UPDATE_ORDER_SACHET,
   LABEL_TEMPLATE,
} from '../../graphql'
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
   StyledLabelPreview,
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
   const [labelPreview, setLabelPreview] = React.useState('')

   const [updateSachet] = useMutation(UPDATE_ORDER_SACHET)
   const [
      fetchLabaleTemplate,
      { data: { labelTemplate = {} } = {} },
   ] = useLazyQuery(LABEL_TEMPLATE)

   const { loading, error } = useSubscription(FETCH_ORDER_SACHET, {
      variables: {
         id: mealkit.sachet_id,
      },
      onSubscriptionData: async ({
         subscriptionData: { data: { orderSachet = {} } = {} },
      }) => {
         if (!_.isEmpty(orderSachet)) {
            setWeight(0)
            setSachet(orderSachet)
            fetchLabaleTemplate({
               variables: {
                  id: Number(orderSachet?.labelTemplateId),
               },
            })
         }
      },
   })

   React.useEffect(() => {
      setWeight(0)
      setScaleState('low')
      setLabelPreview('')
   }, [mealkit.sachet_id])

   const changeView = view => {
      switchView(view)
   }

   React.useEffect(() => {
      if (sachet) {
         if (weight < sachet.quantity) {
            setScaleState('low')
         } else if (weight > sachet.quantity) {
            setScaleState('above')
         } else if (weight === sachet.quantity) {
            setScaleState('match')
         }
      }
   }, [weight, sachet])

   const print = React.useCallback(() => {
      updateSachet({
         variables: {
            id: sachet.id,
            _set: {
               isPortioned: true,
            },
         },
      })
      if (_.isNull(sachet.labelTemplateId)) return

      if (state.print.print_simulation.value.isActive) {
         const template = encodeURIComponent(
            JSON.stringify({
               name: labelTemplate?.name,
               type: 'label',
               format: 'html',
            })
         )

         const data = encodeURIComponent(
            JSON.stringify({
               id: sachet.id,
            })
         )
         const url = `${process.env.REACT_APP_TEMPLATE_URL}?template=${template}&data=${data}`
         setLabelPreview(url)
      } else {
         const url = `${
            new URL(process.env.REACT_APP_DATA_HUB_URI).origin
         }/datahub/v1/query`

         const data = {
            id: sachet.id,
            isPortioned: true,
            ingredientName: sachet.ingredientName,
            processingName: sachet.processingName,
            labelTemplateId: sachet.labelTemplateId,
            packingStationId: sachet.packingStationId,
         }
         axios.post(
            url,
            {
               type: 'invoke_event_trigger',
               args: {
                  name: 'printOrderSachet',
                  payload: { new: data },
               },
            },
            {
               headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'x-hasura-admin-secret':
                     process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
               },
            }
         )
      }
   }, [sachet, labelTemplate])

   React.useEffect(() => {
      let timer
      if (weight === sachet?.quantity) {
         timer = setTimeout(() => {
            print()
         }, 3000)
      }
      return () => clearTimeout(timer)
   }, [weight, sachet, print])

   if (_.isNull(mealkit.sachet_id)) {
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
               <header>
                  <span>
                     <ScaleIcon size={24} color="#fff" />
                  </span>
                  {!_.isNull(sachet.labelTemplateId) && (
                     <button onClick={() => print()}>Print Label</button>
                  )}
               </header>
               <h2>
                  {weight}
                  {sachet.unit}
               </h2>
               {weight > 0 && weight > sachet.quantity && (
                  <h3>
                     Reduce weight by {Math.abs(sachet.quantity - weight)}
                     {sachet.unit}
                  </h3>
               )}
               {weight > 0 && weight < sachet.quantity && (
                  <h3>
                     Add {Math.abs(sachet.quantity - weight)}
                     {sachet.unit} more
                  </h3>
               )}
               <span />
            </StyledWeigh>
            {sachet.status !== 'PACKED' &&
               state.scale.weight_simulation.value.isActive && (
                  <ManualWeight>
                     <input
                        type="number"
                        value={weight}
                        placeholder="Enter weight"
                        onChange={e => setWeight(Number(e.target.value))}
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
         {labelPreview && (
            <StyledLabelPreview>
               <header>
                  <h3>Label Preview</h3>
                  <IconButton type="ghost" onClick={() => setLabelPreview('')}>
                     <CloseIcon />
                  </IconButton>
               </header>
               <div>
                  <iframe
                     src={labelPreview}
                     title="label preview"
                     frameborder="0"
                  />
               </div>
            </StyledLabelPreview>
         )}
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
