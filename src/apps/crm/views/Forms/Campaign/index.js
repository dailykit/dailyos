import React, { useState } from 'react'
import {
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
import { StyledWrapper, InputWrapper, StyledComp, StyledDiv } from './styled'
import { CAMPAIGN_DATA, UPDATE_CAMPAIGN } from '../../../graphql'
import {
   ConditionComp,
   DetailsComp,
   RewardComp,
   BrandCampaign,
} from './components'
import { logger } from '../../../../../shared/utils'
import { InlineLoader } from '../../../../../shared/components'

const CampaignForm = () => {
   const { addTab, tab, setTitle: setTabTitle } = useTabs()
   const { id: campaignId } = useParams()
   const [campaignTitle, setCampaignTitle] = useState({
      value: '',
      meta: {
         isValid: false,
         isTouched: false,
         errors: [],
      },
   })
   const [type, setType] = useState('')
   const [state, setState] = useState({})
   const [toggle, setToggle] = useState(false)
   const [checkbox, setCheckbox] = useState(false)

   // form validation
   const validateCampaignName = value => {
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
   const { loading, error } = useSubscription(CAMPAIGN_DATA, {
      variables: {
         id: campaignId,
      },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         setState(data?.campaign || {})
         setCampaignTitle({
            ...campaignTitle,
            value: data?.campaign?.metaDetails?.title || '',
         })
         setType(data?.campaign?.type || '')
         setToggle(data?.campaign?.isActive || false)
         setTabTitle(data?.campaign?.metaDetails?.title || 'N/A')
         setCheckbox(data?.campaign?.isRewardMulti || false)
      },
   })

   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }

   // Mutation
   const [updateCoupon] = useMutation(UPDATE_CAMPAIGN, {
      onCompleted: () => {
         toast.success('Updated!')
         setTabTitle(campaignTitle.value)
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })

   const updatetoggle = () => {
      updateCoupon({
         variables: {
            id: campaignId,
            set: {
               isActive: !toggle,
            },
         },
      })
   }

   const updateCheckbox = () => {
      updateCoupon({
         variables: {
            id: campaignId,
            set: {
               isRewardMulti: !checkbox,
            },
         },
      })
   }

   //campaign name validation & update name handler
   const onBlur = e => {
      setCampaignTitle({
         ...campaignTitle,
         meta: {
            ...campaignTitle.meta,
            isTouched: true,
            errors: validateCampaignName(e.target.value).errors,
            isValid: validateCampaignName(e.target.value).isValid,
         },
      })
      if (
         validateCampaignName(e.target.value).isValid &&
         validateCampaignName(e.target.value).errors.length === 0
      ) {
         updateCoupon({
            variables: {
               id: campaignId,
               set: {
                  metaDetails: {
                     ...state.metaDetails,
                     title: e.target.value,
                  },
               },
            },
         })
      }
   }

   React.useEffect(() => {
      if (!tab) {
         addTab('Campaign', '/crm/campaign')
      }
   }, [addTab, tab])

   if (loading) return <InlineLoader />
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
                  <Form.Label htmlFor="name" title="Campaign Name">
                     Campaign Name*
                  </Form.Label>
                  <Form.Text
                     id="campaignName"
                     name="campaignName"
                     value={campaignTitle.value}
                     placeholder="Enter the campaign Name"
                     onBlur={onBlur}
                     onChange={e =>
                        setCampaignTitle({
                           ...campaignTitle,
                           value: e.target.value,
                        })
                     }
                  />
                  {campaignTitle.meta.isTouched &&
                     !campaignTitle.meta.isValid &&
                     campaignTitle.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               <Form.Toggle
                  name="campaign_active"
                  onChange={updatetoggle}
                  value={toggle}
               >
                  Active
               </Form.Toggle>
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
                        <DetailsComp state={state} campaignType={type} />
                        <ConditionComp state={state} />
                        <RewardComp
                           state={state}
                           checkbox={checkbox}
                           updateCheckbox={updateCheckbox}
                        />
                     </StyledComp>
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     <BrandCampaign state={state} />
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

export default CampaignForm
