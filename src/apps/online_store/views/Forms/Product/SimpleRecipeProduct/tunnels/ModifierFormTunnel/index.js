import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
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
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import {
   CREATE_MODIFIER,
   UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
} from '../../../../../../graphql'

const ModifierFormTunnel = ({ open, close }) => {
   const {
      modifiersState: { modifier, meta },
      modifiersDispatch,
   } = React.useContext(ModifiersContext)

   const [saving, setSaving] = React.useState(false)

   const options = [
      { id: 1, title: 'Single' },
      { id: 2, title: 'Multiple' },
   ]

   // Mutations
   const [createModifier] = useMutation(CREATE_MODIFIER)
   const [updateSimpleRecipeProductOption] = useMutation(
      UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
      {
         onCompleted: () => {
            toast.success('Modifier added to option!')
            close(2)
            close(1)
         },
         onError: error => {
            toast.error('Error')
            console.log(error)
         },
      }
   )

   const save = async () => {
      try {
         if (saving) return
         setSaving(true)
         if (modifier.id) {
            // update
         } else {
            const { data } = await createModifier({
               variables: {
                  object: {
                     name: modifier.name,
                     data: {
                        categories: modifier.categories,
                     },
                  },
               },
            })
            if (data.createModifier?.id) {
               toast.success('Modifier created')
               if (meta.optionId) {
                  updateSimpleRecipeProductOption({
                     variables: {
                        id: meta.optionId,
                        set: {
                           modifierId: data.createModifier.id,
                        },
                     },
                  })
               }
            }
         }
      } catch (err) {
         console.log(err)
      } finally {
         setSaving(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Create New Modifier Template"
            close={() => close(2)}
            right={{
               action: save,
               title: saving ? 'Saving...' : 'Save',
            }}
         />
         <TunnelBody>
            <Input
               type="text"
               label="Template Name"
               name="template-name"
               value={modifier.name}
               onChange={e =>
                  modifiersDispatch({
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
                        modifiersDispatch({
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
                        modifiersDispatch({
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
                                 modifiersDispatch({
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
                                 modifiersDispatch({
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
                     </>
                  )}
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
                                       modifiersDispatch({
                                          type: 'EDIT_CATEGORY_OPTION',
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
                                       modifiersDispatch({
                                          type: 'EDIT_CATEGORY_OPTION',
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
                                    value={option.productQuantity}
                                    onChange={e =>
                                       modifiersDispatch({
                                          type: 'EDIT_CATEGORY_OPTION',
                                          payload: {
                                             value: e.target.value,
                                             index,
                                             optionIndex,
                                             label: 'productQuantity',
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
                                 modifiersDispatch({
                                    type: 'EDIT_CATEGORY_OPTION',
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
                                 modifiersDispatch({
                                    type: 'EDIT_CATEGORY_OPTION',
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
                                 modifiersDispatch({
                                    type: 'EDIT_CATEGORY_OPTION',
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
                     onClick={() => {
                        modifiersDispatch({
                           type: 'META',
                           payload: {
                              name: 'selectedCategoryIndex',
                              value: index,
                           },
                        })
                        open(3)
                     }}
                  />
               </CategoryWrapper>
            ))}
            <ButtonTile
               type="secondary"
               text="Add Category"
               onClick={() => modifiersDispatch({ type: 'ADD_CATEGORY' })}
            />
         </TunnelBody>
      </>
   )
}

export default ModifierFormTunnel
