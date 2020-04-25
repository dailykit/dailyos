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
         const updatedType = state[payload.type]
         const index = updatedType.options.findIndex(el => el.id === payload.id)
         updatedType.options[index].isActive = payload.value
         return {
            ...state,
            [payload.type]: updatedType,
         }
      }
      case 'PRICE': {
         const updatedType = state[payload.type]
         const index = updatedType.options.findIndex(el => el.id === payload.id)
         updatedType.options[index].price.value = +payload.value
         return {
            ...state,
            [payload.type]: updatedType,
         }
      }
      case 'DISCOUNT': {
         const updatedType = state[payload.type]
         const index = updatedType.options.findIndex(el => el.id === payload.id)
         updatedType.options[index].discountedPrice.value = +payload.value
         return {
            ...state,
            [payload.type]: updatedType,
         }
      }
      default: {
         return state
      }
   }
}

const PriceConfigurationTunnel = ({ close }) => {
   const { state, dispatch } = React.useContext(SimpleProductContext)

   const [_state, _dispatch] = React.useReducer(reducer, state.options)

   const save = () => {
      dispatch({
         type: 'OPTIONS',
         payload: {
            value: _state,
         },
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
                     <th>Serving</th>
                     <th>Price</th>
                     <th>Discounted Price</th>
                  </tr>
               </thead>
               <tbody>
                  {Object.entries(_state).map(([type, value]) =>
                     value.options.map((el, i) => (
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
                           <td>{el.yield.serving}</td>
                           <td>
                              <StyledInputWrapper width="60">
                                 <Input
                                    type="text"
                                    value={'$' + el.price.value}
                                    onChange={e =>
                                       _dispatch({
                                          type: 'PRICE',
                                          payload: {
                                             type,
                                             value: e.target.value.substr(1),
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
                                    value={'$' + el.discountedPrice.value}
                                    onChange={e =>
                                       _dispatch({
                                          type: 'DISCOUNT',
                                          payload: {
                                             type,
                                             value: e.target.value.substr(1),
                                             id: el.id,
                                          },
                                       })
                                    }
                                 />
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
