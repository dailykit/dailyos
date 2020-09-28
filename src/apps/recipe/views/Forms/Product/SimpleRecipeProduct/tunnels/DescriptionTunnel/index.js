import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'
import { StyledRow, TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.descriptiontunnel.'

const DescriptionTunnel = ({ state, close }) => {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)
   const [tags, setTags] = React.useState(
      state.tags?.length ? state.tags.join(', ') : ''
   )
   const [description, setDescription] = React.useState(state.description || '')

   // Mutations
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            tags: tags.split(',').map(tag => tag.trim()),
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
            title={t(address.concat('add description and tags'))}
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
                  type="text"
                  label={t(address.concat('tags'))}
                  name="tags"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
               />
            </StyledRow>
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
