import React, { useEffect, useState } from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Text,
   TunnelHeader,
   Form,
   RadioGroup,
   Flex,
   Tunnel,
   Tunnels,
   ButtonTile,
   ComboButton,
   Spacer,
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
import { Tooltip } from '../../../../../../../shared/components'

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
                        <Flex
                           container
                           justifyContent="space-between"
                           margin="0 0 16px 0"
                        >
                           <Flex container alignItems="flex-end">
                              <Text as="title">Reward Condition</Text>
                              <Tooltip identifier="campaign_reward_condition" />
                           </Flex>
                           <ComboButton
                              type="outline"
                              size="sm"
                              onClick={() => openConditionTunnel(1)}
                           >
                              <EditIcon color="#00a7e1" />
                              View/Edit
                           </ComboButton>
                        </Flex>
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
                  <Form.Group>
                     <Flex container alignItems="flex-end">
                        <Form.Label htmlFor="number" title="priority">
                           Priority
                        </Form.Label>
                        <Tooltip identifier="campaign_reward_priority" />
                     </Flex>
                     <Form.Number
                        id="priority"
                        name="priority"
                        value={priority}
                        placeholder="Enter Priority "
                        onChange={e => setPriority(e.target.value)}
                     />
                  </Form.Group>
                  <Spacer size="24px" />
                  <InputWrap>
                     <Flex container alignItems="flex-end">
                        <Text as="title">Reward Value Type</Text>
                        <Tooltip identifier="campaign_reward_value_type" />
                     </Flex>
                     <Spacer size="24px" />
                     <RadioGroup
                        options={options}
                        active={rewardValueType === 'absolute' ? 1 : 2}
                        onChange={option => setRewardValueType(option.title)}
                     />
                     <Spacer size="24px" />
                     {rewardValueType === 'absolute' ? (
                        <Form.Group>
                           <Form.Label
                              htmlFor="number"
                              title="absoluteRewardValue"
                           >
                              Reward Value
                           </Form.Label>
                           <Form.Number
                              id="absoluteRewardVal"
                              name="absoluteRewardVal"
                              placeholder="Enter Reward Value "
                              value={rewardValue?.value || null}
                              onChange={e =>
                                 setRewardValue({
                                    type: rewardValueType,
                                    value: +e.target.value,
                                 })
                              }
                           />
                        </Form.Group>
                     ) : (
                        <InputWrap>
                           <Form.Group>
                              <Form.Label
                                 htmlFor="number"
                                 title="MaxRewardValue"
                              >
                                 Maximum Reward Value
                              </Form.Label>
                              <Form.Number
                                 id="MaxRewardValue"
                                 name="MaxRewardValue"
                                 placeholder="Enter maximum value of reward  "
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
                           </Form.Group>
                           <Spacer size="24px" />
                           <Form.Group>
                              <Form.Label
                                 htmlFor="number"
                                 title="PercentRewardValue"
                              >
                                 Reward Percentage
                              </Form.Label>
                              <Form.Number
                                 id="PercentRewardValue"
                                 name="PercentRewardValue"
                                 placeholder="Enter percentage value of reward  "
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
                           </Form.Group>
                        </InputWrap>
                     )}
                  </InputWrap>
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </>
   )
}
