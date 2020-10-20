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
   Spacer,
   TextButton,
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
import { logger } from '../../../../../../../shared/utils'
import { Tooltip } from '../../../../../../../shared/components'

export default function RewardDetailsunnel({
   closeTunnel,
   tunnels,
   openConditionTunnel,
   conditionId,
   rewardId,
   rewardInfo,
   updateConditionId,
   closeRewardTypeTunnel,
}) {
   const { addTab } = useTabs()
   const [priority, setPriority] = useState({
      value: 1,
      meta: {
         isValid: false,
         isTouched: false,
         errors: [],
      },
   })
   const [rewardValue, setRewardValue] = useState({
      type: 'absolute',
      value: '',
   })
   const [rewardValueType, setRewardValueType] = useState('absolute')
   const [options] = useState([
      { id: 1, title: 'absolute' },
      { id: 2, title: 'conditional' },
   ])

   // form validation
   const validatorFunc = value => {
      let isValid = true
      let errors = []
      if (value <= 0 && value !== '') {
         isValid = false
         errors = [...errors, "Priority can't be negative or zero"]
      }
      if (value === '') {
         isValid = false
         errors = [...errors, 'Please enter priority or valid priority ']
      }
      console.log(typeof value)
      return { isValid, errors }
   }

   // Mutation
   const [updateReward, { loading }] = useMutation(UPDATE_REWARD, {
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
      if (validatorFunc(priority.value).isValid) {
         updateReward({
            variables: {
               id: rewardId,
               set: {
                  conditionId,
                  priority: priority.value,
                  rewardValue,
               },
            },
         })
         setPriority({
            value: 1,
            meta: {
               isValid: false,
               isTouched: false,
               errors: [],
            },
         })
         setRewardValue({
            type: 'absolute',
            value: '',
         })
         setRewardValueType('absolute')
         updateConditionId(null)
      } else {
         toast.error('Please check reward details error !')
      }
   }

   const closeFunc = () => {
      setPriority({
         value: 1,
         meta: {
            isValid: false,
            isTouched: false,
            errors: [],
         },
      })
      setRewardValue({
         type: 'absolute',
         value: '',
      })
      setRewardValueType('absolute')
      updateConditionId(null)
      closeTunnel(1)
   }

   //reward priority value validation
   const onBlur = e => {
      setPriority({
         ...priority,
         meta: {
            ...priority.meta,
            isTouched: true,
            errors: validatorFunc(e.target.value).errors,
            isValid: validatorFunc(e.target.value).isValid,
         },
      })
   }

   useEffect(() => {
      setPriority({ ...priority, value: rewardInfo?.priority || 1 })
      setRewardValue(rewardInfo?.rewardValue || { type: 'absolute', value: '' })
      setRewardValueType(rewardInfo?.rewardValue?.type || 'absolute')
   }, [rewardInfo])

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <TunnelHeader
                  title="Add Reward Details"
                  right={{
                     action: () => saveInfo(),
                     title: loading ? 'Saving...' : 'Save',
                  }}
                  close={() => closeFunc()}
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
                              <Tooltip identifier="coupon_reward_condition" />
                           </Flex>
                           <TextButton
                              type="outline"
                              size="sm"
                              onClick={() => openConditionTunnel(1)}
                           >
                              View/Edit
                           </TextButton>
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
                        <Tooltip identifier="coupon_reward_priority" />
                     </Flex>
                     <Form.Number
                        id="priority"
                        name="priority"
                        value={priority.value}
                        placeholder="Enter Priority "
                        onBlur={onBlur}
                        onChange={e =>
                           setPriority({ ...priority, value: e.target.value })
                        }
                     />
                     {priority.meta.isTouched &&
                        !priority.meta.isValid &&
                        priority.meta.errors.map((error, index) => (
                           <Form.Error key={index}>{error}</Form.Error>
                        ))}
                  </Form.Group>
                  <Spacer size="24px" />
                  <InputWrap>
                     <Flex container alignItems="flex-end">
                        <Text as="title">Reward Value Type</Text>
                        <Tooltip identifier="coupon_reward_value_type" />
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
