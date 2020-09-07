import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Input, Toggle, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { Container, InputWrapper, TunnelBody } from '../styled'
import { RecipeContext } from '../../../../../context/recipee'
import { ImageContainer, PhotoTileWrapper } from './styled'

const ProceduresTunnel = ({ state, openTunnel, closeTunnel }) => {
   const { recipeState, recipeDispatch } = React.useContext(RecipeContext)

   // State
   const [busy, setBusy] = React.useState(false)

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
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
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {recipeState.procedures?.map((procedure, index) => (
               <Container bottom="32">
                  <InputWrapper>
                     <div style={{ marginRight: '16px', maxWidth: '240px' }}>
                        <Input
                           type="text"
                           placeholder="Procedure Title"
                           name={`procedure-${index}-title`}
                           value={procedure.title}
                           onChange={e =>
                              recipeDispatch({
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
                           recipeDispatch({
                              type: 'DELETE_PROCEDURE',
                              payload: { index },
                           })
                        }
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
                              </div>
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
                                    tabIndex="0"
                                    role="button"
                                    onKeyDown={e =>
                                       e.charCode === 13 &&
                                       recipeDispatch({
                                          type: 'DELETE_STEP',
                                          payload: { index, stepIndex },
                                       })
                                    }
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
                        </Container>
                     </Container>
                  ))}
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
               </Container>
            ))}
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
