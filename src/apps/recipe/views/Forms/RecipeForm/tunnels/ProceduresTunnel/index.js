import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Input, Toggle, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { Container, InputWrapper, TunnelBody } from '../styled'
import { RecipeContext } from '../../../../../context/recipee'
import { ImageContainer, PhotoTileWrapper } from './styled'

const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'ADD_PROCEDURE': {
         return {
            ...state,
            procedures: state.procedures
               ? [...state.procedures, { title: '', steps: [] }]
               : [{ title: '', steps: [] }],
         }
      }
      case 'ADD_STEP': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps.push({
            title: '',
            isVisible: true,
            assets: {
               images: [],
               videos: [],
            },
            description: '',
         })
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'PROCEDURE_TITLE': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].title = payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'DELETE_PROCEDURE': {
         const updatedProcedures = state.procedures
         updatedProcedures.splice(payload.index, 1)
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_TITLE': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].title =
            payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_VISIBILITY': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[
            payload.stepIndex
         ].isVisible = !updatedProcedures[payload.index].steps[
            payload.stepIndex
         ].isVisible
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_DESCRIPTION': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].description =
            payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'DELETE_STEP': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps.splice(payload.stepIndex, 1)
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'REMOVE_STEP_PHOTO': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].assets = {
            images: [],
            videos: [],
         }
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      default:
         return state
   }
}

const ProceduresTunnel = ({ state, openTunnel, closeTunnel }) => {
   const { recipeDispatch } = React.useContext(RecipeContext)

   // State
   const [busy, setBusy] = React.useState(false)
   const [_state, _dispatch] = React.useReducer(reducer, state)

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      variables: {
         id: state.id,
         set: {
            procedures: _state.procedures,
         },
      },
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
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
      if (busy) return
      setBusy(true)
      updateRecipe()
   }

   return (
      <>
         <TunnelHeader
            title="Add Cooking Steps"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {_state.procedures?.map((procedure, index) => (
               <Container bottom="32">
                  <InputWrapper>
                     <div style={{ marginRight: '16px', maxWidth: '240px' }}>
                        <Input
                           type="text"
                           placeholder="Procedure Title"
                           name={`procedure-${index}-title`}
                           value={procedure.title}
                           onChange={e =>
                              _dispatch({
                                 type: 'PROCEDURE_TITLE',
                                 payload: { index, value: e.target.value },
                              })
                           }
                        />
                     </div>
                     <span
                        tabIndex="0"
                        role="button"
                        onKeyDown={e =>
                           e.charCode === 13 &&
                           _dispatch({
                              type: 'DELETE_PROCEDURE',
                              payload: { index },
                           })
                        }
                        onClick={() =>
                           _dispatch({
                              type: 'DELETE_PROCEDURE',
                              payload: { index },
                           })
                        }
                     >
                        <DeleteIcon color="#FF5A52" size="20" />
                     </span>
                  </InputWrapper>
                  {procedure.steps?.map((step, stepIndex) => (
                     <Container>
                        <Container bottom="16">
                           <InputWrapper>
                              <div
                                 style={{
                                    marginRight: '16px',
                                    maxWidth: '240px',
                                 }}
                              >
                                 <Input
                                    type="text"
                                    placeholder="Step Title"
                                    name={`step-${stepIndex}-title`}
                                    value={step.title}
                                    onChange={e => {
                                       _dispatch({
                                          type: 'STEP_TITLE',
                                          payload: {
                                             index,
                                             stepIndex,
                                             value: e.target.value,
                                          },
                                       })
                                    }}
                                 />
                              </div>
                              <div>
                                 <Toggle
                                    checked={step.isVisible}
                                    label="Visibility"
                                    setChecked={() => {
                                       _dispatch({
                                          type: 'STEP_VISIBILITY',
                                          payload: {
                                             index,
                                             stepIndex,
                                          },
                                       })
                                    }}
                                 />
                                 <span
                                    tabIndex="0"
                                    role="button"
                                    onKeyDown={e =>
                                       e.charCode === 13 &&
                                       _dispatch({
                                          type: 'DELETE_STEP',
                                          payload: { index, stepIndex },
                                       })
                                    }
                                    onClick={() =>
                                       _dispatch({
                                          type: 'DELETE_STEP',
                                          payload: { index, stepIndex },
                                       })
                                    }
                                 >
                                    <DeleteIcon color="#FF5A52" size="20" />
                                 </span>
                              </div>
                           </InputWrapper>
                        </Container>
                        <Container bottom="16">
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
                                          _dispatch({
                                             type: 'REMOVE_STEP_PHOTO',
                                             payload: { index, stepIndex },
                                          })
                                       }
                                       onClick={() =>
                                          _dispatch({
                                             type: 'REMOVE_STEP_PHOTO',
                                             payload: { index, stepIndex },
                                          })
                                       }
                                    >
                                       <DeleteIcon />
                                    </span>
                                 </div>
                                 <img
                                    src={step.assets.images[0]}
                                    alt="Cooking Step"
                                 />
                              </ImageContainer>
                           ) : (
                              <PhotoTileWrapper>
                                 <ButtonTile
                                    type="primary"
                                    size="sm"
                                    text="Add Photo for this Step"
                                    helper="upto 1MB - only JPG, PNG, PDF allowed"
                                    onClick={() => addPhoto(index, stepIndex)}
                                 />
                              </PhotoTileWrapper>
                           )}
                        </Container>
                        <Container bottom="16">
                           <Input
                              type="textarea"
                              placeholder="Description"
                              name={`description-${stepIndex}-title`}
                              rows="3"
                              value={step.description}
                              onChange={e => {
                                 _dispatch({
                                    type: 'STEP_DESCRIPTION',
                                    payload: {
                                       index,
                                       stepIndex,
                                       value: e.target.value,
                                    },
                                 })
                              }}
                           />
                        </Container>
                     </Container>
                  ))}
                  <ButtonTile
                     type="secondary"
                     text="Add a Step"
                     onClick={() => {
                        _dispatch({
                           type: 'ADD_STEP',
                           payload: { index },
                        })
                     }}
                  />
               </Container>
            ))}
            <ButtonTile
               type="secondary"
               text="Add a Procedure"
               onClick={() => {
                  _dispatch({
                     type: 'ADD_PROCEDURE',
                  })
               }}
            />
         </TunnelBody>
      </>
   )
}

export default ProceduresTunnel
