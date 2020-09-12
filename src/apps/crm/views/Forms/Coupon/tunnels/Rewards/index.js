import React, { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Text, TunnelHeader, Loader, Tunnel, Tunnels } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { TunnelBody, SolidTile } from './styled'
import { useTabs } from '../../../../../context'
import { CREATE_REWARD, REWARD_TYPE } from '../../../../../graphql'
import RewardDetailsTunnel from '../RewardDetails'

export default function RewardTypeTunnel({
   state,
   closeTunnel,
   tunnels,
   openRewardTunnel,
   getRewardId,
}) {
   const { addTab } = useTabs()

   const [types, setTypes] = useState([])
   // Subscription
   const { data: rewardType, loading } = useSubscription(REWARD_TYPE, {
      onSubscriptionData: data => {
         const result = data.subscriptionData.data.crm_rewardType.map(type => {
            return {
               id: type.id,
               value: type.value,
            }
         })
         setTypes(result)
      },
   })

   //Mutation
   const [createReward] = useMutation(CREATE_REWARD, {
      onCompleted: data => {
         openRewardTunnel(1)
         getRewardId(data.insert_crm_reward.returning[0].id)
         toast.success('Reward created!')
      },
      onError: error => {
         toast.error(`Error : ${error.message}`)
      },
   })

   const createRewardHandler = type => {
      createReward({
         variables: {
            rewardType: type,
            couponId: state?.id,
         },
      })
   }

   if (loading) return <Loader />
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <TunnelHeader
                  title="Select Type of Reward"
                  close={() => closeTunnel(1)}
               />
               <TunnelBody>
                  {types.map(type => {
                     return (
                        <SolidTile
                           key={type.id}
                           onClick={() => createRewardHandler(type.value)}
                        >
                           <Text as="h1">{type.value}</Text>
                           <Text as="subtitle">
                              Create Reward For {type.value} Type.
                           </Text>
                        </SolidTile>
                     )
                  })}
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </>
   )
}
