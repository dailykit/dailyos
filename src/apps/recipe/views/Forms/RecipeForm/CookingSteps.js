import { IconButton, Text, Input, ButtonTile, Toggle } from '@dailykit/ui'
import React, { useContext } from 'react'

import AddIcon from '../../../assets/icons/Add'
import { Context as RecipeContext } from '../../../context/recipe/index'
import { IngredientsSection, Stats, InputWrapper } from './styled'
import DeleteIcon from '../../../assets/icons/Delete'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.views.forms.recipeform.'

export default function CookingSteps() {
   const { t } = useTranslation()
   const {
      recipeState: { procedures },
      recipeDispatch,
   } = useContext(RecipeContext)

   return (
      <>
         <IngredientsSection>
            <Stats>
               <Text as="subtitle">{t(address.concat('cooking process'))}</Text>
               <IconButton
                  type="ghost"
                  onClick={() => {
                     recipeDispatch({ type: 'ADD_PROCEDURE' })
                  }}
               >
                  <AddIcon />
               </IconButton>
            </Stats>

            {procedures.map((procedure, index) => (
               <div style={{ marginTop: '10px' }} key={index}>
                  <Stats>
                     <InputWrapper>
                        <Input
                           type="text"
                           placeholder={t(address.concat("procedure title"))}
                           name={`procedure-${index}-title`}
                           value={procedure.title}
                           onChange={e =>
                              recipeDispatch({
                                 type: 'PROCEDURE_TITLE',
                                 payload: { index, value: e.target.value },
                              })
                           }
                        />
                        <span
                           onClick={() =>
                              recipeDispatch({
                                 type: 'DELETE_PROCEDURE',
                                 payload: { index },
                              })
                           }
                        >
                           <DeleteIcon color="#FF5A52" size="20" />
                        </span>
                     </InputWrapper>
                  </Stats>
                  <br />
                  {procedure.steps.map((step, stepIndex) => (
                     <React.Fragment key={stepIndex}>
                        <Stats>
                           <InputWrapper>
                              <Input
                                 type="text"
                                 placeholder={t(address.concat("step title"))}
                                 name={`step-${stepIndex}-title`}
                                 value={step.title}
                                 onChange={e => {
                                    recipeDispatch({
                                       type: 'STEP_TITLE',
                                       payload: {
                                          index,
                                          stepIndex,
                                          value: e.target.value,
                                       },
                                    })
                                 }}
                              />
                              <div>
                                 <Toggle
                                    checked={step.isVisible}
                                    label="Visibility"
                                    setChecked={() => {
                                       recipeDispatch({
                                          type: 'STEP_VISIBILITY',
                                          payload: {
                                             index,
                                             stepIndex,
                                          },
                                       })
                                    }}
                                 />
                                 <span
                                    onClick={() =>
                                       recipeDispatch({
                                          type: 'DELETE_STEP',
                                          payload: { index, stepIndex },
                                       })
                                    }
                                 >
                                    <DeleteIcon color="#FF5A52" size="20" />
                                 </span>
                              </div>
                           </InputWrapper>
                        </Stats>
                        <br />
                        <Input
                           type="textarea"
                           placeholder={t(address.concat("description"))}
                           name={`description-${stepIndex}-title`}
                           rows="3"
                           value={step.description}
                           onChange={e => {
                              recipeDispatch({
                                 type: 'STEP_DESCRIPTION',
                                 payload: {
                                    index,
                                    stepIndex,
                                    value: e.target.value,
                                 },
                              })
                           }}
                        />
                        <br />
                     </React.Fragment>
                  ))}
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add a step'))}
                     onClick={() => {
                        recipeDispatch({
                           type: 'ADD_STEP',
                           payload: { index },
                        })
                     }}
                  />
                  <br />
               </div>
            ))}
            <ButtonTile
               type="secondary"
               text={t(address.concat("add procedure"))}
               onClick={() => {
                  recipeDispatch({
                     type: 'ADD_PROCEDURE',
                  })
               }}
            />
         </IngredientsSection>
      </>
   )
}
