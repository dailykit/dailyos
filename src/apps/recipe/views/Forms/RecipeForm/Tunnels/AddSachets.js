import React, { useContext } from 'react'

import { Text, ButtonTile, IconButton } from '@dailykit/ui'

import { Context as RecipeContext } from '../../../../store/recipe/index'

import {
   TunnelContainer,
   Content,
   FlexWidth,
   ManageIngredient,
   CustomButton
} from '../styled'
import EditIcon from '../../../../assets/icons/Edit'

import { TunnelHeader, Spacer } from '../../../../components/index'

export default function AddSachets({ close, openTunnel }) {
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
                     payload: serving
                  })
                  openTunnel(5)
               }}
               type='secondary'
               text={availableSachet.title}
            />
         )
      } else {
         return (
            <ButtonTile
               onClick={() => {
                  recipeDispatch({
                     type: 'SET_ACTIVE_SERVING',
                     payload: serving
                  })
                  openTunnel(5)
               }}
               type='secondary'
               text='Select Sachet'
            />
         )
      }
   }

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title='Add Ingredients'
               close={() => {
                  close(3)
                  recipeDispatch({
                     type: 'SET_VIEW',
                     payload: {}
                  })
               }}
               next={() => {
                  close(3)
                  recipeDispatch({
                     type: 'SET_VIEW',
                     payload: {}
                  })
               }}
               nextAcion='Done'
            />

            <Spacer />
            <Content>
               <FlexWidth width='1'>
                  {/* TODO: add buttons for adding more ingredients when doing functionality part */}
                  <Text as='subtitle'>
                     Ingredients ({recipeState.ingredients.length})
                  </Text>

                  <br />

                  {recipeState.ingredients.map(ingredient => (
                     <div key={ingredient.id}>
                        <CustomButton
                           active={recipeState.view?.id === ingredient.id}
                           onClick={() => {
                              recipeDispatch({
                                 type: 'SET_VIEW',
                                 payload: ingredient
                              })
                           }}
                        >
                           {ingredient.title}
                        </CustomButton>
                     </div>
                  ))}
               </FlexWidth>
               <FlexWidth width='3'>
                  {/* TODO: add preference for sachets and processing for the ingredient */}
                  <ManageIngredient>
                     {recipeState.view.title ? (
                        <>
                           <Content>
                              <FlexWidth width='1'>
                                 <Text as='h2'>
                                    {recipeState.view.title}
                                    {recipeState.view.processing &&
                                       ` | ${recipeState.view.processing.title}`}
                                    {recipeState.view.processing && (
                                       <span
                                          style={{
                                             display: 'inline-block',
                                             marginLeft: '10px'
                                          }}
                                       >
                                          <IconButton
                                             type='outline'
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
                                 <FlexWidth width='3'>
                                    <ButtonTile
                                       onClick={() => {
                                          openTunnel(4)
                                       }}
                                       type='secondary'
                                       text='Select Processing'
                                    />
                                 </FlexWidth>
                              )}
                           </Content>
                           <Content>
                              <FlexWidth width='1'>
                                 <Text as='subtitle'>For serving</Text>
                              </FlexWidth>
                           </Content>
                           <br />
                           {recipeState.servings[0].value > 0 &&
                              recipeState.servings.map(serving => (
                                 <React.Fragment key={serving.id}>
                                    <Content>
                                       <FlexWidth width='1'>
                                          <Text
                                             as='h2'
                                             style={{ textAlign: 'center' }}
                                          >
                                             {serving.value} People.
                                          </Text>
                                       </FlexWidth>
                                       <FlexWidth width='3'>
                                          {renderSachets(serving)}
                                       </FlexWidth>
                                    </Content>
                                    <br />
                                 </React.Fragment>
                              ))}
                           {recipeState.servings[0].value <= 0 && (
                              <Content>
                                 <Text as='h2'>No servings available</Text>
                              </Content>
                           )}
                        </>
                     ) : (
                        <Content>
                           <Text as='h2'>Select and ingredient</Text>
                        </Content>
                     )}
                  </ManageIngredient>
               </FlexWidth>
            </Content>
         </TunnelContainer>
      </>
   )
}
