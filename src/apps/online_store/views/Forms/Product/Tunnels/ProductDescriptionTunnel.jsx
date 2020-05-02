import React from 'react'
import { ButtonTile, Input, HelperText, TagGroup, Tag } from '@dailykit/ui'

import { ProductContext } from '../../../../context/product/index'

import { CustomCrossButton } from '../styled'
import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.tunnels.'

export default function ProductDescriptionTunnel({ close }) {
   const { t } = useTranslation()
   const {
      productState: { description: oldDescription, tags: oldTags },
      productDispatch,
   } = React.useContext(ProductContext)

   const [showInput, setShowInput] = React.useState(false)
   const [description, setDescription] = React.useState(oldDescription)
   const [tagName, setTagName] = React.useState('')
   const [tags, setTags] = React.useState(oldTags)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("add product description"))}
            close={() => {
               close(3)
            }}
            next={() => {
               if (description.length > 0) {
                  productDispatch({
                     type: 'SET_PRODUCT_META',
                     payload: { tags, description },
                  })
               }
               //TODO:  pop a notification in the else case for adding atleast anything and then saving
               close(3)
            }}
            nextAction="Save"
         />
         <Spacer />

         {!showInput && (
            <ButtonTile
               type="secondary"
               text={t(address.concat("add search tags"))}
               onClick={e => setShowInput(true)}
               style={{ margin: '20px 0' }}
            />
         )}

         {showInput && (
            <>
               <Input
                  type="text"
                  name="tags"
                  placeholder={t(address.concat("type the name of the tag"))}
                  value={tagName}
                  onChange={e => setTagName(e.target.value)}
                  onKeyDown={e => {
                     if (e.key === 'Enter') {
                        const newTags = [...tags, e.target.value]
                        setTags(newTags)
                        setTagName('')
                     }
                  }}
               />
               <HelperText
                  type="hint"
                  message={t(address.concat("hit enter to register tag name"))}
               />
            </>
         )}
         <br />
         <div style={{ width: '80%' }}>
            {tags.length > 0 && (
               <TagGroup>
                  {tags.map((tag, index) => (
                     <Tag key={tag}>
                        {tag}

                        <CustomCrossButton
                           onClick={() => {
                              const newTags = [...tags]
                              newTags.splice(index, 1)
                              setTags(newTags)
                           }}
                        >
                           X
                        </CustomCrossButton>
                     </Tag>
                  ))}
               </TagGroup>
            )}
         </div>

         <br />
         <Input
            type="text"
            name="description"
            placeholder={t(address.concat("add product description in 120 words"))}
            value={description}
            onChange={e => setDescription(e.target.value)}
         />

         <HelperText
            type="hint"
            message={t(address.concat("description will not be saved if empty"))}
         />
      </TunnelContainer>
   )
}
