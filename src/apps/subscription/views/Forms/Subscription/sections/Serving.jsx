import React from 'react'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Tag,
   Text,
   Input,
   Tunnel,
   Toggle,
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
import { Spacer, Stack } from '../../../../styled'
import { Flex, InlineLoader } from '../../../../../../shared/components'
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
   const { loading, data: { serving = {} } = {} } = useSubscription(SERVING, {
      variables: { id },
      onSubscriptionData: ({
         subscriptionData: { data: { serving = {} } = {} } = {},
      }) => {
         dispatch({
            type: 'SET_SERVING',
            payload: {
               id: serving.id,
               size: serving.size,
               isActive: serving.isActive,
               isDefault: state.title.defaultServing.id === serving.id,
            },
         })
      },
   })

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

   const toggleIsActive = value => {
      if (serving.isValid) {
         return upsertServing({
            variables: {
               object: {
                  isActive: value,
                  id: state.serving.id,
                  subscriptionTitleId: state.title.id,
                  servingSize: Number(state.serving.size),
               },
            },
         })
      }
      toast.error('Can not be published without any active item counts!', {
         position: 'top-center',
      })
      return
   }

   if (loading) return <InlineLoader />
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
               <Toggle
                  label="Publish"
                  checked={state.serving.isActive}
                  setChecked={value => toggleIsActive(value)}
               />
               <Spacer size="16px" xAxis />
               <IconButton type="outline" onClick={() => editServing()}>
                  <EditIcon />
               </IconButton>
            </Stack>
         </Flex>
         <hr style={{ border: '1px solid #ededed' }} />
         <Spacer size="16px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Text as="title">Items Counts</Text>
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
         <ItemCountTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
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
            />
            <main style={{ padding: 16 }}>
               <Input
                  type="text"
                  name="count"
                  label="Count"
                  value={state.item.count}
                  onChange={e =>
                     dispatch({
                        type: 'SET_ITEM',
                        payload: {
                           count: e.target.value,
                        },
                     })
                  }
               />
               <Spacer size="16px" />
               <Input
                  type="text"
                  name="price"
                  label="Price"
                  value={state.item.price}
                  onChange={e =>
                     dispatch({
                        type: 'SET_ITEM',
                        payload: {
                           price: e.target.value,
                        },
                     })
                  }
               />
            </main>
         </Tunnel>
      </Tunnels>
   )
}
