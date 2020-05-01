import React from 'react'

import { TextButton, Input } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody, StyledRow } from '../styled'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import { useMutation } from '@apollo/react-hooks'

// graphql
import { UPDATE_COMBO_PRODUCT } from '../../../../../../graphql'
import { toast } from 'react-toastify'

export default function DescriptionTunnel({ close }) {
   const { state, dispatch } = React.useContext(ComboProductContext)

   const [busy, setBusy] = React.useState(false)

   const [tags, setTags] = React.useState(
      state.tags?.length ? state.tags.join(', ') : ''
   )
   const [description, setDescription] = React.useState(state.description || '')

   // Mutation
   const [updateComboProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
      onCompleted: data => {
         const { tags, description } = data.updateComboProduct.returning[0]
         dispatch({
            type: 'TAGS',
            payload: { value: tags },
         })
         dispatch({
            type: 'DESCRIPTION',
            payload: { value: description },
         })
         close(1)
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      const updatedTags = tags.split(',').map(tag => tag.trim())
      updateComboProduct({
         variables: {
            where: { id: { _eq: state.id } },
            set: {
               tags: updatedTags,
               description: description,
            },
         },
      })
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(1)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Add Description and Tags</span>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <Input
                  type="text"
                  label="Tags"
                  name="tags"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
               />
            </StyledRow>
            <StyledRow>
               <Input
                  type="textarea"
                  label="Description"
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
