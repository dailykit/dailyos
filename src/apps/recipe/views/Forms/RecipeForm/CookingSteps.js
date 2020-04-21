import { IconButton, Text, Input, ButtonTile } from '@dailykit/ui'
import React, { useContext } from 'react'

import AddIcon from '../../../assets/icons/Add'
import { Context as RecipeContext } from '../../../context/recipe/index'
import { IngredientsSection, Stats, DeleteButton } from './styled'
import DeleteIcon from '../../../assets/icons/Delete'

export default function CookingSteps() {
   const {
      recipeState: { procedures },
      recipeDispatch,
   } = useContext(RecipeContext)

   return (
      <>
         <IngredientsSection>
            <Stats>
               <Text as="subtitle">Cooking Process</Text>
               <IconButton
                  type="ghost"
                  onClick={() => {
                     recipeDispatch({ type: 'CREATE_STEP' })
                  }}
               >
                  <AddIcon />
               </IconButton>
            </Stats>

            {procedures.map((procedure, index) => (
               <div style={{ marginTop: '10px' }} key={index}>
                  {/* <Stats>
                     <Input
                        type='text'
                        placeholder='Section Title'
                        name='sectionTitle'
                        value={procedure.name || `Step ${index + 1}`}
                        onChange={e =>
                           recipeDispatch({
                              type: 'ADD_SECTION_TITLE',
                              payload: { index, name: e.target.value }
                           })
                        }
                     />
                  </Stats>

                  <br /> */}

                  {procedure.steps.map((step, stepIndex) => (
                     <React.Fragment key={stepIndex}>
                        <Stats>
                           <Input
                              type="text"
                              placeholder="Title"
                              name="title"
                              value={step.title}
                              onChange={e => {
                                 recipeDispatch({
                                    type: 'EDIT_COOOKING_PROCESS',
                                    payload: {
                                       index: stepIndex,
                                       sectionIndex: index,
                                       currentName: e.target.name,
                                       value: e.target.value,
                                    },
                                 })
                              }}
                           />
                           {!index || (
                              <DeleteButton
                                 onClick={() => {
                                    recipeDispatch({
                                       type: 'REMOVE_PROCEDURE',
                                       payload: { index },
                                    })
                                 }}
                              >
                                 <DeleteIcon color="rgb(255,90,82)" />
                              </DeleteButton>
                           )}
                        </Stats>
                        <br />
                        <Input
                           type="textarea"
                           placeholder="Description"
                           name="description"
                           rows="3"
                           value={step.description}
                           onChange={e => {
                              recipeDispatch({
                                 type: 'EDIT_COOOKING_PROCESS',
                                 payload: {
                                    index: stepIndex,
                                    sectionIndex: index,
                                    currentName: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }}
                        />
                        <ButtonTile
                           type="primary"
                           size="sm"
                           text="Select Photos for this Step"
                           helper="upto 1mb | only JPGs and PNGs are allowed."
                           onClick={() => {}}
                           style={{ margin: '20px 0' }}
                        />{' '}
                     </React.Fragment>
                  ))}
               </div>
            ))}
         </IngredientsSection>
      </>
   )
}
