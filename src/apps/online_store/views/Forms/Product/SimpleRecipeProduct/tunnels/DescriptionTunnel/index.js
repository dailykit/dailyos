import React from 'react'

import { TextButton, Input } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody, StyledRow } from '../styled'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.descriptiontunnel.'

export default function DescriptionTunnel({ close }) {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(SimpleProductContext)

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
               <span>{t(address.concat('add description and tags'))}</span>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <Input
                  type="text"
                  label={t(address.concat("tags"))}
                  name="tags"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
               />
            </StyledRow>
            <StyledRow>
               <Input
                  type="textarea"
                  label={t(address.concat("description"))}
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
