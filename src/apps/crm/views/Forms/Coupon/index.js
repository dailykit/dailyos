import React, { useState } from 'react'
import {
   Toggle,
   Flex,
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
import { InlineLoader } from '../../../../../shared/components'
import CouponContext from '../../../context/Coupon/CouponForm'

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
            errors: validateCouponCode(e.target.value).errors,
            isValid: validateCouponCode(e.target.value).isValid,
         },
      })
      if (
         validateCouponCode(e.target.value).isValid &&
         validateCouponCode(e.target.value).errors.length === 0
      ) {
         updateCoupon({
            variables: {
               id: couponId,
               set: {
                  code: e.target.value,
               },
            },
         })
      }
   }

   if (loading) return <InlineLoader />
   return (
      <CouponContext.Provider
         value={{
            state,
            checkbox,
            updateCheckbox: updateCheckbox,
            toggle,
         }}
      >
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
                        onBlur={onBlur}
                        onChange={e =>
                           setCodeTitle({
                              ...codeTitle,
                              value: e.target.value,
                           })
                        }
                     />
                     {codeTitle.meta.isTouched &&
                        !codeTitle.meta.isValid &&
                        codeTitle.meta.errors.map((error, index) => (
                           <Form.Error key={index}>{error}</Form.Error>
                        ))}
                  </Form.Group>
                  <Form.Group>
                     <Form.Toggle
                        name="coupon_active"
                        onChange={updatetoggle}
                        value={toggle}
                     >
                        Active
                     </Form.Toggle>
                  </Form.Group>
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
                           <DetailsComp />
                           <ConditionComp />
                           <RewardComp />
                        </StyledComp>
                     </HorizontalTabPanel>
                     <HorizontalTabPanel>
                        <BrandCoupons />
                     </HorizontalTabPanel>
                     <HorizontalTabPanel>
                        Insights Content coming soon!!
                     </HorizontalTabPanel>
                  </HorizontalTabPanels>
               </HorizontalTabs>
            </StyledDiv>
         </StyledWrapper>
      </CouponContext.Provider>
   )
}

export default CouponForm
