import React, { useState } from 'react'
import { useSubscription, useMutation, useLazyQuery } from '@apollo/react-hooks'
import {
   ButtonTile,
   ButtonGroup,
   useTunnel,
   Loader,
   Tunnels,
   Tunnel,
   Text,
   IconButton,
   PlusIcon,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { EditIcon, DeleteIcon } from '../../../../../../../shared/assets/icons'
import { RewardsTunnel, RewardDetailsTunnel } from '../../tunnels'
import {
   REWARD_DATA_BY_COUPON_ID,
   DELETE_REWARD,
   REWARD_DATA,
} from '../../../../../graphql'
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

   const [fetchReward, { listLoading, data }] = useLazyQuery(REWARD_DATA, {
      onCompleted: data => {
         console.log(data.crm_reward_by_pk)
         setRewardTunnelInfo(data.crm_reward_by_pk)
         setConditionId(data.crm_reward_by_pk.conditionId)
         setRewardId(data.crm_reward_by_pk.id)
         openRewardTunnel(1)
      },
   })

   const [deleteReward] = useMutation(DELETE_REWARD, {
      onCompleted: () => {
         toast.success('Reward deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   const addCondition = id => {
      setConditionId(id)
   }

   const EditRewardDetails = id => {
      fetchReward({
         variables: {
            id,
         },
      })
   }

   // Handler
   const deleteHandler = rewardInfo => {
      console.log(rewardInfo)
      if (
         window.confirm(
            `Are you sure you want to delete reward - ${rewardInfo.id}?`
         )
      ) {
         deleteReward({
            variables: {
               id: rewardInfo.id,
            },
         })
      }
   }

   if (loading || listLoading) return <Loader />

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
                        <Text as="subtitle">{rewardInfo.type} </Text>
                        <ButtonGroup align="left">
                           <IconButton
                              type="outline"
                              onClick={() => EditRewardDetails(rewardInfo.id)}
                           >
                              <EditIcon />
                           </IconButton>
                           <IconButton
                              type="outline"
                              onClick={() => deleteHandler(rewardInfo)}
                           >
                              <DeleteIcon />
                           </IconButton>
                        </ButtonGroup>
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
