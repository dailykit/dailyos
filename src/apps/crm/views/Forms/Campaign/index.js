import React, { useState } from 'react'
import { Toggle, Input, Loader, Text } from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper, CenterDiv } from './styled'
import { CAMPAIGN_DATA, UPDATE_CAMPAIGN } from '../../../graphql'
import { ConditionComp, DetailsComp, RewardComp } from './components'

const CampaignForm = () => {
   const { addTab, tab, setTitle: setTabTitle } = useTabs()
   const { id: campaignId } = useParams()
   const [campaignTitle, setCampaignTitle] = useState('')
   const [campaignType, setCampaignType] = useState('')
   const [state, setState] = useState({})
   const [toggle, setToggle] = useState(false)
   // Subscription
   const { loading } = useSubscription(CAMPAIGN_DATA, {
      variables: {
         id: campaignId,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.campaign)
         setCampaignTitle(data.subscriptionData.data.campaign.metaDetails.title)
         setCampaignType(data.subscriptionData.data.campaign.campaignType)
         setToggle(data.subscriptionData.data.campaign.isActive)
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
                  metaDetails: { title: campaignTitle },
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
         <CenterDiv>
            <Text as="title">Campaign Type: {campaignType}</Text>
         </CenterDiv>
         <StyledHeader gridCol="10fr 1fr">
            <Input
               type="text"
               label="Campaign Name"
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

export default CampaignForm
