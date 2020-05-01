import React, { useContext } from 'react'
import { Text, Input, ButtonTile, HelperText, IconButton } from '@dailykit/ui'

import { Context as RecipeContext } from '../../../../context/recipe'

import { TunnelContainer, ServingsInput } from '../styled'

import { TunnelHeader, Spacer } from '../../../../components/index'
import CloseIcon from '../../../../assets/icons/Close'

import { useTranslation } from 'react-i18next'

const address = 'apps.recipe.views.forms.recipeform.tunnels.'

export default function AddServings({ close, next }) {
   const { t } = useTranslation()
   const { recipeState, recipeDispatch } = useContext(RecipeContext)

   const addServingsHandler = () => {
      if (recipeState.servings[recipeState.servings.length - 1].value <= 0)
         return
      recipeDispatch({ type: 'ADD_SERVING' })
      recipeDispatch({ type: 'ADD_SERVINGS_FOR_PUSHABLE' })
   }

   const changeServingsHandler = ({ id }, e) => {
      recipeDispatch({
         type: 'CHANGE_SERVINGS',
         payload: { id, value: e.target.value },
      })
      recipeDispatch({ type: 'ADD_SERVINGS_FOR_PUSHABLE' })
   }

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("add servings"))}
            close={() => {
               recipeDispatch({ type: 'REFINE_SERVINGS' })
               recipeDispatch({ type: 'ADD_SERVINGS_FOR_PUSHABLE' })
               close(1)
            }}
            next={() => {
               recipeDispatch({ type: 'REFINE_SERVINGS' })
               recipeDispatch({ type: 'ADD_SERVINGS_FOR_PUSHABLE' })
               next(1)
            }}
            nextAction="Add"
         />
         <Spacer />
         <Text as="subtitle">{t(address.concat('enter servings'))}:</Text>
         <br />
         <ol>
            {recipeState.servings.map(serving => (
               <React.Fragment key={serving.id}>
                  <li key={serving.id}>
                     <ServingsInput>
                        <Input
                           onChange={e => changeServingsHandler(serving, e)}
                           type="text"
                           placeholder={t(address.concat("enter"))}
                           name={serving.id}
                           value={serving.value || ''}
                        />
                        {serving.value > 0 && (
                           <IconButton
                              type="outline"
                              onClick={() => {
                                 recipeDispatch({
                                    type: 'REMOVE_SERVING',
                                    payload: serving,
                                 })
                              }}
                           >
                              <CloseIcon />
                           </IconButton>
                        )}
                     </ServingsInput>
                  </li>

                  {serving.value <= 0 ? (
                     <HelperText
                        type="hint"
                        message={t(address.concat("fill this first to continue adding new servings!"))}
                     />
                  ) : null}
               </React.Fragment>
            ))}
         </ol>
         <br />
         <ButtonTile
            as="button"
            type="secondary"
            text={t(address.concat("add more servings"))}
            onClick={addServingsHandler}
         />
      </TunnelContainer>
   )
}
