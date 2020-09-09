import React from 'react'
import { ButtonTile, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { UPDATE_COUPON } from '../../../../../graphql'
import BasicInfoTunnel from '../../../../../../../shared/components/BasicInfo'
import HorizontalCard from '../../../../../../../shared/components/HorizontalCard'

const Details = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
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
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <BasicInfoTunnel
                  data={state.metaDetails}
                  close={() => closeTunnel(1)}
                  open={() => openTunnel(1)}
                  onSave={info => saveInfo(info)}
               />
            </Tunnel>
         </Tunnels>
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
