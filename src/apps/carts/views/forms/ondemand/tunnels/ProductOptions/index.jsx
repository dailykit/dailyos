import { useMutation, useSubscription } from '@apollo/react-hooks'
import styled, { css } from 'styled-components'
import {
   Filler,
   Flex,
   Spacer,
   Text,
   Tunnel,
   TunnelHeader,
   Tunnels,
} from '@dailykit/ui'
import React from 'react'
import { InlineLoader } from '../../../../../../../shared/components'
import { MUTATIONS, QUERIES } from '../../../../../graphql'
import { useManual } from '../../state'
import { currencyFmt, logger } from '../../../../../../../shared/utils'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { getCartItemWithModifiers, getModifiersValidator } from './utils'
import CircleCheckedIcon from '../../../../../../../shared/assets/icons/CircleChecked'
import CircleIcon from '../../../../../../../shared/assets/icons/Circle'
import SquareCheckedIcon from '../../../../../../../shared/assets/icons/SquareChecked'
import SquareIcon from '../../../../../../../shared/assets/icons/Square'

export const ProductOptionsTunnel = ({ panel }) => {
   const [tunnels] = panel
   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel size="md">
            <Content panel={panel} />
         </Tunnel>
      </Tunnels>
   )
}

const Content = ({ panel }) => {
   const { id: cartId } = useParams()
   const [, , closeTunnel] = panel
   const {
      state: { productId },
   } = useManual()

   const [selectedOption, setSelectedOption] = React.useState(null)
   const [modifiersState, setModifiersState] = React.useState({
      isValid: true,
      selectedModifiers: [],
   })

   const { data: { product = {} } = {}, loading, error } = useSubscription(
      QUERIES.PRODUCTS.ONE,
      {
         skip: !productId,
         variables: { id: productId },
      }
   )
   if (error) {
      console.log(error)
   }

   const [insertCartItem, { loading: adding }] = useMutation(
      MUTATIONS.CART.ITEM.INSERT,
      {
         onCompleted: () => {
            toast.success('Item added to cart!')
            closeTunnel(1)
         },
         onError: error => {
            logger(error)
            toast.error('Failed to add product to cart!')
         },
      }
   )

   const calcDiscountedPrice = (price, discount) => {
      return price - price * (discount / 100)
   }

   const add = () => {
      const cartItem = getCartItemWithModifiers(
         selectedOption.cartItem,
         modifiersState.selectedModifiers,
         product.type
      )
      insertCartItem({
         variables: {
            object: {
               ...cartItem,
               cartId: +cartId,
            },
         },
      })
   }

   const totalPrice = React.useMemo(() => {
      if (!product) return 0
      let total = calcDiscountedPrice(product.price, product.discount)
      if (selectedOption) {
         total += calcDiscountedPrice(
            selectedOption.price,
            selectedOption.discount
         )
         total += modifiersState.selectedModifiers.reduce(
            (acc, op) => acc + op.data[0].unitPrice,
            0
         )
      }
      return total
   }, [product, selectedOption, modifiersState.selectedModifiers])

   return (
      <>
         <TunnelHeader
            title="Select Options"
            close={() => closeTunnel(1)}
            right={{
               title: 'Add',
               isLoading: adding,
               disabled: !selectedOption || !modifiersState.isValid,
               action: add,
            }}
         />
         <Flex padding="16px">
            {loading ? (
               <InlineLoader />
            ) : (
               <>
                  <Flex container alignItems="center" justifyContent="flex-end">
                     <Text as="text2">Total: {currencyFmt(totalPrice)}</Text>
                  </Flex>
                  <Spacer size="12px" />
                  {product?.productOptions?.length ? (
                     product.productOptions.map(option => (
                        <Styles.Option
                           key={option.id}
                           selected={selectedOption?.id === option.id}
                           onClick={() => setSelectedOption(option)}
                        >
                           <Text as="text1"> {option.label} </Text>
                           <Flex container alignItems="center">
                              {option.discount ? (
                                 <>
                                    <Styles.Price strike>
                                       {currencyFmt(option.price)}
                                    </Styles.Price>
                                    <Styles.Price>
                                       +{' '}
                                       {currencyFmt(
                                          calcDiscountedPrice(
                                             option.price,
                                             option.discount
                                          )
                                       )}
                                    </Styles.Price>
                                 </>
                              ) : (
                                 <Styles.Price>
                                    + {currencyFmt(option.price)}
                                 </Styles.Price>
                              )}
                           </Flex>
                        </Styles.Option>
                     ))
                  ) : (
                     <Filler message="No options found!" />
                  )}
               </>
            )}
            <Spacer size="8px" />
            {Boolean(selectedOption?.modifier) && (
               <Modifiers
                  data={selectedOption.modifier}
                  handleChange={result => setModifiersState(result)}
               />
            )}
         </Flex>
      </>
   )
}

const Modifiers = ({ data, handleChange }) => {
   const [
      checkOptionAddValidity,
      checkModifierStateValidity,
   ] = getModifiersValidator(data)

   const [selectedModifiers, setSelectedModifiers] = React.useState([])

   React.useEffect(() => {
      const isValid = checkModifierStateValidity(selectedModifiers)
      handleChange({ isValid, selectedModifiers })
   }, [selectedModifiers.length])

   const calcDiscountedPrice = (price, discount) => {
      return price - price * (discount / 100)
   }

   const renderConditionText = category => {
      if (category.type === 'single') {
         return 'CHOOSE ONE*'
      } else {
         if (category.isRequired) {
            if (category.limits.min) {
               if (category.limits.max) {
                  return `CHOOSE AT LEAST ${category.limits.min} AND AT MOST ${category.limits.max}*`
               } else {
                  return `CHOOSE AT LEAST ${category.limits.min}*`
               }
            } else {
               if (category.limits.max) {
                  return `CHOOSE AT LEAST 1 AND AT MOST ${category.limits.max}*`
               } else {
                  return `CHOOSE AT LEAST 1*`
               }
            }
         } else {
            if (category.limits.max) {
               return 'CHOOSE AS MANY AS YOU LIKE'
            } else {
               return `CHOOSE AS MANY AS YOU LIKE UPTO ${category.limits.max}`
            }
         }
      }
   }

   const selectModifierOption = option => {
      const alreadyExists = selectedModifiers.find(
         item => item.data[0].modifierOptionId === option.id
      )
      if (alreadyExists) {
         // remove item
         const updatedItems = selectedModifiers.filter(
            item => item.data[0].modifierOptionId !== option.id
         )
         setSelectedModifiers(updatedItems)
         console.log('Removing...')
      } else {
         // add item
         const isValid = checkOptionAddValidity(selectedModifiers, option)
         if (isValid) {
            setSelectedModifiers([...selectedModifiers, option.cartItem])
            console.log('Adding...')
         } else {
            console.log('Cannot add!')
         }
      }
   }

   const renderIcon = (type, option) => {
      const exists = selectedModifiers.find(
         op => op.data[0].modifierOptionId === option.id
      )
      if (type === 'single') {
         return exists ? (
            <CircleCheckedIcon color="#367BF5" />
         ) : (
            <CircleIcon color="#aaa" />
         )
      } else {
         return exists ? (
            <SquareCheckedIcon color="#367BF5" />
         ) : (
            <SquareIcon color="#aaa" />
         )
      }
   }

   return (
      <>
         <Text as="text1">Modifiers</Text>
         <Spacer size="12px" />
         {data.categories.map(category => (
            <Styles.MCategory key={category.id}>
               <Flex container align="center">
                  <Text as="text2">{category.name}</Text>
                  <Spacer xAxis size="8px" />
                  <Text as="subtitle">{renderConditionText(category)}</Text>
               </Flex>
               <Spacer size="4px" />
               {category.options.map(option => (
                  <Styles.Option
                     key={option.id}
                     onClick={() =>
                        option.isActive && selectModifierOption(option)
                     }
                     faded={!option.isActive}
                  >
                     <Flex container alignItems="center">
                        {renderIcon(category.type, option)}
                        <Spacer xAxis size="8px" />
                        {Boolean(option.image) && (
                           <>
                              <Styles.OptionImage src={option.image} />
                              <Spacer xAxis size="8px" />
                           </>
                        )}
                        <Text as="text2"> {option.name} </Text>
                     </Flex>
                     <Flex container alignItems="center">
                        {option.discount ? (
                           <>
                              <Styles.Price strike>
                                 {currencyFmt(option.price)}
                              </Styles.Price>
                              <Styles.Price>
                                 +{' '}
                                 {currencyFmt(
                                    calcDiscountedPrice(
                                       option.price,
                                       option.discount
                                    )
                                 )}
                              </Styles.Price>
                           </>
                        ) : (
                           <Styles.Price>
                              + {currencyFmt(option.price)}
                           </Styles.Price>
                        )}
                     </Flex>
                  </Styles.Option>
               ))}
            </Styles.MCategory>
         ))}
      </>
   )
}

const Styles = {
   Option: styled.div`
      margin-bottom: 16px;
      padding: 0 8px;
      height: 56px;
      display: flex;
      background: #fff;
      border: 1px solid ${props => (props.selected ? '#367BF5' : '#efefef')};
      cursor: ${props => (props.faded ? 'not-allowed' : 'pointer')};
      justify-content: space-between;
      align-items: center;
      opacity: ${props => (props.faded ? '0.7' : '1')};
   `,
   Price: styled.span(
      ({ strike }) => css`
         text-decoration-line: ${strike ? 'line-through' : 'none'};
         margin-right: ${strike ? '1ch' : '0'};
      `
   ),
   MCategory: styled.div``,
   OptionImage: styled.img`
      height: 40px;
      width: 40px;
      border-radius: 2px;
      object-fit: cover;
   `,
}
