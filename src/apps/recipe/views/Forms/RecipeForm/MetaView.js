import React, { useContext } from 'react'
import { IconButton } from '@dailykit/ui'

import { Context as RecipeContext } from '../../../store/recipe/index'
import { StyledMeta, StyledMetaText, Content } from './styled'
import { EditIcon } from '../../../assets/icons'

export default function MetaView({ open }) {
   const {
      recipeState: {
         pushableState: { description, cookingTime, utensils }
      }
   } = useContext(RecipeContext)
   return (
      <StyledMeta>
         <div>
            <Content>
               <StyledMetaText style={{ width: '80%', textAlign: 'left' }}>
                  {description}
               </StyledMetaText>
               <span style={{ width: '20px' }} />
               <IconButton type='outline' onClick={() => open(1)}>
                  <EditIcon />
               </IconButton>
            </Content>
            <br />
            <StyledMetaText>
               {utensils && (
                  <>
                     <strong>Utensils: </strong>
                     {utensils}
                  </>
               )}
            </StyledMetaText>
            <br />
            <StyledMetaText>
               {cookingTime && (
                  <>
                     <strong>Cooking Time: </strong>
                     {cookingTime} mins.
                  </>
               )}
            </StyledMetaText>
         </div>
      </StyledMeta>
   )
}
