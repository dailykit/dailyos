import React, { useEffect, useState } from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Text,
   TunnelHeader,
   Input,
   RadioGroup,
   Loader,
   Tunnel,
   Tunnels,
   ButtonTile,
   useTunnel,
   IconButton,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import {
   TunnelBody,
   StyledContainer,
   StyledRow,
   InputWrap,
   Wrap,
} from './styled'
import { useTabs } from '../../../../../context'
import { UPDATE_REWARD } from '../../../../../graphql'
import { EditIcon } from '../../../../../../../shared/assets/icons'
import { logger } from '../../../../../../../shared/utils'

export default function RewardDetailsunnel({
   state,
   closeTunnel,
   tunnels,
   openTunnel,
   openConditionTunnel,
   conditionId,
   rewardId,
   rewardInfo,
   closeRewardTypeTunnel,
}) {
   console.log(rewardInfo?.priority)
   const { addTab } = useTabs()
   const [priority, setPriority] = useState(1)
   const [rewardValue, setRewardValue] = useState({
      type: 'absolute',
      value: '',
   })
   const [rewardValueType, setRewardValueType] = useState('absolute')
   const [options] = useState([
      { id: 1, title: 'absolute' },
      { id: 2, title: 'conditional' },
   ])

   // Mutation
   const [updateReward] = useMutation(UPDATE_REWARD, {
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
         closeRewardTypeTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong')
         closeTunnel(1)
         logger(error)
      },
   })

   // Handlers
   const saveInfo = () => {
      console.log(rewardId, conditionId, priority, rewardValue)
      updateReward({
         variables: {
            id: rewardId,
            set: {
               conditionId,
               priority,
               rewardValue,
            },
         },
      })
   }

   useEffect(() => {
      setPriority(rewardInfo?.priority)
      setRewardValue(rewardInfo?.rewardValue)
      setRewardValueType(rewardInfo?.rewardValue?.type)
   }, [rewardInfo])

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <TunnelHeader
                  title="Add Reward Details"
                  right={{ action: () => saveInfo(), title: 'Save' }}
                  close={() => closeTunnel(1)}
               />
               <TunnelBody>
                  {conditionId ? (
                     <StyledContainer>
                        <StyledRow>
                           <Text as="p">View/Edit Conditions</Text>
                           <IconButton
                              type="outline"
                              onClick={() => openConditionTunnel(1)}
                           >
                              <EditIcon />
                           </IconButton>
                        </StyledRow>
                     </StyledContainer>
                  ) : (
                     <ButtonTile
                        type="primary"
                        size="sm"
                        text="Add Reward's Condition"
                        style={{ margin: '20px 0' }}
                        onClick={() => openConditionTunnel(1)}
                     />
                  )}
                  <InputWrap>
                     <Input
                        type="number"
                        label="Priority"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                     />
                  </InputWrap>
                  <InputWrap>
                     <Wrap>
                        <Text as="title">Add Reward Value</Text>
                     </Wrap>
                     <Wrap>
                        <RadioGroup
                           options={options}
                           active={rewardValueType === 'absolute' ? 1 : 2}
                           onChange={option => setRewardValueType(option.title)}
                        />
                     </Wrap>
                     {rewardValueType === 'absolute' ? (
                        <Wrap>
                           <Input
                              type="number"
                              label="Reward Value"
                              value={rewardValue?.value || null}
                              onChange={e =>
                                 setRewardValue({
                                    type: rewardValueType,
                                    value: +e.target.value,
                                 })
                              }
                           />
                        </Wrap>
                     ) : (
                        <InputWrap>
                           <Wrap>
                              <Input
                                 type="number"
                                 label="Maximum Reward Value"
                                 value={rewardValue?.value?.max}
                                 onChange={e =>
                                    setRewardValue({
                                       ...rewardValue,
                                       type: rewardValueType,
                                       value: {
                                          ...rewardValue?.value,
                                          max: +e.target.value,
                                       },
                                    })
                                 }
                              />
                           </Wrap>
                           <Wrap>
                              <Input
                                 type="number"
                                 label="Reward In Percentage"
                                 value={rewardValue?.value?.percentage}
                                 onChange={e =>
                                    setRewardValue({
                                       ...rewardValue,
                                       type: rewardValueType,
                                       value: {
                                          ...rewardValue.value,
                                          percentage: +e.target.value,
                                       },
                                    })
                                 }
                              />
                           </Wrap>
                        </InputWrap>
                     )}
                  </InputWrap>
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </>
   )
}
