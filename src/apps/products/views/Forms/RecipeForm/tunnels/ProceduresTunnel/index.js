import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   Form,
   IconButton,
   Spacer,
   TunnelHeader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import { RecipeContext } from '../../../../../context/recipe'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { TunnelBody } from '../styled'
import { ImageContainer, PhotoTileWrapper } from './styled'
import { Tooltip } from '../../../../../../../shared/components'

const ProceduresTunnel = ({ state, openTunnel, closeTunnel }) => {
   const { recipeState, recipeDispatch } = React.useContext(RecipeContext)

   // Mutation
   const [updateRecipe, { loading: inFlight }] = useMutation(UPDATE_RECIPE, {
      variables: {
         id: state.id,
         set: {
            procedures: recipeState.procedures,
         },
      },
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const addPhoto = (procedureIndex, stepIndex) => {
      recipeDispatch({
         type: 'STEP_PHOTO',
         payload: {
            procedureIndex,
            stepIndex,
         },
      })
      openTunnel(2)
   }

   const save = () => {
      if (inFlight) return
      updateRecipe()
   }

   React.useEffect(() => {
      recipeDispatch({
         type: 'SEED_PROCEDURES',
         payload: {
            value: state.procedures || [],
         },
      })
   }, [])

   return (
      <>
         <TunnelHeader
            title="Add Cooking Steps"
            right={{ action: save, title: inFlight ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(1)}
            tooltip={<Tooltip identifier="cooking_steps_tunnel" />}
         />
         <TunnelBody>
            {recipeState.procedures?.map((procedure, index) => (
               <>
                  <Flex>
                     <Flex container alignItems="end">
                        <Form.Group>
                           <Form.Label
                              htmlFor={`procedureTitle-${index}`}
                              title="Procedure Title"
                           >
                              Procedure
                           </Form.Label>
                           <Form.Text
                              id={`procedureTitle-${index}`}
                              name={`procedureTitle-${index}`}
                              onChange={e =>
                                 recipeDispatch({
                                    type: 'PROCEDURE_TITLE',
                                    payload: { index, value: e.target.value },
                                 })
                              }
                              value={procedure.title}
                              placeholder="Enter procedure title"
                           />
                        </Form.Group>
                        <Spacer xAxis size="8px" />
                        <IconButton
                           type="ghost"
                           onClick={() =>
                              recipeDispatch({
                                 type: 'DELETE_PROCEDURE',
                                 payload: { index },
                              })
                           }
                        >
                           <DeleteIcon color="#FF5A52" />
                        </IconButton>
                     </Flex>
                     <Spacer size="16px" />
                     {procedure.steps?.map((step, stepIndex) => (
                        <>
                           <Flex container alignItems="end">
                              <Form.Group>
                                 <Form.Label
                                    htmlFor={`stepTitle-${stepIndex}-${index}`}
                                    title="Step Title"
                                 >
                                    Step
                                 </Form.Label>
                                 <Form.Text
                                    id={`stepTitle-${stepIndex}-${index}`}
                                    name={`stepTitle-${stepIndex}-${index}`}
                                    onChange={e =>
                                       recipeDispatch({
                                          type: 'STEP_TITLE',
                                          payload: {
                                             index,
                                             stepIndex,
                                             value: e.target.value,
                                          },
                                       })
                                    }
                                    value={step.title}
                                    placeholder="Enter step title"
                                 />
                              </Form.Group>
                              <Spacer xAxis size="8px" />
                              <Form.Group>
                                 <Form.Toggle
                                    name={`stepVisibilityToggle-${stepIndex}-${index}`}
                                    onChange={() => {
                                       recipeDispatch({
                                          type: 'STEP_VISIBILITY',
                                          payload: {
                                             index,
                                             stepIndex,
                                          },
                                       })
                                    }}
                                    value={step.isVisible}
                                 >
                                    Visibility
                                 </Form.Toggle>
                              </Form.Group>
                              <Spacer xAxis size="8px" />
                              <IconButton
                                 type="ghost"
                                 onClick={() =>
                                    recipeDispatch({
                                       type: 'DELETE_STEP',
                                       payload: { index, stepIndex },
                                    })
                                 }
                              >
                                 <DeleteIcon color="#FF5A52" />
                              </IconButton>
                           </Flex>
                           <Spacer size="16px" />
                           {step.assets.images.length ? (
                              <ImageContainer>
                                 <div>
                                    <span
                                       tabIndex="0"
                                       role="button"
                                       onKeyDown={e =>
                                          e.charCode === 13 &&
                                          addPhoto(index, stepIndex)
                                       }
                                       onClick={() =>
                                          addPhoto(index, stepIndex)
                                       }
                                    >
                                       <EditIcon />
                                    </span>
                                    <span
                                       tabIndex="0"
                                       role="button"
                                       onKeyDown={e =>
                                          e.charCode === 13 &&
                                          recipeDispatch({
                                             type: 'REMOVE_STEP_PHOTO',
                                             payload: { index, stepIndex },
                                          })
                                       }
                                       onClick={() =>
                                          recipeDispatch({
                                             type: 'REMOVE_STEP_PHOTO',
                                             payload: { index, stepIndex },
                                          })
                                       }
                                    >
                                       <DeleteIcon />
                                    </span>
                                 </div>
                                 <img
                                    src={step.assets.images[0].url}
                                    alt={step.assets.images[0].title}
                                 />
                              </ImageContainer>
                           ) : (
                              <PhotoTileWrapper>
                                 <ButtonTile
                                    type="primary"
                                    size="sm"
                                    text="Add Photo for this Step"
                                    helper="upto 1MB - only JPG, PNG allowed"
                                    onClick={() => addPhoto(index, stepIndex)}
                                 />
                              </PhotoTileWrapper>
                           )}
                           <Spacer size="16px" />
                           <Form.Group>
                              <Form.Label
                                 htmlFor={`description-${stepIndex}-${index}`}
                                 title="description"
                              >
                                 Description
                              </Form.Label>
                              <Form.TextArea
                                 id={`description-${stepIndex}-${index}`}
                                 name={`description-${stepIndex}-${index}`}
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
                                 value={step.description}
                                 placeholder="Write step description"
                              />
                           </Form.Group>
                           <Spacer size="16px" />
                        </>
                     ))}
                     <Spacer size="16px" />
                     <ButtonTile
                        type="secondary"
                        text="Add a Step"
                        onClick={() => {
                           recipeDispatch({
                              type: 'ADD_STEP',
                              payload: { index },
                           })
                        }}
                     />
                  </Flex>
                  <Spacer size="16px" />
               </>
            ))}
            <Spacer size="16px" />
            <ButtonTile
               type="secondary"
               text="Add a Procedure"
               onClick={() => {
                  recipeDispatch({
                     type: 'ADD_PROCEDURE',
                  })
               }}
            />
         </TunnelBody>
      </>
   )
}

export default ProceduresTunnel
