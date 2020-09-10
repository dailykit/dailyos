import React, { useState } from 'react'
import { Toggle, Input, Loader } from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import { CAMPAIGN_DATA, UPDATE_CAMPAIGN } from '../../../graphql'
import { ConditionComp, DetailsComp, RewardComp } from './components'

const CouponForm = () => {
   const { addTab, tab, setTitle: setTabTitle } = useTabs()
   const { id: campaignId } = useParams()
   const [campaignTitle, setCampaignTitle] = useState('')
   const [state, setState] = useState({})
   const [toggle, setToggle] = useState(false)
   // Subscription
   const { loading } = useSubscription(CAMPAIGN_DATA, {
      variables: {
         id: campaignId,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.coupon)
         setCampaignTitle(data.subscriptionData.data.coupon.code)
         setToggle(data.subscriptionData.data.coupon.isActive)
         // collectionDispatch({
         //    type: 'SEED',
         //    payload: data.coupon,
         // })
      },
   })

   // Mutation
   const [updateCoupon] = useMutation(UPDATE_CAMPAIGN, {
      onCompleted: () => {
         toast.success('Updated!')
         setTabTitle(campaignTitle)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   const updateCampaignTitle = () => {
      if (campaignTitle) {
         updateCoupon({
            variables: {
               id: campaignId,
               set: {
                  campaignType: campaignTitle,
               },
            },
         })
      }
   }
   const updatetoggle = () => {
      if (toggle || !toggle) {
         updateCoupon({
            variables: {
               id: campaignId,
               set: {
                  isActive: !toggle,
               },
            },
         })
      }
   }

   React.useEffect(() => {
      if (!tab) {
         addTab('Customers', '/crm/customers')
      }
   }, [addTab, tab])

   if (loading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader gridCol="10fr  1fr">
            <Input
               type="text"
               label="Coupon Code"
               name="code"
               value={campaignTitle}
               onChange={e => setCampaignTitle(e.target.value)}
               onBlur={updateCampaignTitle}
            />
            <Toggle checked={toggle} setChecked={updatetoggle} />
         </StyledHeader>
         <DetailsComp state={state} />
         <ConditionComp state={state} />
         <RewardComp state={state} />
      </StyledWrapper>
   )
}

export default CouponForm
