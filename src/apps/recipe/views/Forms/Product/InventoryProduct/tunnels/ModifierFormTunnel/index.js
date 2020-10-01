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
import { TunnelBody, Grid, StyledInputWrapper, Flex } from '../styled'
import {
   CategoryWrapper,
   OptionWrapper,
   OptionTop,
   OptionBottom,
   Action,
   ImageContainer,
} from './styled'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import {
   CREATE_MODIFIER,
   UPDATE_MODIFIER,
   UPDATE_INVENTORY_PRODUCT_OPTION,
} from '../../../../../../graphql'
import { DeleteIcon } from '../../../../../../assets/icons'

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
   const [updateModifier] = useMutation(UPDATE_MODIFIER, {
      onCompleted: () => {
         toast.success('Modifier updated!')
         modifiersDispatch({ type: 'RESET' })
         close(2)
         close(1)
      },
      onError: error => {
         toast.error('Error')
         console.log(error)
      },
   })
   const [updateInventoryProductOption] = useMutation(
      UPDATE_INVENTORY_PRODUCT_OPTION,
      {
         onCompleted: () => {
            toast.success('Modifier added to option!')
            modifiersDispatch({ type: 'RESET' })
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
            updateModifier({
               variables: {
                  id: modifier.id,
                  set: {
                     name: modifier.name,
                     data: {
                        categories: modifier.categories,
                     },
                  },
               },
            })
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
                  updateInventoryProductOption({
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
                  <Action
                     onClick={() =>
                        modifiersDispatch({
                           type: 'DELETE_CATEGORY',
                           payload: {
                              index,
                           },
                        })
                     }
                  >
                     <DeleteIcon color="#FF5A52" />
                  </Action>
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
                  <Grid>
                     <div>
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
                     </div>
                     <div>
                        <Text as="subtitle">Flags</Text>
                        <Grid style={{ margin: '8px auto' }}>
                           <Checkbox
                              id="label"
                              checked={category.isActive}
                              onChange={value =>
                                 modifiersDispatch({
                                    type: 'CATEGORY_FLAG',
                                    payload: {
                                       value,
                                       index,
                                       label: 'isActive',
                                    },
                                 })
                              }
                           >
                              Active
                           </Checkbox>
                           <Checkbox
                              id="label"
                              checked={category.isRequired}
                              onChange={value =>
                                 modifiersDispatch({
                                    type: 'CATEGORY_FLAG',
                                    payload: {
                                       value,
                                       index,
                                       label: 'isRequired',
                                    },
                                 })
                              }
                           >
                              Required
                           </Checkbox>
                        </Grid>
                     </div>
                  </Grid>
                  {category.type === 'multiple' && (
                     <>
                        <Text as="subtitle">Limits</Text>
                        <Grid cols="3" style={{ margin: '8px auto' }}>
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
                           {/* <Input
                              type="number"
                              label="Free"
                              name="free"
                              value={category.limits.free}
                              onChange={e =>
                                 modifiersDispatch({
                                    type: 'CATEGORY_LIMIT',
                                    payload: {
                                       value: e.target.value,
                                       index,
                                       label: 'free',
                                    },
                                 })
                              }
                           /> */}
                        </Grid>
                     </>
                  )}
                  <Text as="subtitle">Options</Text>
                  {category.options.map((option, optionIndex) => (
                     <OptionWrapper>
                        <Action
                           onClick={() =>
                              modifiersDispatch({
                                 type: 'DELETE_CATEGORY_OPTION',
                                 payload: {
                                    index,
                                    optionIndex,
                                 },
                              })
                           }
                        >
                           <DeleteIcon color="#FF5A52" />
                        </Action>
                        <OptionTop>
                           {option.image ? (
                              <ImageContainer>
                                 <Action
                                    onClick={() =>
                                       modifiersDispatch({
                                          type: 'EDIT_CATEGORY_OPTION',
                                          payload: {
                                             index,
                                             optionIndex,
                                             label: 'image',
                                             value: '',
                                          },
                                       })
                                    }
                                 >
                                    <DeleteIcon color="#FF5A52" />
                                 </Action>
                                 <img src={option.image} alt="Option" />
                              </ImageContainer>
                           ) : (
                              <ButtonTile
                                 type="primary"
                                 size="sm"
                                 text="Add Photo"
                                 onClick={() => {
                                    modifiersDispatch({
                                       type: 'META',
                                       payload: {
                                          name: 'selectedOptionIndex',
                                          value: optionIndex,
                                       },
                                    })
                                    modifiersDispatch({
                                       type: 'META',
                                       payload: {
                                          name: 'selectedCategoryIndex',
                                          value: index,
                                       },
                                    })
                                    open(5)
                                 }}
                              />
                           )}
                           <div>
                              <Flex style={{ marginBottom: '12px' }}>
                                 <div>
                                    <Input
                                       type="text"
                                       label="Name"
                                       name={`name-${optionIndex}`}
                                       value={option.name}
                                       onChange={e =>
                                          modifiersDispatch({
                                             type: 'EDIT_CATEGORY_OPTION',
                                             payload: {
                                                value: e.target.value,
                                                index,
                                                optionIndex,
                                                label: 'name',
                                             },
                                          })
                                       }
                                    />
                                    <small>{option.originalName}</small>
                                 </div>
                                 {['supplierItem', 'sachetItem'].includes(
                                    option.productType
                                 ) && (
                                    <Text as="subtitle">
                                       Unit size: {option.unit}
                                    </Text>
                                 )}
                              </Flex>
                              <Grid cols="3">
                                 <StyledInputWrapper>
                                    $
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
                                 </StyledInputWrapper>
                                 <StyledInputWrapper>
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
                                    %
                                 </StyledInputWrapper>
                                 <StyledInputWrapper>
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
                                    {option.productType === 'bulkItem' &&
                                       `${option.unit}`}
                                 </StyledInputWrapper>
                              </Grid>
                           </div>
                        </OptionTop>
                        <OptionBottom>
                           <div> </div>
                           {/* <Checkbox
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
                           </Checkbox> */}
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
