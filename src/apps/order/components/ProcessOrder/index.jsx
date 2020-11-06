import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSubscription, useMutation, useLazyQuery } from '@apollo/react-hooks'
import {
   Flex,
   Spacer,
   Text,
   TextButton,
   IconButton,
   CloseIcon,
} from '@dailykit/ui'

import { ScaleIcon } from '../../assets/icons'
import { logger } from '../../../../shared/utils'
import { useOrder, useConfig } from '../../context'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../shared/components'
import {
   LABEL_TEMPLATE,
   FETCH_ORDER_SACHET,
   UPDATE_ORDER_SACHET,
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
      fetchLabalTemplate,
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
            fetchLabalTemplate({
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
               <Flex container alignItems="center">
                  <label htmlFor="mode">Mode</label>
                  <Tooltip identifier="left_panel_mode" />
               </Flex>
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
            <Text as="h3">No product selected!</Text>
         </Wrapper>
      )
   }
   if (loading || !sachet) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch sachet details!')
      return (
         <Wrapper>
            <StyledMode>
               <Flex container alignItems="center">
                  <label htmlFor="mode">Mode</label>
                  <Tooltip identifier="left_panel_mode" />
               </Flex>
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
            <ErrorState message="Failed to fetch sachet details!" />
         </Wrapper>
      )
   }
   return (
      <Wrapper>
         <StyledMode>
            <Flex container alignItems="center">
               <label htmlFor="mode">Mode</label>
               <Tooltip identifier="left_panel_mode" />
            </Flex>
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
                  <span>
                     {sachet.quantity}
                     {sachet.unit}
                  </span>
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
            <Flex margin="16px 0">
               <Flex
                  container
                  as="header"
                  width="300px"
                  alignItems="center"
                  justifyContent="space-between"
               >
                  <Text as="h3">Label Preview</Text>
                  <IconButton
                     size="sm"
                     type="ghost"
                     onClick={() => setLabelPreview('')}
                  >
                     <CloseIcon size={22} />
                  </IconButton>
               </Flex>
               <Spacer size="8px" />
               <iframe
                  src={labelPreview}
                  frameBorder="0"
                  title="label preview"
               />
            </Flex>
         )}
         <Spacer size="16px" />
         <StyledPackaging>
            <Flex as="aside" container alignItems="center">
               <Text as="h3">Packaging</Text>
               <Tooltip identifier="process_mealkit_section_packaging_heading" />
            </Flex>
            <span>{sachet?.packging?.name || 'N/A'}</span>
            <section title={sachet?.packging?.name || 'N/A'}>
               {sachet?.packging?.assets?.images[0] && (
                  <img
                     src={sachet?.packging?.assets?.images[0].url}
                     alt={sachet?.packging?.name || 'N/A'}
                     title={sachet?.packging?.name || 'N/A'}
                  />
               )}
            </section>
         </StyledPackaging>
         <Spacer size="16px" />
         <StyledSOP>
            <Flex as="aside" container alignItems="center">
               <Text as="h3">SOP</Text>
               <Tooltip identifier="process_mealkit_section_sop_heading" />
            </Flex>
            <section>
               {sachet?.bulkItemId &&
                  Object.keys(sachet?.bulkItem?.sop?.images || {}).length >
                     0 && (
                     <img
                        src={sachet?.bulkItem?.sop?.images[0].url}
                        alt="SOP"
                     />
                  )}
               {sachet?.sachetItemId &&
                  Object.keys(sachet?.sachetItem?.bulkItem?.sop?.images || {})
                     .length > 0 && (
                     <img
                        src={sachet?.sachetItem?.bulkItem?.sop?.images[0].url}
                        alt="SOP"
                     />
                  )}
            </section>
         </StyledSOP>
         <Spacer size="16px" />
         <Flex container alignItems="center">
            <StyledButton
               type="button"
               disabled={
                  sachet.status === 'PACKED' ||
                  Number(weight) !== sachet.quantity
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
            <Spacer size="16px" xAxis />
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
         </Flex>
      </Wrapper>
   )
}
