import React, { useContext } from 'react'

import { Text, TagGroup, Tag, ButtonTile, IconButton } from '@dailykit/ui'

import { Context as RecipeContext } from '../../../context/recipe/index'

import { IngredientsSection, Stats, CustomCrossButton } from './styled'
import AddIcon from '../../../assets/icons/Add'
import UserIcon from '../../../assets/icons/User'

import { useTranslation } from 'react-i18next'

const address = 'apps.recipe.views.forms.recipeform.'

export default function Servings({ open }) {
   const { t } = useTranslation()
   const { recipeState, recipeDispatch } = useContext(RecipeContext)
   console.log(recipeState)

   const servingRemoveHandler = serving => {
      recipeDispatch({ type: 'REMOVE_SERVING', payload: serving })
   }

   return (
      <>
         <IngredientsSection>
            <Stats>
               <Text as="subtitle">
                  {t(address.concat('servings'))} (
                  {recipeState.servings[0]?.value !== 0
                     ? recipeState.servings.length
                     : '0'}
                  )
               </Text>
               {recipeState.servings[0].value !== 0 &&
                  recipeState.servings.length > 0 && (
                     <IconButton type="ghost" onClick={() => open(1)}>
                        <AddIcon />
                     </IconButton>
                  )}
            </Stats>
            <TagGroup>
               {recipeState.servings.map(serving =>
                  serving.value !== 0 ? (
                     <Tag key={serving.id}>
                        <UserIcon />
                        <span style={{ marginLeft: '5px' }}>
                           {serving.value}
                        </span>
                        <CustomCrossButton
                           onClick={() => servingRemoveHandler(serving)}
                        >
                           X
                        </CustomCrossButton>
                     </Tag>
                  ) : (
                        <ButtonTile
                           key={serving.id}
                           as="button"
                           type="secondary"
                           text={t(address.concat("add serving"))}
                           onClick={() => open(1)}
                        />
                     )
               )}
            </TagGroup>
         </IngredientsSection>
      </>
   )
}
