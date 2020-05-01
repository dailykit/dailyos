import React, { useContext } from 'react'

import { Text, ButtonTile, IconButton } from '@dailykit/ui'

import { Context as RecipeContext } from '../../../../context/recipe/index'

import {
   TunnelContainer,
   Content,
   FlexWidth,
   ManageIngredient,
   CustomButton,
} from '../styled'
import EditIcon from '../../../../assets/icons/Edit'

import { TunnelHeader, Spacer } from '../../../../components/index'

import { useTranslation } from 'react-i18next'

const address = 'apps.recipe.views.forms.recipeform.tunnels.'

export default function AddSachets({ close, openTunnel }) {
   const { t } = useTranslation()
   const { recipeState, recipeDispatch } = useContext(RecipeContext)

   const renderSachets = serving => {
      const availableSachet = recipeState.sachets.find(
         sachet =>
            sachet.serving.id === serving.id &&
            sachet.ingredient.id === recipeState.view.id
      )

      if (
         availableSachet &&
         availableSachet.ingredient.id === recipeState.view.id
      ) {
         return (
            <ButtonTile
               onClick={() => {
                  recipeDispatch({
                     type: 'SET_ACTIVE_SERVING',
                     payload: serving,
                  })
                  openTunnel(5)
               }}
               type="secondary"
               text={availableSachet.title}
            />
         )
      } else {
         return (
            <ButtonTile
               onClick={() => {
                  recipeDispatch({
                     type: 'SET_ACTIVE_SERVING',
                     payload: serving,
                  })
                  openTunnel(5)
               }}
               type="secondary"
               text={t(address.concat("select sachet"))}
            />
         )
      }
   }

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title={t(address.concat("add ingredients"))}
               close={() => {
                  close(3)
                  recipeDispatch({
                     type: 'SET_VIEW',
                     payload: {},
                  })
               }}
               next={() => {
                  close(3)
                  recipeDispatch({
                     type: 'SET_VIEW',
                     payload: {},
                  })
               }}
               nextAcion="Done"
            />

            <Spacer />
            <Content>
               <FlexWidth width="1">
                  {/* TODO: add buttons for adding more ingredients when doing functionality part */}
                  <Text as="subtitle">
                     {t(address.concat('ingredients'))} ({recipeState.ingredients.length})
                  </Text>

                  <br />

                  {recipeState.ingredients.map(ingredient => (
                     <div key={ingredient.id}>
                        <CustomButton
                           active={recipeState.view?.id === ingredient.id}
                           onClick={() => {
                              recipeDispatch({
                                 type: 'SET_VIEW',
                                 payload: ingredient,
                              })
                           }}
                        >
                           {ingredient.title}
                        </CustomButton>
                     </div>
                  ))}
               </FlexWidth>
               <FlexWidth width="3">
                  {/* TODO: add preference for sachets and processing for the ingredient */}
                  <ManageIngredient>
                     {recipeState.view.title ? (
                        <>
                           <Content>
                              <FlexWidth width="1">
                                 <Text as="h2">
                                    {recipeState.view.title}
                                    {recipeState.view.processing &&
                                       ` | ${recipeState.view.processing.title}`}
                                    {recipeState.view.processing && (
                                       <span
                                          style={{
                                             display: 'inline-block',
                                             marginLeft: '10px',
                                          }}
                                       >
                                          <IconButton
                                             type="outline"
                                             onClick={() => openTunnel(4)}
                                          >
                                             <EditIcon />
                                          </IconButton>
                                       </span>
                                    )}
                                 </Text>
                              </FlexWidth>
                              {recipeState.view.processing &&
                                 recipeState.view.processing.title ? null : (
                                    <FlexWidth width="3">
                                       <ButtonTile
                                          onClick={() => {
                                             openTunnel(4)
                                          }}
                                          type="secondary"
                                          text={t(address.concat("select processing"))}
                                       />
                                    </FlexWidth>
                                 )}
                           </Content>
                           <Content>
                              <FlexWidth width="1">
                                 <Text as="subtitle">{t(address.concat('for serving'))}</Text>
                              </FlexWidth>
                           </Content>
                           <br />
                           {recipeState.servings[0].value > 0 &&
                              recipeState.servings.map(serving => (
                                 <React.Fragment key={serving.id}>
                                    <Content>
                                       <FlexWidth width="1">
                                          <Text
                                             as="h2"
                                             style={{ textAlign: 'center' }}
                                          >
                                             {serving.value} {t(address.concat('people'))}.
                                          </Text>
                                       </FlexWidth>
                                       <FlexWidth width="3">
                                          {renderSachets(serving)}
                                       </FlexWidth>
                                    </Content>
                                    <br />
                                 </React.Fragment>
                              ))}
                           {recipeState.servings[0].value <= 0 && (
                              <Content>
                                 <Text as="h2">{t(address.concat('no servings available'))}</Text>
                              </Content>
                           )}
                        </>
                     ) : (
                           <Content>
                              <Text as="h2">{t(address.concat('Select an ingredient'))}</Text>
                           </Content>
                        )}
                  </ManageIngredient>
               </FlexWidth>
            </Content>
         </TunnelContainer>
      </>
   )
}
