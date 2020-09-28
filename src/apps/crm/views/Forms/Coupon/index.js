import React, { useState } from 'react'
import { Toggle, Input, Loader } from '@dailykit/ui'
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
   // Subscription
   const { loading } = useSubscription(COUPON_DATA, {
      variables: {
         id: couponId,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.coupon)
         setCodeTitle(data.subscriptionData.data.coupon.code)
         setToggle(data.subscriptionData.data.coupon.isActive)
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

   React.useEffect(() => {
      if (!tab) {
         addTab('Customers', '/crm/coupons')
      }
   }, [addTab, tab])

   if (loading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader gridCol="10fr  1.5fr">
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
