import React, { useContext } from 'react'
import { IconButton } from '@dailykit/ui'

import { Context as RecipeContext } from '../../../context/recipe/index'
import { StyledMeta, StyledMetaText, Content } from './styled'
import { EditIcon } from '../../../assets/icons'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.views.forms.recipeform.'

export default function MetaView({ open }) {
   const { t } = useTranslation()
   const {
      recipeState: {
         pushableState: { description, cookingTime, utensils },
      },
   } = useContext(RecipeContext)
   return (
      <StyledMeta>
         <div>
            <Content>
               <StyledMetaText style={{ width: '80%', textAlign: 'left' }}>
                  {description}
               </StyledMetaText>
               <span style={{ width: '20px' }} />
               <IconButton type="outline" onClick={() => open(1)}>
                  <EditIcon />
               </IconButton>
            </Content>
            <br />
            <StyledMetaText>
               {utensils && (
                  <>
                     <strong>{t(address.concat('utensils'))}: </strong>
                     {utensils}
                  </>
               )}
            </StyledMetaText>
            <br />
            <StyledMetaText>
               {cookingTime && (
                  <>
                     <strong>{t(address.concat('cooking time'))}: </strong>
                     {cookingTime} {t('units.mins')}.
                  </>
               )}
            </StyledMetaText>
         </div>
      </StyledMeta>
   )
}
