import { useMutation, useSubscription } from '@apollo/react-hooks'
import styled, { css } from 'styled-components'
import { Filler, Flex, Text, Tunnel, TunnelHeader, Tunnels } from '@dailykit/ui'
import React from 'react'
import { InlineLoader } from '../../../../../../../shared/components'
import { MUTATIONS, QUERIES } from '../../../../../graphql'
import { useManual } from '../../state'
import { currencyFmt, logger } from '../../../../../../../shared/utils'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'

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

   return (
      <>
         <TunnelHeader
            title="Select Options"
            close={() => closeTunnel(1)}
            right={{
               title: 'Add',
               isLoading: adding,
               disabled: !selectedOption,
               action: () =>
                  insertCartItem({
                     variables: {
                        object: {
                           ...selectedOption.cartItem,
                           cartId: +cartId,
                        },
                     },
                  }),
            }}
         />
         <Flex padding="16px">
            {loading ? (
               <InlineLoader />
            ) : (
               <>
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
         </Flex>
      </>
   )
}

const Styles = {
   Option: styled.div`
      margin-bottom: 16px;
      padding: 16px 8px;
      display: flex;
      background: #fff;
      border: 1px solid ${props => (props.selected ? '#367BF5' : '#efefef')};
      cursor: pointer;
      justify-content: space-between;
   `,
   Price: styled.span(
      ({ strike }) => css`
         text-decoration-line: ${strike ? 'line-through' : 'none'};
         margin-right: ${strike ? '1ch' : '0'};
      `
   ),
}
