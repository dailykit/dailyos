import React, { useState } from 'react'
import {
   Toggle,
   Flex,
   Loader,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   Form,
} from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTabs } from '../../../context'
import { StyledWrapper, StyledComp, InputWrapper, StyledDiv } from './styled'
import { COUPON_DATA, UPDATE_COUPON } from '../../../graphql'
import {
   ConditionComp,
   DetailsComp,
   RewardComp,
   BrandCoupons,
} from './components'
import { logger } from '../../../../../shared/utils'

const CouponForm = () => {
   const { addTab, tab, setTitle: setTabTitle } = useTabs()
   const { id: couponId } = useParams()
   const [codeTitle, setCodeTitle] = useState({
      value: '',
      meta: {
         isValid: false,
         isTouched: false,
         errors: [],
      },
   })
   const [state, setState] = useState({})
   const [toggle, setToggle] = useState(false)
   const [checkbox, setCheckbox] = useState(false)

   // form validation
   const validateCouponCode = value => {
      const text = value.trim()
      console.log(`text ${text.length}`)
      let isValid = true
      let errors = []
      if (text.length < 2) {
         isValid = false
         errors = [...errors, 'Must have atleast two letters.']
      }
      console.log(isValid)
      return { isValid, errors }
   }

   // Subscription
   const { loading, error } = useSubscription(COUPON_DATA, {
      variables: {
         id: couponId,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data?.subscriptionData?.data?.coupon || {})
         setCodeTitle({
            ...codeTitle,
            value: data?.subscriptionData?.data?.coupon?.code || '',
         })
         setToggle(data?.subscriptionData?.data?.coupon?.isActive || false)
         setCheckbox(
            data?.subscriptionData?.data?.coupon?.isRewardMulti || false
         )
      },
   })
   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }

   // Mutation
   const [updateCoupon] = useMutation(UPDATE_COUPON, {
      onCompleted: () => {
         toast.success('Updated!')
         setTabTitle(codeTitle.value)
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })

   const updateCodeTitle = () => {
      if (codeTitle.value) {
         updateCoupon({
            variables: {
               id: couponId,
               set: {
                  code: codeTitle.value,
               },
            },
         })
      }
   }
   const updatetoggle = () => {
      if (toggle || !toggle) {
         updateCoupon({
            variables: {
               id: couponId,
               set: {
                  isActive: !toggle,
               },
            },
         })
      }
   }
   const updateCheckbox = () => {
      if (checkbox || !checkbox) {
         updateCoupon({
            variables: {
               id: couponId,
               set: {
                  isRewardMulti: !checkbox,
               },
            },
         })
      }
   }

   React.useEffect(() => {
      if (!tab) {
         addTab('Coupons', '/crm/coupons')
      }
   }, [addTab, tab])

   //coupon code validation & update name handler
   const onBlur = e => {
      setCodeTitle({
         ...codeTitle,
         meta: {
            ...codeTitle.meta,
            isTouched: true,
            errors: validateCouponCode(codeTitle.value).errors,
            isValid: validateCouponCode(codeTitle.value).isValid,
         },
      })
      if (codeTitle.meta.isValid && codeTitle.meta.errors.length === 0) {
         console.log(`mutation should fire ${codeTitle.meta.isValid}`)
         updateCoupon({
            variables: {
               id: couponId,
               set: {
                  metaDetails: {
                     ...state.metaDetails,
                     title: codeTitle.value,
                  },
               },
            },
         })
      }
   }

   if (loading) return <Loader />
   return (
      <StyledWrapper>
         <InputWrapper>
            <Flex
               container
               alignItems="center"
               justifyContent="space-between"
               padding="0 0 16px 0"
            >
               <Form.Group>
                  <Form.Label htmlFor="name" title="Coupon Code ">
                     Coupon Code*
                  </Form.Label>
                  <Form.Text
                     id="couponCode"
                     name="couponCode"
                     value={codeTitle.value}
                     placeholder="Enter the Coupon Code "
                     onChange={e => {
                        setCodeTitle({
                           ...codeTitle,
                           value: e.target.value,
                        })
                        console.log(codeTitle)
                     }}
                     onBlur={onBlur}
                  />
                  {codeTitle.meta.isTouched &&
                     !codeTitle.meta.isValid &&
                     codeTitle.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>

               <Toggle
                  checked={toggle}
                  setChecked={updatetoggle}
                  label="Coupon Active"
               />
            </Flex>
         </InputWrapper>
         <StyledDiv>
            <HorizontalTabs>
               <HorizontalTabList>
                  <HorizontalTab>Details</HorizontalTab>
                  <HorizontalTab>Brand</HorizontalTab>
                  <HorizontalTab>Insights</HorizontalTab>
               </HorizontalTabList>
               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     <StyledComp>
                        <DetailsComp state={state} />
                        <ConditionComp state={state} />
                        <RewardComp
                           state={state}
                           updateCheckbox={updateCheckbox}
                           checkbox={checkbox}
                        />
                     </StyledComp>
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     <BrandCoupons state={state} />
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     Insights Content coming soon!!
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         </StyledDiv>
      </StyledWrapper>
   )
}

export default CouponForm
