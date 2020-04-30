import React from 'react'
import { TextButton, Checkbox, Input } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody, StyledInputWrapper } from '../styled'

import { StyledTable } from '../../components/Recipe/styled'

const reducer = (state, { type, payload }) => {
   console.log('Reducer called...')
   switch (type) {
      case 'ACTIVE': {
         const updatedType = state.options[payload.type]
         const index = updatedType.findIndex(el => el.id === payload.id)
         updatedType[index].isActive = payload.value
         return {
            ...state,
            options: {
               ...state.options,
               [payload.type]: updatedType,
            },
         }
      }
      case 'DEFAULT': {
         console.log(payload)
         return {
            ...state,
            default: {
               type: payload.type,
               value: payload.value,
            },
         }
      }
      case 'PRICE': {
         const updatedType = state.options[payload.type]
         const index = updatedType.findIndex(el => el.id === payload.id)
         updatedType[index].price.value = payload.value
         return {
            ...state,
            options: {
               ...state.options,
               [payload.type]: updatedType,
            },
         }
      }
      case 'DISCOUNT': {
         const updatedType = state.options[payload.type]
         const index = updatedType.findIndex(el => el.id === payload.id)
         updatedType[index].price.discount = payload.value
         return {
            ...state,
            options: {
               ...state.options,
               [payload.type]: updatedType,
            },
         }
      }
      default: {
         return state
      }
   }
}

const PriceConfigurationTunnel = ({ close }) => {
   const { state, dispatch } = React.useContext(SimpleProductContext)

   const [_state, _dispatch] = React.useReducer(reducer, {
      options: state.options,
      default: state.default,
   })

   const save = () => {
      dispatch({
         type: 'OPTIONS',
         payload: {
            value: _state.options,
         },
      })
      dispatch({
         type: 'DEFAULT',
         payload: { ..._state.default },
      })
      close(6)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(6)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Configure Pricing for Servings</span>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  Save
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledTable full>
               <thead>
                  <tr>
                     <th>Type</th>
                     <th>Active</th>
                     {/* <th>Default</th> */}
                     <th>Serving</th>
                     <th>Price</th>
                     <th>Discounted Price</th>
                  </tr>
               </thead>
               <tbody>
                  {Object.entries(_state.options).map(([type, value]) =>
                     value.map((el, i) => (
                        <tr key={type + i}>
                           <td>
                              {i === 0
                                 ? type === 'mealKit'
                                    ? 'Meal Kit'
                                    : 'Ready to Eat'
                                 : ''}
                           </td>
                           <td>
                              <Checkbox
                                 checked={el.isActive}
                                 onChange={value =>
                                    _dispatch({
                                       type: 'ACTIVE',
                                       payload: {
                                          type,
                                          value,
                                          id: el.id,
                                       },
                                    })
                                 }
                              />
                           </td>
                           {/* <td>
                              <input
                                 type="radio"
                                 checked={
                                    el.id === _state.default.value.id &&
                                    type === _state.default.type
                                 }
                                 onClick={() =>
                                    _dispatch({
                                       type: 'DEFAULT',
                                       payload: {
                                          type,
                                          value: el,
                                       },
                                    })
                                 }
                              />
                           </td> */}
                           <td>{el.yield.serving}</td>
                           <td>
                              <StyledInputWrapper width="60">
                                 $
                                 <Input
                                    type="text"
                                    name={`${type}-price-input`}
                                    value={el.price.value}
                                    onChange={e =>
                                       _dispatch({
                                          type: 'PRICE',
                                          payload: {
                                             type,
                                             value: e.target.value,
                                             id: el.id,
                                          },
                                       })
                                    }
                                 />
                              </StyledInputWrapper>
                           </td>
                           <td>
                              <StyledInputWrapper width="60">
                                 <Input
                                    type="text"
                                    value={el.price.discount}
                                    onChange={e =>
                                       _dispatch({
                                          type: 'DISCOUNT',
                                          payload: {
                                             type,
                                             value: e.target.value,
                                             id: el.id,
                                          },
                                       })
                                    }
                                 />{' '}
                                 %
                              </StyledInputWrapper>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </StyledTable>
         </TunnelBody>
      </React.Fragment>
   )
}

export default PriceConfigurationTunnel
