import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Text, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { TunnelBody, SolidTile } from './styled'
import { useTabs } from '../../../../context'
import { CREATE_CAMPAIGN } from '../../../../graphql'
import { randomSuffix } from '../../../../../../shared/utils'

export default function CampaignTypeTunnel({ close }) {
   const { addTab } = useTabs()
   const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
      onCompleted: data => {
         addTab(
            data.createCampaign.metaDetails.title,
            `/crm/campaign/${data.createCampaign.id}`
         )
         toast.success('Campaign created!')
      },
      onError: error => {
         toast.error(`Error : ${error.message}`)
      },
   })
   const createCampaignHandler = type => {
      createCampaign({
         variables: {
            campaignType: type,
            metaDetails: { title: `Campaign Title-${randomSuffix()}` },
         },
      })
   }
   return (
      <>
         <TunnelHeader title="Select Type of Campaign" close={() => close(1)} />
         <TunnelBody>
            <SolidTile onClick={() => createCampaignHandler('Sign Up')}>
               <Text as="h1">Sign Up</Text>
               <Text as="subtitle">Create Campaign For Sign Up Type.</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => createCampaignHandler('Referral')}>
               <Text as="h1">Referral</Text>
               <Text as="subtitle">Create Campaign For Referral Type.</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => createCampaignHandler('Post Order')}>
               <Text as="h1">Post Order</Text>
               <Text as="subtitle">Create Campaign For Post Order Type.</Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}
