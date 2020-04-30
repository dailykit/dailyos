import React from 'react'

import { TextButton, Input } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody, StyledRow } from '../styled'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'

export default function DescriptionTunnel({ close }) {
   const { state, dispatch } = React.useContext(ComboProductContext)

   const [tags, setTags] = React.useState(
      state.tags.length ? state.tags.join(', ') : ''
   )
   const [description, setDescription] = React.useState(state.description)

   const save = () => {
      const updatedTags = tags.split(',').map(tag => tag.trim())
      dispatch({
         type: 'TAGS',
         payload: { value: updatedTags },
      })
      dispatch({
         type: 'DESCRIPTION',
         payload: { value: description },
      })
      close(1)
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
                  Save
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
