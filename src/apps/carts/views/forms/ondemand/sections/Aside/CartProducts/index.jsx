import React from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Filler,
   Flex,
   Form,
   IconButton,
   Spacer,
   Text,
   TextButton,
   ButtonTile,
} from '@dailykit/ui'

import { useManual } from '../../../state'
import { MUTATIONS, QUERIES } from '../../../../../../graphql'
import { currencyFmt, logger } from '../../../../../../../../shared/utils'
import {
   CloseIcon,
   DeleteIcon,
} from '../../../../../../../../shared/assets/icons'
import EmptyIllo from '../../../../../../assets/svgs/EmptyIllo'

const CartProducts = () => {
   const { cart, billing, products } = useManual()
   const [remove] = useMutation(MUTATIONS.CART.ITEM.DELETE, {
      onCompleted: () => toast.success('Successfully deleted the product.'),
      onError: () => toast.error('Failed to delete the product.'),
   })
   return (
      <section>
         <Text as="text2">Products({products.aggregate.count})</Text>
         <Spacer size="8px" />
         {products.aggregate.count > 0 ? (
            <Styles.Cards>
               {products.nodes.map(product => (
                  <Styles.Card key={product.id}>
                     <aside>
                        {product.image ? (
                           <img src={product.image} alt={product.name} />
                        ) : (
                           <span>N/A</span>
                        )}
                     </aside>
                     <Flex
                        container
                        alignItems="center"
                        justifyContent="space-between"
                     >
                        <Flex as="main" container flexDirection="column">
                           <Text as="text2">{product.name}</Text>
                           <Text as="text3">
                              Price: {currencyFmt(product.price)}
                           </Text>
                        </Flex>
                        {cart?.paymentStatus === 'PENDING' && (
                           <IconButton
                              size="sm"
                              type="ghost"
                              onClick={() =>
                                 remove({ variables: { id: product.id } })
                              }
                           >
                              <DeleteIcon color="#ec3333" />
                           </IconButton>
                        )}
                     </Flex>
                  </Styles.Card>
               ))}
            </Styles.Cards>
         ) : (
            <Filler
               height="160px"
               message="No products added yet!"
               illustration={<EmptyIllo />}
            />
         )}
         <Spacer size="16px" />
         <LoyaltyPoints />
         <Spacer size="16px" />
         <Coupon />
         <Spacer size="16px" />
         <section>
            <Text as="text2">Billing Details</Text>
            <Spacer size="8px" />
            <Styles.Bill>
               <span>Item Total</span>
               <span>{currencyFmt(billing?.itemTotal)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Delivery Price</span>
               <span>{currencyFmt(billing?.deliveryPrice)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Tax</span>
               <span>{currencyFmt(billing?.tax)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Wallet Amount Used</span>
               <span>{currencyFmt(billing?.walletAmountUsed)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Loyalty Points Used </span>
               <span>{billing?.loyaltyPointsUsed}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Discount</span>
               <span>{currencyFmt(billing?.discount)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Total Price</span>
               <span>{currencyFmt(billing?.totalPrice)}</span>
            </Styles.Bill>
         </section>
      </section>
   )
}

export default CartProducts

const LoyaltyPoints = () => {
   const { id: cartId } = useParams()
   const { loyaltyPoints } = useManual()
   const [points, setPoints] = React.useState({
      value: '',
      meta: {
         errors: [],
         isTouched: false,
         isValid: true,
      },
   })

   const [updateCart, { loading }] = useMutation(MUTATIONS.CART.UPDATE, {
      onCompleted: () => {
         toast.success(
            `Successfully ${
               points.value > 0 ? 'added' : 'removed'
            } loyalty points.`
         )
         setPoints({
            value: 0,
            meta: {
               errors: [],
               isTouched: false,
               isValid: true,
            },
         })
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the fulfillment details.')
      },
   })

   const validate = e => {
      const { value } = e.target
      if (value === '') {
         setPoints({
            ...points,
            meta: {
               errors: [],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }

      const v = parseInt(value)
      if (isNaN(v)) {
         setPoints({
            ...points,
            meta: {
               errors: ['Please input numbers only!'],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }
      if (v <= 0) {
         setPoints({
            ...points,
            meta: {
               errors: ['Points should be greater than 0!'],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }
      if (v > loyaltyPoints.usable) {
         setPoints({
            ...points,
            meta: {
               errors: [`Points should be less than ${loyaltyPoints.usable}!`],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }
      if (v % 1 !== 0) {
         setPoints({
            ...points,
            meta: {
               errors: [`Points should be integers only!`],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }

      setPoints({
         ...points,
         meta: {
            errors: [],
            isValid: true,
            isTouched: true,
         },
      })
   }

   if (!loyaltyPoints.usable && !loyaltyPoints.used) return null

   return (
      <>
         <Text as="text2">Loyalty Points</Text>
         <Spacer size="4px" />
         <Styles.LoyaltyPoints>
            {loyaltyPoints.used ? (
               <Flex
                  container
                  alignItems="center"
                  justifyContent="space-between"
               >
                  <Text as="h3"> {loyaltyPoints.used} </Text>
                  <IconButton
                     type="ghost"
                     isLoading={loading}
                     onClick={() => {
                        updateCart({
                           variables: {
                              id: cartId,
                              _set: {
                                 loyaltyPointsUsed: 0,
                              },
                           },
                        })
                     }}
                  >
                     <CloseIcon color="#ec3333" />
                  </IconButton>
               </Flex>
            ) : (
               <Flex
                  container
                  alignItems="center"
                  justifyContent="space-between"
               >
                  <Flex>
                     <Form.Group>
                        <Form.Label htmlFor="points" title="points">
                           Points
                        </Form.Label>
                        <Form.Number
                           id="points"
                           name="points"
                           onBlur={validate}
                           onChange={e =>
                              setPoints({ ...points, value: e.target.value })
                           }
                           value={points.value}
                           placeholder="Enter points"
                           hasError={
                              points.meta.isTouched && !points.meta.isValid
                           }
                        />
                        {points.meta.isTouched &&
                           !points.meta.isValid &&
                           points.meta.errors.map((error, index) => (
                              <Form.Error justifyContent="center" key={index}>
                                 {error}
                              </Form.Error>
                           ))}
                     </Form.Group>
                     <Spacer size="4px" />
                     <Text as="text3">Max: {loyaltyPoints.usable}</Text>
                  </Flex>
                  <TextButton
                     type="ghost"
                     disabled={!points.meta.isValid || !points.value}
                     isLoading={loading}
                     onClick={() => {
                        if (points.meta.isValid && points.value) {
                           updateCart({
                              variables: {
                                 id: cartId,
                                 _set: {
                                    loyaltyPointsUsed: points.value,
                                 },
                              },
                           })
                        }
                     }}
                  >
                     Use
                  </TextButton>
               </Flex>
            )}
         </Styles.LoyaltyPoints>
      </>
   )
}

const Coupon = () => {
   const { id: cartId } = useParams()
   const { cart, customer, tunnels } = useManual()

   const { data, error } = useSubscription(QUERIES.CART.REWARDS, {
      variables: {
         cartId: +cartId,
         params: {
            cartId: +cartId,
            keycloakId: customer.keycloakId,
         },
      },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         if (data.cartRewards.length) {
            const isCouponValid = data.cartRewards.every(
               record => record.reward.condition.isValid
            )
            if (isCouponValid) {
               console.log('Coupon is valid!')
            } else {
               console.log('Coupon is not valid anymore!')
               toast.error('Coupon is not valid!')
               deleteCartRewards()
            }
         }
      },
   })
   if (error) {
      console.log('🚀 Coupon ~ error', error)
   }

   const [deleteCartRewards] = useMutation(MUTATIONS.CART.REWARDS.DELETE, {
      variables: {
         cartId: +cartId,
      },
      onCompleted: () => {
         toast.success('Coupon removed successfully!')
      },
      onError: error => {
         toast.error('Failed to delete coupon!')
         logger(error)
      },
   })

   return (
      <>
         {data?.cartRewards?.length ? (
            <Styles.Coupon
               container
               alignItems="center"
               justifyContent="space-between"
               padding="8px"
            >
               <Flex>
                  <Text as="text1">
                     {data.cartRewards[0].reward.coupon.code}
                  </Text>
                  <Spacer size="4px" />
                  <Text as="subtitle">Coupon applied!</Text>
               </Flex>
               {cart?.paymentStatus === 'PENDING' && (
                  <IconButton
                     type="ghost"
                     size="sm"
                     onClick={deleteCartRewards}
                  >
                     <CloseIcon color="#ec3333" />
                  </IconButton>
               )}
            </Styles.Coupon>
         ) : (
            <>
               {cart?.paymentStatus === 'PENDING' && (
                  <ButtonTile
                     type="secondary"
                     text="Add Coupon"
                     onClick={() => tunnels.coupons[1](1)}
                  />
               )}
            </>
         )}
      </>
   )
}

const Styles = {
   LoyaltyPoints: styled.div`
      background: #ffffff;
      border: 1px solid #ececec;
      padding: 8px;
   `,
   Cards: styled.ul`
      overflow-y: auto;
      max-height: 264px;
   `,
   Card: styled.li`
      padding: 4px;
      display: grid;
      grid-gap: 8px;
      min-height: 56px;
      border-radius: 2px;
      background: #ffffff;
      border: 1px solid #ececec;
      grid-template-columns: auto 1fr;
      + li {
         margin-top: 8px;
      }
      aside {
         width: 56px;
         height: 42px;
         display: flex;
         background: #eaeaea;
         align-items: center;
         justify-content: center;
         > span {
            font-size: 14px;
            color: #ab9e9e;
         }
         > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
         }
      }
   `,
   Bill: styled.section`
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
         font-size: 14px;
      }
   `,
   Coupon: styled(Flex)`
      background: #fff;
      border: 1px solid #ececec;
   `,
}
