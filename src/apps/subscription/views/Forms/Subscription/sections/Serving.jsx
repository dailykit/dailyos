import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Tag,
   Text,
   Input,
   Tunnel,
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
import { Spacer, Stack } from '../../../../styled'
import { ItemCountsSection, ServingHeader } from '../styled'
import { EditIcon } from '../../../../../../shared/assets/icons'
import { SERVING, UPSERT_ITEM_COUNT } from '../../../../graphql'
import { InlineLoader } from '../../../../../../shared/components'

const Serving = ({ id, isActive, openServingTunnel }) => {
   const { state, dispatch } = usePlan()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { loading, data: { serving = {} } = {} } = useSubscription(SERVING, {
      variables: { id },
   })

   React.useEffect(() => {
      if (!loading && isActive) {
         dispatch({
            type: 'SET_SERVING',
            payload: {
               id: serving.id,
               size: serving.size,
               isDefault: state.title.defaultServing.id === serving.id,
            },
         })
      }
   }, [loading, isActive])

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

   if (loading) return <InlineLoader />
   return (
      <>
         <ServingHeader>
            <Stack xAxis>
               <Text as="title">Serving: {serving.size}</Text>
               <Spacer size="14px" xAxis />
               {serving.id === state.title.defaultServing.id && (
                  <Tag>Default</Tag>
               )}
            </Stack>

            <IconButton type="outline" onClick={() => editServing()}>
               <EditIcon />
            </IconButton>
         </ServingHeader>
         <ItemCountsSection>
            {serving.counts.length > 0 ? (
               <HorizontalTabs>
                  <HorizontalTabList>
                     {serving.counts.map(({ id, count }) => (
                        <HorizontalTab key={id}>
                           <Text as="title">{count}</Text>
                        </HorizontalTab>
                     ))}
                  </HorizontalTabList>
                  <HorizontalTabPanels>
                     {serving.counts.map(({ id }) => (
                        <HorizontalTabPanel key={id}>
                           <ItemCount id={id} />
                        </HorizontalTabPanel>
                     ))}
                  </HorizontalTabPanels>
               </HorizontalTabs>
            ) : (
               <Stack py="24px">
                  <ComboButton type="outline" onClick={() => openTunnel(1)}>
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
