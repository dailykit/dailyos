import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   ComboButton,
   Form,
   PlusIcon,
   RadioGroup,
   Spacer,
   Text,
   TunnelHeader,
} from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../../../../shared/assets/icons'
import { Tooltip } from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'
import { DeleteIcon } from '../../../../../../assets/icons'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import {
   CREATE_MODIFIER,
   UPDATE_INVENTORY_PRODUCT_OPTION,
   UPDATE_MODIFIER,
} from '../../../../../../graphql'
import validator from '../../../validators'
import { Flex, Grid, TunnelBody } from '../styled'
import {
   Action,
   CategoryWrapper,
   ImageContainer,
   OptionBottom,
   OptionTop,
   OptionWrapper,
} from './styled'

const ModifierFormTunnel = ({
   open,
   close,
   openOperationConfigTunnel,
   modifierOpConfig,
}) => {
   const {
      modifiersState: { modifier, meta },
      modifiersDispatch,
   } = React.useContext(ModifiersContext)

   const clickedOption = React.useRef(undefined)
   const [saving, setSaving] = React.useState(false)

   const options = [
      { id: 'single', title: 'Single' },
      { id: 'multiple', title: 'Multiple' },
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
         toast.error('Something went wrong!')
         logger(error)
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
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   const isObjectValid = () => {
      if (!modifier.name.value || !modifier.name.meta.isValid) {
         return false
      }
      const hasValidCategories = modifier.categories.every(category => {
         if (!category.name.value || !category.name.meta.isValid) {
            return false
         }
         if (category.type === 'multiple') {
            if (!category.limits.min.value || !category.limits.min.isValid) {
               return false
            }
            if (!category.limits.max.value || !category.limits.max.isValid) {
               return false
            }
            if (!category.limits.free.value || !category.limits.free.isValid) {
               return false
            }
            if (+category.limits.min.value > +category.limits.max.value) {
               return false
            }
         }
         const hasValidOptions = category.options.every(option => {
            if (!option.name.value || !option.name.meta.isValid) {
               return false
            }
            if (!option.price.value || !option.price.meta.isValid) {
               return false
            }
            if (!option.discount.value || !option.discount.meta.isValid) {
               return false
            }
            if (
               !option.productQuantity.value ||
               !option.productQuantity.meta.isValid
            ) {
               return false
            }
            if (!option.operationConfig.value) {
               return false
            }
            return true
         })
         if (!hasValidOptions) {
            return false
         }
         return true
      })
      if (!hasValidCategories) {
         return false
      }
      return true
   }

   const save = async () => {
      try {
         if (saving) return
         setSaving(true)
         if (isObjectValid()) {
            const object = {
               name: modifier.name.value,
            }
            object.categories = modifier.categories.map(category => {
               const cat = {
                  name: category.name.value,
                  isActive: category.isActive.value,
                  isRequired: category.isRequired.value,
                  type: category.type.value,
               }
               if (cat.type === 'multiple') {
                  cat.limits = {
                     min: +category.limits.min.value,
                     max: +category.limits.max.value,
                     free: +category.limits.free.value,
                  }
               }
               cat.options = category.options.map(option => ({
                  name: option.name.value,
                  originalName: option.originalName,
                  productId: option.productId,
                  productType: option.productType,
                  isActive: option.isActive.value,
                  isVisible: option.isVisible.value,
                  isAlwaysCharged: option.isAlwaysCharged.value,
                  price: +option.price.value,
                  discount: +option.discount.value,
                  image: option.image.value,
                  unit: option.unit,
                  productQuantity: +option.productQuantity.value,
                  operationConfig: option.operationConfig.value,
               }))
               return cat
            })
            console.log(object)
            if (modifier.id) {
               updateModifier({
                  variables: {
                     id: modifier.id,
                     set: {
                        name: object.name,
                        data: {
                           categories: object.categories,
                        },
                     },
                  },
               })
            } else {
               const { data } = await createModifier({
                  variables: {
                     object: {
                        name: object.name,
                        data: {
                           categories: object.categories,
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
         } else {
            toast.error('Invalid values!')
         }
      } catch (error) {
         console.log(error)
      } finally {
         setSaving(false)
      }
   }

   React.useEffect(() => {
      if (modifierOpConfig && clickedOption.current) {
         console.log('Op Config: ', modifierOpConfig)
         modifiersDispatch({
            type: 'OPTION_VALUE',
            payload: {
               ...clickedOption.current,
               field: 'operationConfig',
               value: {
                  id: modifierOpConfig.id,
                  name: `${modifierOpConfig.station.name} - ${modifierOpConfig.labelTemplate.name}`,
               },
            },
         })
         clickedOption.current = undefined
      }
   }, [modifierOpConfig])

   return (
      <>
         <TunnelHeader
            title="Create New Modifier Template"
            close={() => close(2)}
            right={{
               action: save,
               title: saving ? 'Saving...' : 'Save',
            }}
            tooltip={<Tooltip identifier="add_modifier_tunnel" />}
         />
         <TunnelBody>
            <Form.Group>
               <Form.Label htmlFor="name" title="name">
                  Template Name*
               </Form.Label>
               <Form.Text
                  id="name"
                  name="name"
                  onBlur={() => {
                     const { isValid, errors } = validator.name(
                        modifier.name.value
                     )
                     modifiersDispatch({
                        type: 'NAME_ERROR',
                        payload: {
                           meta: {
                              isTouched: true,
                              isValid,
                              errors,
                           },
                        },
                     })
                  }}
                  onChange={e =>
                     modifiersDispatch({
                        type: 'NAME',
                        payload: { value: e.target.value },
                     })
                  }
                  value={modifier.name.value}
                  placeholder="Enter template name"
                  hasError={
                     modifier.name.meta.isTouched && !modifier.name.meta.isValid
                  }
               />
               {modifier.name.meta.isTouched &&
                  !modifier.name.meta.isValid &&
                  modifier.name.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
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
                  <Form.Group>
                     <Form.Label
                        htmlFor={`categoryName-${index}`}
                        title={`categoryName-${index}`}
                     >
                        Category Name*
                     </Form.Label>
                     <Form.Text
                        id={`categoryName-${index}`}
                        name={`categoryName-${index}`}
                        onBlur={() => {
                           const { isValid, errors } = validator.name(
                              category.name.value
                           )
                           modifiersDispatch({
                              type: 'CATEGORY_ERROR',
                              payload: {
                                 index,
                                 field: 'name',
                                 meta: {
                                    isTouched: true,
                                    isValid,
                                    errors,
                                 },
                              },
                           })
                        }}
                        onChange={e =>
                           modifiersDispatch({
                              type: 'CATEGORY_VALUE',
                              payload: {
                                 index,
                                 field: 'name',
                                 value: e.target.value,
                              },
                           })
                        }
                        value={category.name.value}
                        placeholder="Enter category name"
                        hasError={
                           category.name.meta.isTouched &&
                           !category.name.meta.isValid
                        }
                     />
                     {category.name.meta.isTouched &&
                        !category.name.meta.isValid &&
                        category.name.meta.errors.map((error, index) => (
                           <Form.Error key={index}>{error}</Form.Error>
                        ))}
                  </Form.Group>
                  <Spacer size="8px" />
                  <Grid>
                     <div>
                        <Text as="subtitle">Type</Text>
                        <RadioGroup
                           options={options}
                           active={category.type.value}
                           onChange={option =>
                              modifiersDispatch({
                                 type: 'CATEGORY_TYPE',
                                 payload: {
                                    value: option.id,
                                    index,
                                 },
                              })
                           }
                        />
                     </div>
                     <div>
                        <Text as="subtitle">Flags</Text>
                        <Grid>
                           <Form.Checkbox
                              name={`isActive-${index}`}
                              value={category.isActive.value}
                              onChange={() =>
                                 modifiersDispatch({
                                    type: 'CATEGORY_FLAG',
                                    payload: {
                                       value: !category.isActive.value,
                                       index,
                                       field: 'isActive',
                                    },
                                 })
                              }
                           >
                              Active
                           </Form.Checkbox>
                           <Form.Checkbox
                              name={`isRequired-${index}`}
                              value={category.isRequired.value}
                              onChange={() =>
                                 modifiersDispatch({
                                    type: 'CATEGORY_FLAG',
                                    payload: {
                                       value: !category.isRequired.value,
                                       index,
                                       field: 'isRequired',
                                    },
                                 })
                              }
                           >
                              Required
                           </Form.Checkbox>
                        </Grid>
                     </div>
                  </Grid>
                  <Spacer size="8px" />
                  {category.type.value === 'multiple' && (
                     <>
                        <Text as="subtitle">Limits</Text>
                        <Grid cols="3">
                           <Form.Group>
                              <Form.Label
                                 htmlFor={`min-${index}`}
                                 title={`min-${index}`}
                              >
                                 Min*
                              </Form.Label>
                              <Form.Number
                                 id={`min-${index}`}
                                 name={`min-${index}`}
                                 onBlur={() => {
                                    const { isValid, errors } = validator.min(
                                       category.limits.min.value
                                    )
                                    modifiersDispatch({
                                       type: 'CATEGORY_LIMIT_ERROR',
                                       payload: {
                                          index,
                                          field: 'min',
                                          meta: {
                                             isTouched: true,
                                             isValid,
                                             errors,
                                          },
                                       },
                                    })
                                 }}
                                 onChange={e => {
                                    modifiersDispatch({
                                       type: 'CATEGORY_LIMIT_VALUE',
                                       payload: {
                                          value: e.target.value,
                                          index,
                                          field: 'min',
                                       },
                                    })
                                 }}
                                 value={category.limits.min.value}
                                 placeholder="Enter min value"
                                 hasError={
                                    !category.limits.min.meta.isValid &&
                                    category.limits.min.meta.isTouched
                                 }
                              />
                              {category.limits.min.meta.isTouched &&
                                 !category.limits.min.meta.isValid &&
                                 category.limits.min.meta.errors.map(
                                    (error, index) => (
                                       <Form.Error key={index}>
                                          {error}
                                       </Form.Error>
                                    )
                                 )}
                           </Form.Group>
                           <Form.Group>
                              <Form.Label
                                 htmlFor={`min-${index}`}
                                 title={`min-${index}`}
                              >
                                 Max*
                              </Form.Label>
                              <Form.Number
                                 id={`max-${index}`}
                                 name={`max-${index}`}
                                 onBlur={() => {
                                    const { isValid, errors } = validator.max(
                                       category.limits.max.value
                                    )
                                    modifiersDispatch({
                                       type: 'CATEGORY_LIMIT_ERROR',
                                       payload: {
                                          index,
                                          field: 'max',
                                          meta: {
                                             isTouched: true,
                                             isValid,
                                             errors,
                                          },
                                       },
                                    })
                                 }}
                                 onChange={e => {
                                    modifiersDispatch({
                                       type: 'CATEGORY_LIMIT_VALUE',
                                       payload: {
                                          value: e.target.value,
                                          index,
                                          field: 'max',
                                       },
                                    })
                                 }}
                                 value={category.limits.max.value}
                                 placeholder="Enter max value"
                                 hasError={
                                    !category.limits.max.meta.isValid &&
                                    category.limits.max.meta.isTouched
                                 }
                              />
                              {category.limits.max.meta.isTouched &&
                                 !category.limits.max.meta.isValid &&
                                 category.limits.max.meta.errors.map(
                                    (error, index) => (
                                       <Form.Error key={index}>
                                          {error}
                                       </Form.Error>
                                    )
                                 )}
                           </Form.Group>
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
                           {option.image.value ? (
                              <ImageContainer>
                                 <Action
                                    onClick={() =>
                                       modifiersDispatch({
                                          type: 'OPTION_VALUE',
                                          payload: {
                                             index,
                                             optionIndex,
                                             field: 'image',
                                             value: '',
                                          },
                                       })
                                    }
                                 >
                                    <DeleteIcon color="#FF5A52" />
                                 </Action>
                                 <img src={option.image.value} alt="Option" />
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
                              <Flex>
                                 <div>
                                    <Form.Group>
                                       <Form.Label
                                          htmlFor={`optionName-${index}-${optionIndex}`}
                                          title={`optionName-${index}-${optionIndex}`}
                                       >
                                          Option Name*
                                       </Form.Label>
                                       <Form.Text
                                          id={`optionName-${index}-${optionIndex}`}
                                          name={`optionName-${index}-${optionIndex}`}
                                          onBlur={() => {
                                             const {
                                                isValid,
                                                errors,
                                             } = validator.name(
                                                option.name.value
                                             )
                                             modifiersDispatch({
                                                type: 'OPTION_ERROR',
                                                payload: {
                                                   index,
                                                   optionIndex,
                                                   field: 'name',
                                                   meta: {
                                                      isTouched: true,
                                                      isValid,
                                                      errors,
                                                   },
                                                },
                                             })
                                          }}
                                          onChange={e =>
                                             modifiersDispatch({
                                                type: 'OPTION_VALUE',
                                                payload: {
                                                   index,
                                                   optionIndex,
                                                   field: 'name',
                                                   value: e.target.value,
                                                },
                                             })
                                          }
                                          value={option.name.value}
                                          placeholder="Enter option name"
                                          hasError={
                                             option.name.meta.isTouched &&
                                             !option.name.meta.isValid
                                          }
                                       />
                                       {option.name.meta.isTouched &&
                                          !option.name.meta.isValid &&
                                          option.name.meta.errors.map(
                                             (error, index) => (
                                                <Form.Error key={index}>
                                                   {error}
                                                </Form.Error>
                                             )
                                          )}
                                    </Form.Group>
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
                              <Spacer size="8px" />
                              <Grid cols="3">
                                 <Form.Group>
                                    <Form.Label
                                       htmlFor={`optionPrice-${index}-${optionIndex}`}
                                       title={`optionPrice-${index}-${optionIndex}`}
                                    >
                                       Price*
                                    </Form.Label>
                                    <Form.Number
                                       id={`optionPrice-${index}-${optionIndex}`}
                                       name={`optionPrice-${index}-${optionIndex}`}
                                       onBlur={() => {
                                          // using discount validator because it allows 0
                                          const {
                                             isValid,
                                             errors,
                                          } = validator.discount(
                                             option.price.value
                                          )
                                          modifiersDispatch({
                                             type: 'OPTION_ERROR',
                                             payload: {
                                                index,
                                                optionIndex,
                                                field: 'price',
                                                meta: {
                                                   isTouched: true,
                                                   isValid,
                                                   errors,
                                                },
                                             },
                                          })
                                       }}
                                       onChange={e => {
                                          modifiersDispatch({
                                             type: 'OPTION_VALUE',
                                             payload: {
                                                value: e.target.value,
                                                index,
                                                optionIndex,
                                                field: 'price',
                                             },
                                          })
                                       }}
                                       value={option.price.value}
                                       placeholder="Enter price"
                                       hasError={
                                          !option.price.meta.isValid &&
                                          option.price.meta.isTouched
                                       }
                                    />
                                    {option.price.meta.isTouched &&
                                       !option.price.meta.isValid &&
                                       option.price.meta.errors.map(
                                          (error, index) => (
                                             <Form.Error key={index}>
                                                {error}
                                             </Form.Error>
                                          )
                                       )}
                                 </Form.Group>
                                 <Form.Group>
                                    <Form.Label
                                       htmlFor={`optionDiscount-${index}-${optionIndex}`}
                                       title={`optionDiscount-${index}-${optionIndex}`}
                                    >
                                       Discount(%)*
                                    </Form.Label>
                                    <Form.Number
                                       id={`optionDiscount-${index}-${optionIndex}`}
                                       name={`optionDiscount-${index}-${optionIndex}`}
                                       onBlur={() => {
                                          const {
                                             isValid,
                                             errors,
                                          } = validator.discount(
                                             option.discount.value
                                          )
                                          modifiersDispatch({
                                             type: 'OPTION_ERROR',
                                             payload: {
                                                index,
                                                optionIndex,
                                                field: 'discount',
                                                meta: {
                                                   isTouched: true,
                                                   isValid,
                                                   errors,
                                                },
                                             },
                                          })
                                       }}
                                       onChange={e => {
                                          modifiersDispatch({
                                             type: 'OPTION_VALUE',
                                             payload: {
                                                value: e.target.value,
                                                index,
                                                optionIndex,
                                                field: 'discount',
                                             },
                                          })
                                       }}
                                       value={option.discount.value}
                                       placeholder="Enter discount"
                                       hasError={
                                          !option.discount.meta.isValid &&
                                          option.discount.meta.isTouched
                                       }
                                    />
                                    {option.discount.meta.isTouched &&
                                       !option.discount.meta.isValid &&
                                       option.discount.meta.errors.map(
                                          (error, index) => (
                                             <Form.Error key={index}>
                                                {error}
                                             </Form.Error>
                                          )
                                       )}
                                 </Form.Group>
                                 <Form.Group>
                                    <Form.Label
                                       htmlFor={`optionQty-${index}-${optionIndex}`}
                                       title={`optionQty-${index}-${optionIndex}`}
                                    >
                                       Quantity
                                       {option.productType === 'bulkItem' &&
                                          `${option.unit}`}
                                       *
                                    </Form.Label>
                                    <Form.Number
                                       id={`optionQty-${index}-${optionIndex}`}
                                       name={`optionQty-${index}-${optionIndex}`}
                                       onBlur={() => {
                                          const {
                                             isValid,
                                             errors,
                                          } = validator.quantity(
                                             option.productQuantity.value
                                          )
                                          modifiersDispatch({
                                             type: 'OPTION_ERROR',
                                             payload: {
                                                index,
                                                optionIndex,
                                                field: 'productQuantity',
                                                meta: {
                                                   isTouched: true,
                                                   isValid,
                                                   errors,
                                                },
                                             },
                                          })
                                       }}
                                       onChange={e => {
                                          modifiersDispatch({
                                             type: 'OPTION_VALUE',
                                             payload: {
                                                value: e.target.value,
                                                index,
                                                optionIndex,
                                                field: 'productQuantity',
                                             },
                                          })
                                       }}
                                       value={option.productQuantity.value}
                                       placeholder="Enter quantity"
                                       hasError={
                                          !option.productQuantity.meta
                                             .isValid &&
                                          option.productQuantity.meta.isTouched
                                       }
                                    />
                                    {option.productQuantity.meta.isTouched &&
                                       !option.productQuantity.meta.isValid &&
                                       option.productQuantity.meta.errors.map(
                                          (error, index) => (
                                             <Form.Error key={index}>
                                                {error}
                                             </Form.Error>
                                          )
                                       )}
                                 </Form.Group>
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
                           <Form.Checkbox
                              name={`isActiveOption-${index}-${optionIndex}`}
                              value={option.isActive.value}
                              onChange={() =>
                                 modifiersDispatch({
                                    type: 'OPTION_VALUE',
                                    payload: {
                                       value: !option.isActive.value,
                                       index,
                                       optionIndex,
                                       field: 'isActive',
                                    },
                                 })
                              }
                           >
                              Active
                           </Form.Checkbox>
                           <Form.Checkbox
                              name={`isVisibleOption-${index}-${optionIndex}`}
                              value={option.isVisible.value}
                              onChange={() =>
                                 modifiersDispatch({
                                    type: 'OPTION_VALUE',
                                    payload: {
                                       value: !option.isVisible.value,
                                       index,
                                       optionIndex,
                                       field: 'isVisible',
                                    },
                                 })
                              }
                           >
                              Visible
                           </Form.Checkbox>
                           <Flex container alignItems="center">
                              {option?.operationConfig?.value ? (
                                 <ComboButton
                                    type="ghost"
                                    size="sm"
                                    onClick={() => {
                                       clickedOption.current = {
                                          index,
                                          optionIndex,
                                       }
                                       openOperationConfigTunnel(1)
                                    }}
                                 >
                                    <CloseIcon color="#19B7EE" />
                                    {option.operationConfig.value.name}
                                 </ComboButton>
                              ) : (
                                 <ComboButton
                                    type="ghost"
                                    size="sm"
                                    onClick={() => {
                                       clickedOption.current = {
                                          index,
                                          optionIndex,
                                       }
                                       openOperationConfigTunnel(1)
                                    }}
                                 >
                                    <PlusIcon color="#19B7EE" />
                                    Operation Config
                                 </ComboButton>
                              )}
                           </Flex>
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
