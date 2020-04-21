import React from 'react'
import { ButtonTile, Input, HelperText, TagGroup, Tag } from '@dailykit/ui'

import { ProductContext } from '../../../../context/product/index'

import { CustomCrossButton } from '../styled'
import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

export default function ProductDescriptionTunnel({ close }) {
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
            title="Add Product Description"
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
               text="Add search tags"
               onClick={e => setShowInput(true)}
               style={{ margin: '20px 0' }}
            />
         )}

         {showInput && (
            <>
               <Input
                  type="text"
                  name="tags"
                  placeholder="type the name of the tag"
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
                  message="Hit enter to register tag name."
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
            placeholder="Add product description in 120 words"
            value={description}
            onChange={e => setDescription(e.target.value)}
         />

         <HelperText
            type="hint"
            message="description will not be saved if empty"
         />
      </TunnelContainer>
   )
}
