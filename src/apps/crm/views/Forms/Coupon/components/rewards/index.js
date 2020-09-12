import React, { useState } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   useTunnel,
   Tunnels,
   Tunnel,
   Text,
   IconButton,
   PlusIcon,
} from '@dailykit/ui'
import { EditIcon } from '../../../../../../../shared/assets/icons'
import { RewardsTunnel, RewardDetailsTunnel } from '../../tunnels'
import { REWARD_DATA_BY_COUPON_ID } from '../../../../../graphql'
import Conditions from '../../../../../../../shared/components/Conditions'
import { StyledContainer, StyledRow } from './styled'
const Rewards = ({ state }) => {
   const [typeTunnels, openTypeTunnel, closeTypeTunnel] = useTunnel(1)
   const [rewardTunnels, openRewardTunnel, closeRewardTunnel] = useTunnel(1)
   const [
      conditionTunnels,
      openConditionTunnel,
      closeConditionTunnel,
   ] = useTunnel(2)
   const [conditionId, setConditionId] = useState(null)
   const [rewardId, setRewardId] = useState(null)
   const [rewardInfoArray, setRewardInfoArray] = useState([])
   const [rewardTunnelInfo, setRewardTunnelInfo] = useState({})

   // Subscription
   const { data: rewardData, loading } = useSubscription(
      REWARD_DATA_BY_COUPON_ID,
      {
         variables: {
            couponId: state.id,
         },
         onSubscriptionData: data => {
            setRewardInfoArray(data.subscriptionData.data.crm_reward)
         },
      }
   )

   const addCondition = id => {
      setConditionId(id)
   }

   const editRewardDetails = rewardInfo => {
      console.log(rewardInfo)
      setRewardTunnelInfo(rewardInfo)
      openRewardTunnel(1)
   }

   return (
      <>
         <RewardsTunnel
            state={state}
            closeTunnel={closeTypeTunnel}
            openTunnel={openTypeTunnel}
            tunnels={typeTunnels}
            openRewardTunnel={openRewardTunnel}
            getRewardId={id => setRewardId(id)}
         />
         <RewardDetailsTunnel
            closeTunnel={closeRewardTunnel}
            openTunnel={openRewardTunnel}
            tunnels={rewardTunnels}
            state={state}
            openConditionTunnel={openConditionTunnel}
            conditionId={conditionId}
            rewardId={rewardId}
            rewardInfo={rewardTunnelInfo}
            closeRewardTypeTunnel={layer => closeTypeTunnel(layer)}
         />
         <Conditions
            id={conditionId}
            onSave={id => addCondition(id)}
            tunnels={conditionTunnels}
            openTunnel={openConditionTunnel}
            closeTunnel={closeConditionTunnel}
         />
         {rewardInfoArray.length > 0 ? (
            <StyledContainer>
               <Text as="title">Reward Information</Text>
               {rewardInfoArray.map(rewardInfo => {
                  return (
                     <StyledRow key={rewardInfo.id}>
                        <Text as="subtitle">View/Edit Reward</Text>
                        <IconButton
                           type="outline"
                           onClick={() => editRewardDetails(rewardInfo)}
                        >
                           <EditIcon />
                        </IconButton>
                     </StyledRow>
                  )
               })}
               <StyledRow>
                  <Text as="p">Add More Reward</Text>
                  <IconButton type="solid" onClick={() => openTypeTunnel(1)}>
                     <PlusIcon />
                  </IconButton>
               </StyledRow>
            </StyledContainer>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Rewards"
               onClick={() => openTypeTunnel(1)}
               style={{ margin: '20px 0' }}
            />
         )}
      </>
   )
}

export default Rewards
