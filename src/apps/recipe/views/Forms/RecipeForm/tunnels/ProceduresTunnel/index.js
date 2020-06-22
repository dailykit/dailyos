import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Input, Toggle, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { DeleteIcon } from '../../../../../assets/icons'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { Container, InputWrapper, TunnelBody } from '../styled'

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
   }
}

const ProceduresTunnel = ({ state, closeTunnel }) => {
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
         closeTunnel(2)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

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
            close={() => closeTunnel(2)}
         />
         <TunnelBody>
            {_state.procedures?.map((procedure, index) => (
               <Container bottom="32">
                  <InputWrapper>
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
                     <span
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
                     <>
                        <Container bottom="16">
                           <InputWrapper>
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
                     </>
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
