import React, { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Text, TunnelHeader, Loader, Tunnel, Tunnels, Flex } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { TunnelBody, SolidTile } from './styled'
import { useTabs } from '../../../../../context'
import { CREATE_REWARD, REWARD_TYPE } from '../../../../../graphql'
import { logger } from '../../../../../../../shared/utils'
import { Tooltip } from '../../../../../../../shared/components'

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
   const { loading, error } = useSubscription(REWARD_TYPE, {
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
   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }

   //Mutation
   const [createReward] = useMutation(CREATE_REWARD, {
      onCompleted: data => {
         openRewardTunnel(1)
         getRewardId(data.insert_crm_reward.returning[0].id)
         toast.success('Reward created!')
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
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
               <Flex container alignItems="center">
                  <TunnelHeader
                     title="Select Type of Reward"
                     close={() => closeTunnel(1)}
                  />
                  <Tooltip identifier="coupon_reward_type" />
               </Flex>
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
