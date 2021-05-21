import React from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useQuery } from '@apollo/react-hooks'
import {
   Text,
   Flex,
   Spacer,
   Filler,
   Avatar,
   TextButton,
   IconButton,
} from '@dailykit/ui'

import { useManual } from '../../state'
import { QUERIES } from '../../../../../graphql'
import EmptyIllo from '../../../../../assets/svgs/EmptyIllo'
import * as Icon from '../../../../../../../shared/assets/icons'
import { parseAddress } from '../../../../../../../shared/utils'
import { InlineLoader } from '../../../../../../../shared/components'

export const Aside = () => {
   const {
      brand,
      tunnels,
      address,
      customer,
      paymentMethod,
      dispatch,
   } = useManual()
   const [isCustomerLoading, setIsCustomerLoading] = React.useState(true)
   const [isPaymentLoading, setIsPaymentLoading] = React.useState(true)
   useQuery(QUERIES.CUSTOMER.LIST, {
      skip: !brand?.id || !customer?.id,
      variables: {
         where: {
            brandId: { _eq: brand?.id },
            customer: { id: { _eq: customer?.id } },
         },
      },
      onCompleted: ({ customers = [] } = {}) => {
         if (isEmpty(customers)) return
         const [node] = customers
         dispatch({ type: 'SET_CUSTOMER', payload: node })
         setIsCustomerLoading(false)
      },
      onError: () => {
         setIsCustomerLoading(false)
         toast.error('Failed to get customer details, please refresh the page.')
      },
   })
   useQuery(QUERIES.CUSTOMER.PAYMENT_METHODS.ONE, {
      skip: !paymentMethod?.id,
      variables: { id: paymentMethod?.id },
      onCompleted: ({ paymentMethod = {} } = {}) => {
         if (!isEmpty(paymentMethod)) {
            dispatch({ type: 'SET_PAYMENT', payload: paymentMethod })
         }
         setIsPaymentLoading(false)
      },
      onError: () => {
         setIsPaymentLoading(false)
         toast.error(
            'Failed to get payment method details, please refresh the page.'
         )
      },
   })
   return (
      <Styles.Aside>
         <main>
            <section></section>
            <section>
               <Styles.Card>
                  <Header title="Store" />
                  <Flex as="main" padding="0 8px 8px 8px">
                     {brand?.id ? (
                        <>
                           <Flex container alignItems="center">
                              {brand?.title && (
                                 <>
                                    <Avatar title={brand.title} />
                                    <Spacer size="22px" xAxis />
                                 </>
                              )}
                              <Flex>
                                 <Text as="p">{brand?.title}</Text>
                                 <Text as="p">{brand?.domain}</Text>
                              </Flex>
                           </Flex>
                        </>
                     ) : (
                        <Styles.Filler
                           height="100px"
                           message="Please select a brand"
                           illustration={<EmptyIllo width="120px" />}
                        />
                     )}
                  </Flex>
               </Styles.Card>
               <Spacer size="8px" />
               <Styles.Card>
                  <Header title="Customer" />
                  {isCustomerLoading ? (
                     <InlineLoader />
                  ) : (
                     <Flex as="main" padding="0 8px 8px 8px">
                        {customer?.id ? (
                           <>
                              <Flex container alignItems="center">
                                 <Avatar title={customer?.fullName || ''} />
                                 <Spacer size="22px" xAxis />
                                 <Flex>
                                    <Text as="p">{customer?.email}</Text>
                                    <Text as="p">{customer?.phoneNumber}</Text>
                                 </Flex>
                              </Flex>
                           </>
                        ) : (
                           <Styles.Filler
                              height="100px"
                              message="Please select a customer"
                              illustration={<EmptyIllo width="120px" />}
                           />
                        )}
                     </Flex>
                  )}
               </Styles.Card>
               <Spacer size="8px" />
               <Styles.Card>
                  <Header
                     title="Fulfillment"
                     onEdit={() => {
                        if (!customer?.id) {
                           return toast.warning(
                              'Please select a customer first.'
                           )
                        }
                        tunnels.address[1](1)
                     }}
                  />
                  <Flex as="main" padding="0 8px 8px 8px">
                     {address?.id ? (
                        <Text as="p">{parseAddress(address)}</Text>
                     ) : (
                        <Styles.Filler
                           height="100px"
                           message="Please select an address"
                           illustration={<EmptyIllo width="120px" />}
                        />
                     )}
                  </Flex>
               </Styles.Card>
               <Spacer size="8px" />
               <Styles.Card>
                  <Header
                     title="Payment Details"
                     onEdit={() => {
                        if (!customer?.id) {
                           return toast.warning(
                              'Please select a customer first.'
                           )
                        }
                        tunnels.payment[1](1)
                     }}
                  />
                  {isPaymentLoading ? (
                     <InlineLoader />
                  ) : (
                     <Flex as="main" padding="0 8px 8px 8px">
                        {paymentMethod?.id ? (
                           <div>
                              <Text as="p">Name: {paymentMethod.name}</Text>
                              <Text as="p">
                                 Expiry: {paymentMethod.expMonth}/
                                 {paymentMethod.expYear}
                              </Text>
                              <Text as="p">Last 4: {paymentMethod.last4}</Text>
                           </div>
                        ) : (
                           <Styles.Filler
                              height="100px"
                              message="Please select a payment method"
                              illustration={<EmptyIllo width="120px" />}
                           />
                        )}
                     </Flex>
                  )}
               </Styles.Card>
               <Spacer size="8px" />
            </section>
         </main>
         <footer>
            <TextButton type="solid">CHECKOUT</TextButton>
         </footer>
      </Styles.Aside>
   )
}

const Header = ({ title = '', onEdit = null }) => {
   return (
      <Flex
         container
         as="header"
         height="36px"
         padding="0 8px"
         alignItems="center"
         justifyContent="space-between"
      >
         <Text as="text2">{title}</Text>
         {onEdit && (
            <IconButton type="ghost" size="sm" onClick={onEdit}>
               <Icon.EditIcon size="12px" />
            </IconButton>
         )}
      </Flex>
   )
}

const Styles = {
   Aside: styled.aside`
      display: flex;
      grid-area: aside;
      background: #f9f9f9;
      flex-direction: column;
      border-left: 1px solid #e3e3e3;
      > main {
         padding: 8px;
         display: flex;
         overflow-y: auto;
         height: calc(100% - 40px);
         > section {
            flex: 1;
         }
      }
      > footer {
         button {
            width: 100%;
            height: 40px;
         }
      }
   `,
   Card: styled.div`
      border-radius: 2px;
      background: #ffffff;
      box-shadow: 0 2px 40px 2px rgb(222 218 218);
      > header {
         button {
            width: 28px;
            height: 28px;
         }
      }
   `,
   Filler: styled(Filler)`
      p {
         font-size: 14px;
         text-align: center;
      }
   `,
}
