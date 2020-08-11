import React from 'react'
import {
   TunnelHeader,
   Input,
   ButtonTile,
   RadioGroup,
   Text,
   Checkbox,
} from '@dailykit/ui'
import { TunnelBody, Grid } from '../styled'
import {
   CategoryWrapper,
   OptionWrapper,
   OptionTop,
   OptionBottom,
} from './styled'

const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'NAME': {
         return {
            name: payload.value,
            ...state,
         }
      }
      case 'ADD_CATEGORY': {
         return {
            categories: [
               ...state.categories,
               {
                  name: '',
                  type: 'single',
                  options: [
                     {
                        image: 'https://via.placeholder.com/150',
                        name: 'Cheese',
                        price: 0,
                        discount: 10,
                        quantity: 1,
                     },
                  ],
               },
            ],
         }
      }
      case 'DELETE_CATEGORY': {
         const updatedCategories = state.categories
         updatedCategories.splice(payload.index, 1)
         return {
            ...state,
            categories: updatedCategories,
         }
      }
      case 'CATEGORY_NAME': {
         const updatedCategories = state.categories
         updatedCategories[payload.index].name = payload.value
         return {
            ...state,
            categories: updatedCategories,
         }
      }
      case 'CATEGORY_TYPE': {
         const updatedCategories = state.categories
         updatedCategories[payload.index].type = payload.value
         if (payload.value === 'multiple') {
            updatedCategories[payload.index].limits = { min: 1, max: 1 }
         } else {
            delete updatedCategories[payload.index].limits
         }
         return {
            ...state,
            categories: updatedCategories,
         }
      }
      case 'CATEGORY_OPTION': {
         const updatedCategories = state.categories
         updatedCategories[payload.index].options[payload.optionIndex][
            payload.label
         ] = payload.value
         return {
            ...state,
            categories: updatedCategories,
         }
      }
      case 'DELETE_CATEGORY_OPTION': {
         const updatedCategories = state.categories
         updatedCategories[payload.index].options.splice(payload.optionIndex, 1)
         return {
            ...state,
            categories: updatedCategories,
         }
      }
      default:
         return state
   }
}

const ModifierFormTunnel = ({ open, close }) => {
   const [modifier, setModifier] = React.useReducer(reducer, {
      name: '',
      categories: [],
   })

   const options = [
      { id: 1, title: 'Single' },
      { id: 2, title: 'Multiple' },
   ]

   return (
      <>
         <TunnelHeader
            title="Create New Modifier Template"
            close={() => close(1)}
         />
         <TunnelBody>
            <Input
               type="text"
               label="Template Name"
               name="template-name"
               value={modifier.name}
               onChange={e =>
                  setModifier({
                     type: 'NAME',
                     payload: { value: e.target.value },
                  })
               }
            />
            {modifier.categories.map((category, index) => (
               <CategoryWrapper>
                  <Input
                     type="text"
                     label="Category Name"
                     name="category-name"
                     value={category.name}
                     style={{ marginBottom: '16px' }}
                     onChange={e =>
                        setModifier({
                           type: 'CATEGORY_NAME',
                           payload: { value: e.target.value, index },
                        })
                     }
                  />
                  <Text as="subtitle">Type</Text>
                  <RadioGroup
                     style={{ marginBottom: '16px' }}
                     options={options}
                     active={
                        options.find(
                           op => op.title.toLowerCase() === category.type
                        ).id
                     }
                     onChange={option =>
                        setModifier({
                           type: 'CATEGORY_TYPE',
                           payload: {
                              value: option.title.toLowerCase(),
                              index,
                           },
                        })
                     }
                  />
                  {category.type === 'multiple' && (
                     <>
                        <Text as="subtitle">Limits</Text>
                        <Grid>
                           <Input
                              type="number"
                              label="Min"
                              name="min"
                              value={category.limits.min}
                              onChange={e =>
                                 setModifier({
                                    type: 'CATEGORY_LIMIT',
                                    payload: {
                                       value: e.target.value,
                                       index,
                                       label: 'min',
                                    },
                                 })
                              }
                           />
                           <Input
                              type="number"
                              label="Max"
                              name="max"
                              value={category.limits.max}
                              onChange={e =>
                                 setModifier({
                                    type: 'CATEGORY_LIMIT',
                                    payload: {
                                       value: e.target.value,
                                       index,
                                       label: 'max',
                                    },
                                 })
                              }
                           />
                        </Grid>
                        <Text as="subtitle">Options</Text>
                        {category.options.map((option, optionIndex) => (
                           <OptionWrapper>
                              <OptionTop>
                                 <img src={option.image} alt="Option" />
                                 <div>
                                    <Text as="p">{option.name}</Text>
                                    <Grid cols="3">
                                       <Input
                                          type="number"
                                          label="Price"
                                          name={`price-${optionIndex}`}
                                          value={option.price}
                                          onChange={e =>
                                             setModifier({
                                                type: 'CATEGORY_OPTION',
                                                payload: {
                                                   value: e.target.value,
                                                   index,
                                                   optionIndex,
                                                   label: 'price',
                                                },
                                             })
                                          }
                                       />
                                       <Input
                                          type="number"
                                          label="Discount"
                                          name={`discount-${optionIndex}`}
                                          value={option.discount}
                                          onChange={e =>
                                             setModifier({
                                                type: 'CATEGORY_OPTION',
                                                payload: {
                                                   value: e.target.value,
                                                   index,
                                                   optionIndex,
                                                   label: 'discount',
                                                },
                                             })
                                          }
                                       />
                                       <Input
                                          type="number"
                                          label="Quantity"
                                          name={`qty-${optionIndex}`}
                                          value={option.quantity}
                                          onChange={e =>
                                             setModifier({
                                                type: 'CATEGORY_OPTION',
                                                payload: {
                                                   value: e.target.value,
                                                   index,
                                                   optionIndex,
                                                   label: 'quantity',
                                                },
                                             })
                                          }
                                       />
                                    </Grid>
                                 </div>
                              </OptionTop>
                              <OptionBottom>
                                 <div> </div>
                                 <Checkbox
                                    id="label"
                                    checked={option.isAlwaysCharged}
                                    onChange={value =>
                                       setModifier({
                                          type: 'CATEGORY_OPTION',
                                          payload: {
                                             value,
                                             index,
                                             optionIndex,
                                             label: 'isAlwaysCharged',
                                          },
                                       })
                                    }
                                 >
                                    Always Charge
                                 </Checkbox>
                                 <Checkbox
                                    id="label"
                                    checked={option.isActive}
                                    onChange={value =>
                                       setModifier({
                                          type: 'CATEGORY_OPTION',
                                          payload: {
                                             value,
                                             index,
                                             optionIndex,
                                             label: 'isActive',
                                          },
                                       })
                                    }
                                 >
                                    Active
                                 </Checkbox>
                                 <Checkbox
                                    id="label"
                                    checked={option.isVisible}
                                    onChange={value =>
                                       setModifier({
                                          type: 'CATEGORY_OPTION',
                                          payload: {
                                             value,
                                             index,
                                             optionIndex,
                                             label: 'isVisible',
                                          },
                                       })
                                    }
                                 >
                                    Visible
                                 </Checkbox>
                              </OptionBottom>
                           </OptionWrapper>
                        ))}
                        <ButtonTile
                           type="secondary"
                           text="Add Option"
                           onClick={() => open(3)}
                        />
                     </>
                  )}
               </CategoryWrapper>
            ))}
            <ButtonTile
               type="secondary"
               text="Add Category"
               onClick={() => setModifier({ type: 'ADD_CATEGORY' })}
            />
         </TunnelBody>
      </>
   )
}

export default ModifierFormTunnel
