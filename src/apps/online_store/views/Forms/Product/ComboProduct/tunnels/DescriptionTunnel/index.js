import React from 'react'

import { TextButton, Input, Text } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody, StyledRow } from '../styled'

import { useTranslation, Trans } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_COMBO_PRODUCT } from '../../../../../../graphql'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.descriptiontunnel.'

export default function DescriptionTunnel({ state, close }) {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)
   const [tags, setTags] = React.useState(
      state.tags?.length ? state.tags.join(', ') : ''
   )
   const [description, setDescription] = React.useState(state.description || '')

   // Mutations
   const [updateProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
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
      onError: error => {
         console.log(error)
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
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(1)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">
                  {t(address.concat('add description and tags'))}
               </Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy
                     ? t(address.concat('saving'))
                     : t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
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
      </React.Fragment>
   )
}
