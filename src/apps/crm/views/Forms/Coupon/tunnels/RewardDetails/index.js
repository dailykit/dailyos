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
import validatorFunc from '../../../validator'

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
      meta: {
         isValid: false,
         isTouched: false,
         errors: [],
         type: '',
      },
   })
   const [options] = useState([
      { id: 1, title: 'absolute' },
      { id: 2, title: 'conditional' },
   ])

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
      if (priority.meta.isValid && rewardValue.meta.isValid) {
         updateReward({
            variables: {
               id: rewardId,
               set: {
                  conditionId,
                  priority: priority.value,
                  rewardValue: {
                     type: rewardValue.type,
                     value: rewardValue.value,
                  },
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
            meta: {
               type: '',
               isValid: false,
               isTouched: false,
               errors: [],
            },
         })
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
         meta: {
            type: '',
            isValid: false,
            isTouched: false,
            errors: [],
         },
      })
      updateConditionId(null)
      closeTunnel(1)
   }

   //reward priority value validation
   const onBlur = (e, name) => {
      switch (name) {
         case 'priority':
            return setPriority({
               ...priority,
               meta: {
                  ...priority.meta,
                  isTouched: true,
                  errors: validatorFunc.priority(e.target.value).errors,
                  isValid: validatorFunc.priority(e.target.value).isValid,
               },
            })

         case 'absoluteRewardVal':
            return setRewardValue({
               ...rewardValue,
               meta: {
                  ...rewardValue.meta,
                  type: 'absolute',
                  isTouched: true,
                  errors: validatorFunc.amount(e.target.value).errors,
                  isValid: validatorFunc.amount(e.target.value).isValid,
               },
            })
         case 'MaxRewardValue':
            return setRewardValue({
               ...rewardValue,
               meta: {
                  ...rewardValue.meta,
                  type: 'max',
                  isTouched: true,
                  errors: validatorFunc.amount(e.target.value).errors,
                  isValid: validatorFunc.amount(e.target.value).isValid,
               },
            })
         case 'PercentRewardValue':
            return setRewardValue({
               ...rewardValue,
               meta: {
                  ...rewardValue.meta,
                  type: 'percentage',
                  isTouched: true,
                  errors: validatorFunc.amount(e.target.value).errors,
                  isValid: validatorFunc.amount(e.target.value).isValid,
               },
            })
         default:
            console.log(name)
      }
   }

   useEffect(() => {
      setPriority({
         value: rewardInfo?.priority || 1,
         meta: {
            isValid: rewardInfo.priority ? true : false,
            isTouched: false,
            errors: [],
         },
      })
      setRewardValue({
         ...(rewardInfo?.rewardValue || {
            type: 'absolute',
            value: '',
            meta: {
               isValid: false,
               isTouched: false,
               errors: [],
               type: '',
            },
         }),
         meta: {
            isValid: true,
            isTouched: false,
            errors: [],
            type: '',
         },
      })
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
                  tooltip={
                     <Tooltip identifier="coupon_rewardDetails_tunnelHeader" />
                  }
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
                        value={priority?.value || null}
                        placeholder="Enter Priority "
                        onBlur={e => onBlur(e, 'priority')}
                        onChange={e =>
                           setPriority({ ...priority, value: +e.target.value })
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
                        active={rewardValue.type === 'absolute' ? 1 : 2}
                        onChange={option =>
                           setRewardValue({
                              ...rewardValue,
                              type: option.title,
                           })
                        }
                     />
                     <Spacer size="24px" />
                     {rewardValue.type === 'absolute' ? (
                        <Form.Group>
                           <Form.Label
                              htmlFor="number"
                              title="absoluteRewardValue"
                           >
                              <Flex container alignItems="center">
                                 Reward Value
                                 <Tooltip identifier="coupon_absolute_reward_value" />
                              </Flex>
                           </Form.Label>
                           <Form.Number
                              id="absoluteRewardVal"
                              name="absoluteRewardVal"
                              placeholder="Enter Reward Value "
                              value={rewardValue?.value || null}
                              onBlur={e => onBlur(e, 'absoluteRewardVal')}
                              onChange={e =>
                                 setRewardValue({
                                    ...rewardValue,
                                    value: +e.target.value,
                                 })
                              }
                           />
                           {rewardValue.meta.type === 'absolute' &&
                              rewardValue.meta.isTouched &&
                              !rewardValue.meta.isValid &&
                              rewardValue.meta.errors.map((error, index) => (
                                 <Form.Error key={index}>{error}</Form.Error>
                              ))}
                        </Form.Group>
                     ) : (
                        <InputWrap>
                           <Form.Group>
                              <Form.Label
                                 htmlFor="number"
                                 title="MaxRewardValue"
                              >
                                 <Flex container alignItems="center">
                                    Maximum Reward Value
                                    <Tooltip identifier="coupon_max_reward_value" />
                                 </Flex>
                              </Form.Label>
                              <Form.Number
                                 id="MaxRewardValue"
                                 name="MaxRewardValue"
                                 placeholder="Enter maximum value of reward  "
                                 value={rewardValue?.value?.max || null}
                                 onBlur={e => onBlur(e, 'MaxRewardValue')}
                                 onChange={e =>
                                    setRewardValue({
                                       ...rewardValue,
                                       value: {
                                          ...rewardValue?.value,
                                          max: +e.target.value,
                                       },
                                    })
                                 }
                              />
                              {rewardValue.meta.type === 'max' &&
                                 rewardValue.meta.isTouched &&
                                 !rewardValue.meta.isValid &&
                                 rewardValue.meta.errors.map((error, index) => (
                                    <Form.Error key={index}>{error}</Form.Error>
                                 ))}
                           </Form.Group>
                           <Spacer size="24px" />
                           <Form.Group>
                              <Form.Label
                                 htmlFor="number"
                                 title="PercentRewardValue"
                              >
                                 <Flex container alignItems="center">
                                    Reward Percentage
                                    <Tooltip identifier="coupon_percentage_reward_value" />
                                 </Flex>
                              </Form.Label>
                              <Form.Number
                                 id="PercentRewardValue"
                                 name="PercentRewardValue"
                                 placeholder="Enter percentage value of reward"
                                 value={rewardValue?.value?.percentage || null}
                                 onBlur={e => onBlur(e, 'PercentRewardValue')}
                                 onChange={e =>
                                    setRewardValue({
                                       ...rewardValue,
                                       value: {
                                          ...rewardValue.value,
                                          percentage: +e.target.value,
                                       },
                                    })
                                 }
                              />
                              {rewardValue.meta.type === 'percentage' &&
                                 rewardValue.meta.isTouched &&
                                 !rewardValue.meta.isValid &&
                                 rewardValue.meta.errors.map((error, index) => (
                                    <Form.Error key={index}>{error}</Form.Error>
                                 ))}
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
