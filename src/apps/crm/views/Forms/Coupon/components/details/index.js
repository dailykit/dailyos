import React from 'react'
import { ButtonTile, useTunnel } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { UPDATE_COUPON } from '../../../../../graphql'
import BasicInfoTunnel from '../../../../../../../shared/components/BasicInfo'
import HorizontalCard from '../../../../../../../shared/components/HorizontalCard'
import { StyledCard } from './styled'

const Details = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   // Mutations
   const [updateCoupon] = useMutation(UPDATE_COUPON, {
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
      updateCoupon({
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
            <StyledCard>
               <HorizontalCard
                  data={state?.metaDetails}
                  open={() => openTunnel(1)}
               />
            </StyledCard>
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
