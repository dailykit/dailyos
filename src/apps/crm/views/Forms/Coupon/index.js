import React, { useState } from 'react'
import {
   Toggle,
   Input,
   Loader,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTabs } from '../../../context'
import {
   StyledHeader,
   StyledWrapper,
   StyledComp,
   InputWrapper,
   StyledDiv,
} from './styled'
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
   const [codeTitle, setCodeTitle] = useState('')
   const [state, setState] = useState({})
   const [toggle, setToggle] = useState(false)
   const [checkbox, setCheckbox] = useState(false)
   // Subscription
   const { loading, error } = useSubscription(COUPON_DATA, {
      variables: {
         id: couponId,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.coupon)
         setCodeTitle(data.subscriptionData.data.coupon.code)
         setToggle(data.subscriptionData.data.coupon.isActive)
         setCheckbox(data.subscriptionData.data.coupon.isRewardMulti)
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
         setTabTitle(codeTitle)
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
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
         <StyledHeader gridCol="15fr  2fr">
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
