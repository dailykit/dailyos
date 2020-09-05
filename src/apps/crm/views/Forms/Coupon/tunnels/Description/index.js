import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { COUPON_DATA, UPDATE_COUPON } from '../../../../../graphql'
import { StyledRow, TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.descriptiontunnel.'

const DescriptionTunnel = ({ state, close }) => {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)
   const [description, setDescription] = React.useState(state.description || '')

   // Mutations
   const [updateProduct] = useMutation(UPDATE_COUPON, {
      variables: {
         id: state.id,
         set: {
            description,
         },
      },
      onCompleted: () => {
         toast.success('Updated!')
         close(1)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      updateProduct()
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add description'))}
            right={{
               action: save,
               title: busy
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            <StyledRow>
               <Input
                  type="textarea"
                  label={t(address.concat('description'))}
                  name="textarea"
                  rows="5"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
               />
            </StyledRow>
         </TunnelBody>
      </>
   )
}

export default DescriptionTunnel
