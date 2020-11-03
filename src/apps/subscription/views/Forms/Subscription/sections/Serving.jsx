import React from 'react'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Tag,
   Text,
   Form,
   Tunnel,
   Spacer,
   Tunnels,
   PlusIcon,
   useTunnel,
   IconButton,
   ComboButton,
   TunnelHeader,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { usePlan } from '../state'
import ItemCount from './ItemCount'
import { ItemCountsSection } from '../styled'
import { Stack } from '../../../../styled'
import { logger } from '../../../../../../shared/utils'
import {
   Flex,
   Tooltip,
   ErrorState,
   InlineLoader,
   ErrorBoundary,
} from '../../../../../../shared/components'
import {
   EditIcon,
   TickIcon,
   CloseIcon,
} from '../../../../../../shared/assets/icons'
import {
   SERVING,
   UPSERT_ITEM_COUNT,
   UPSERT_SUBSCRIPTION_SERVING,
} from '../../../../graphql'

const Serving = ({ id, isActive, openServingTunnel }) => {
   const { state, dispatch } = usePlan()
   const [tabIndex, setTabIndex] = React.useState(0)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [upsertServing] = useMutation(UPSERT_SUBSCRIPTION_SERVING)
   const { error, loading, data: { serving = {} } = {} } = useSubscription(
      SERVING,
      {
         variables: { id },
         onSubscriptionData: ({
            subscriptionData: { data: { serving = {} } = {} } = {},
         }) => {
            console.log('serving', Number(serving.size))
            dispatch({
               type: 'SET_SERVING',
               payload: {
                  id: serving.id,
                  size: Number(serving.size),
                  isActive: serving.isActive,
                  isDefault: state.title.defaultServing.id === serving.id,
               },
            })
         },
      }
   )

   React.useEffect(() => {
      return () => {
         dispatch({
            type: 'SET_SERVING',
            payload: {
               id: null,
               size: '',
               isDefault: false,
            },
         })
      }
   }, [dispatch])

   const editServing = () => {
      openServingTunnel(1)
      dispatch({
         type: 'SET_SERVING',
         payload: {
            id: serving.id,
            size: serving.size,
            isDefault: state.title.defaultServing.id === serving.id,
         },
      })
   }

   const addItemCount = () => {
      dispatch({
         type: 'SET_ITEM',
         payload: { id: null, count: '', price: '' },
      })
      openTunnel(1)
   }

   React.useEffect(() => {
      if (!loading && serving.counts.every(node => node.isActive === false)) {
         upsertServing({
            variables: {
               object: {
                  isActive: false,
                  id: serving.id,
                  subscriptionTitleId: state.title.id,
                  servingSize: Number(serving.size),
               },
            },
         })
      }
   }, [loading, serving, state.title.id, upsertServing])

   const toggleIsActive = () => {
      if (!state.serving.isActive && !serving.isValid) {
         toast.error('Can not be published without any active item counts!', {
            position: 'top-center',
         })
         return
      }

      return upsertServing({
         variables: {
            object: {
               id: state.serving.id,
               isActive: !state.serving.isActive,
               subscriptionTitleId: state.title.id,
               servingSize: Number(state.serving.size),
            },
         },
      })
   }

   if (loading) return <InlineLoader />
   if (error) {
      toast.error('Failed to fetch item counts!')
      logger(error)
      return <ErrorState message="Failed to fetch item counts!" />
   }
   return (
      <>
         <Flex
            container
            height="56px"
            alignItems="center"
            justifyContent="space-between"
         >
            <Stack xAxis>
               <Text as="title">Serving: {serving.size}</Text>
               <Spacer size="14px" xAxis />
               {serving.id === state.title.defaultServing.id && (
                  <Tag>Default</Tag>
               )}
            </Stack>
            <Stack>
               {serving.isValid ? (
                  <Flex container flex="1" alignItems="center">
                     <TickIcon size={22} color="green" />
                     <Spacer size="8px" xAxis />
                     <span>All good!</span>
                  </Flex>
               ) : (
                  <Flex container flex="1" alignItems="center">
                     <CloseIcon size={22} color="red" />
                     <Spacer size="8px" xAxis />
                     <span>Must have atleast one active item count!</span>
                  </Flex>
               )}
               <Spacer size="24px" xAxis />
               <Flex container alignItems="center">
                  <Form.Toggle
                     name="publish_serving"
                     onChange={toggleIsActive}
                     value={state.serving.isActive}
                  >
                     Publish
                  </Form.Toggle>
                  <Tooltip identifier="form_subscription_section_serving_publish" />
               </Flex>
               <Spacer size="16px" xAxis />
               <IconButton type="outline" onClick={() => editServing()}>
                  <EditIcon />
               </IconButton>
            </Stack>
         </Flex>
         <hr style={{ border: '1px solid #ededed' }} />
         <Spacer size="16px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container alignItems="center">
               <Text as="title">Items Counts</Text>
               <Tooltip identifier="form_subscription_section_item_count_heading" />
            </Flex>
            <IconButton type="outline" onClick={addItemCount}>
               <PlusIcon />
            </IconButton>
         </Flex>
         <ItemCountsSection>
            {serving.counts.length > 0 ? (
               <HorizontalTabs onChange={index => setTabIndex(index)}>
                  <HorizontalTabList>
                     {serving.counts.map(({ id, count }) => (
                        <HorizontalTab key={id}>
                           <Text as="title">{count}</Text>
                        </HorizontalTab>
                     ))}
                  </HorizontalTabList>
                  <HorizontalTabPanels>
                     {serving.counts.map(({ id }, index) => (
                        <HorizontalTabPanel key={id}>
                           {index === tabIndex && (
                              <ItemCount
                                 id={id}
                                 openItemTunnel={openTunnel}
                                 isActive={isActive && index === tabIndex}
                              />
                           )}
                        </HorizontalTabPanel>
                     ))}
                  </HorizontalTabPanels>
               </HorizontalTabs>
            ) : (
               <Stack py="24px">
                  <ComboButton type="outline" onClick={addItemCount}>
                     <PlusIcon />
                     Add Item Count
                  </ComboButton>
               </Stack>
            )}
         </ItemCountsSection>
         <ErrorBoundary rootRoute="/subscription/subscriptions">
            <ItemCountTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
         </ErrorBoundary>
      </>
   )
}

export default Serving

const ItemCountTunnel = ({ tunnels, closeTunnel }) => {
   const { state, dispatch } = usePlan()
   const [upsertItemCount] = useMutation(UPSERT_ITEM_COUNT, {
      onCompleted: () => {
         closeTunnel(1)
         dispatch({
            type: 'SET_ITEM',
            payload: { id: null, price: '', count: '' },
         })
         toast.success('Successfully created the item count!')
      },
      onError: error => {
         logger(error)
         toast.success('Successfully created the item count!')
      },
   })

   const save = () => {
      upsertItemCount({
         variables: {
            object: {
               count: Number(state.item.count),
               price: Number(state.item.price),
               subscriptionServingId: state.serving.id,
               ...(state.item.id && { id: state.item.id }),
            },
         },
      })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer="1">
            <TunnelHeader
               title="Add Item Count"
               close={() => closeTunnel(1)}
               right={{ action: () => save(), title: 'Save' }}
               tooltip={
                  <Tooltip identifier="form_subscription_tunnel_item_create" />
               }
            />
            <Flex padding="16px">
               <Form.Group>
                  <Form.Label htmlFor="count" title="count">
                     <Flex container alignItems="center">
                        Item Count*
                        <Tooltip identifier="form_subscription_tunnel_item_field_count" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="count"
                     name="count"
                     onChange={e =>
                        dispatch({
                           type: 'SET_ITEM',
                           payload: {
                              count: Number(e.target.value) || '',
                           },
                        })
                     }
                     value={state.item.count}
                     placeholder="Enter the item count"
                  />
               </Form.Group>
               <Spacer size="16px" />
               <Form.Group>
                  <Form.Label htmlFor="price" title="price">
                     <Flex container alignItems="center">
                        Price*
                        <Tooltip identifier="form_subscription_tunnel_item_field_price" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="price"
                     name="price"
                     onChange={e =>
                        dispatch({
                           type: 'SET_ITEM',
                           payload: {
                              price: Number(e.target.value) || '',
                           },
                        })
                     }
                     value={state.item.price}
                     placeholder="Enter the item price"
                  />
               </Form.Group>
            </Flex>
         </Tunnel>
      </Tunnels>
   )
}
