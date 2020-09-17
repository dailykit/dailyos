import React from 'react'
import { ButtonTile, useTunnel } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { UPDATE_CAMPAIGN } from '../../../../../graphql'
import BasicInfoTunnel from '../../../../../../../shared/components/BasicInfo'
import HorizontalCard from '../../../../../../../shared/components/HorizontalCard'

const Details = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   // Mutations
   const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error!')
         closeTunnel(1)
      },
   })

   // Handlers
   const saveInfo = info => {
      updateCampaign({
         variables: {
            id: state.id,
            set: {
               metaDetails: info,
            },
         },
      })
   }

   return (
      <>
         <BasicInfoTunnel
            data={state.metaDetails}
            closeTunnel={closeTunnel}
            openTunnel={openTunnel}
            tunnels={tunnels}
            onSave={info => saveInfo(info)}
         />
         {state?.metaDetails?.title ||
         state?.metaDetails?.description ||
         state?.metaDetails?.image ? (
            <HorizontalCard
               data={state?.metaDetails}
               open={() => openTunnel(1)}
            />
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Basic Information"
               style={{ margin: '20px 0' }}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Details
