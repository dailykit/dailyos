import React, { useState } from 'react'
import { Toggle, Input, Loader, Checkbox, Text } from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import { COUPON_DATA, UPDATE_COUPON } from '../../../graphql'
import { ConditionComp, DetailsComp, RewardComp } from './components'
import { InputWrapper } from './styled'

const CouponForm = () => {
   const { addTab, tab, setTitle: setTabTitle } = useTabs()
   const { id: couponId } = useParams()
   const [codeTitle, setCodeTitle] = useState('')
   const [state, setState] = useState({})
   const [toggle, setToggle] = useState(false)
   const [checkbox, setCheckbox] = useState(false)
   // Subscription
   const { loading } = useSubscription(COUPON_DATA, {
      variables: {
         id: couponId,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.coupon)
         setCodeTitle(data.subscriptionData.data.coupon.code)
         setToggle(data.subscriptionData.data.coupon.isActive)
         setCheckbox(data.subscriptionData.data.coupon.isRewardMulti)
         // collectionDispatch({
         //    type: 'SEED',
         //    payload: data.coupon,
         // })
      },
   })

   // Mutation
   const [updateCoupon] = useMutation(UPDATE_COUPON, {
      onCompleted: () => {
         toast.success('Updated!')
         setTabTitle(codeTitle)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   const updateCodeTitle = () => {
      if (codeTitle) {
         updateCoupon({
            variables: {
               id: couponId,
               set: {
                  code: codeTitle,
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

   if (loading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader gridCol="10fr  3fr 2fr">
            <InputWrapper>
               <Input
                  type="text"
                  label="Coupon Code"
                  name="code"
                  value={codeTitle}
                  onChange={e => setCodeTitle(e.target.value)}
                  onBlur={updateCodeTitle}
               />
            </InputWrapper>
            <Checkbox id="label" checked={checkbox} onChange={updateCheckbox}>
               Allow multiple rewards
            </Checkbox>
            <Toggle
               checked={toggle}
               setChecked={updatetoggle}
               label="Coupon Active"
            />
         </StyledHeader>
         <DetailsComp state={state} />
         <ConditionComp state={state} />
         <RewardComp state={state} />
      </StyledWrapper>
   )
}

export default CouponForm
