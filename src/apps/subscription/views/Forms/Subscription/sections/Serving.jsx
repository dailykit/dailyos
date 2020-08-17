import React from 'react'
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
import { Flex } from '../../../../components'
import { Spacer, Stack } from '../../../../styled'
import { ItemCountsSection, ServingHeader } from '../styled'
import { EditIcon } from '../../../../../../shared/assets/icons'
import { InlineLoader } from '../../../../../../shared/components'
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
   }, [])

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

   const toggleIsActive = value => {
      upsertServing({
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
