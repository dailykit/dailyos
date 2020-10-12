import React, { useState } from 'react'
import { useSubscription, useMutation, useLazyQuery } from '@apollo/react-hooks'
import {
   ButtonTile,
   ButtonGroup,
   useTunnel,
   Loader,
   Checkbox,
   Tunnels,
   Tunnel,
   Text,
   IconButton,
   ComboButton,
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
import { StyledContainer, StyledRow, RewardDiv, StyledDiv } from './styled'
const Rewards = ({ state, checkbox, updateCheckbox }) => {
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
   const [editMode, setEditMode] = useState(false)
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

   const [fetchReward, { loading: listLoading, data }] = useLazyQuery(
      REWARD_DATA,
      {
         onCompleted: data => {
            console.log(data.crm_reward_by_pk)
            setRewardTunnelInfo(data.crm_reward_by_pk)
            setConditionId(data.crm_reward_by_pk.conditionId)
            setRewardId(data.crm_reward_by_pk.id)
            setEditMode(true)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

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
      openRewardTunnel(1)
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
            updateConditionId={val => setConditionId(val)}
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
               <StyledRow>
                  <Text as="title">Reward Information</Text>
                  {rewardInfoArray.length > 1 && (
                     <Checkbox
                        id="label"
                        checked={checkbox}
                        onChange={updateCheckbox}
                     >
                        Allow multiple rewards
                     </Checkbox>
                  )}
               </StyledRow>

               {rewardInfoArray.map(rewardInfo => {
                  return (
                     <RewardDiv key={rewardInfo.id}>
                        <Text as="subtitle">{rewardInfo.type} </Text>
                        <StyledRow>
                           <IconButton
                              type="ghost"
                              onClick={() => EditRewardDetails(rewardInfo.id)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                           <IconButton
                              type="ghost"
                              onClick={() => deleteHandler(rewardInfo)}
                           >
                              <DeleteIcon color="#555B6E" />
                           </IconButton>
                        </StyledRow>
                     </RewardDiv>
                  )
               })}

               <StyledRow>
                  <ComboButton type="ghost" onClick={() => openTypeTunnel(1)}>
                     Add More Reward
                     <PlusIcon color="#00a7e1" />
                  </ComboButton>
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
