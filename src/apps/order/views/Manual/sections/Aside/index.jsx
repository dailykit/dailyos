import React from 'react'
import styled from 'styled-components'
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
import EmptyIllo from '../../../../assets/svgs/Empty'
import * as Icon from '../../../../../../shared/assets/icons'

export const Aside = () => {
   const { brand, tunnels, address, customer, paymentMethod } = useManual()
   return (
      <Styles.Aside>
         <main>
            <section></section>
            <section>
               <Styles.Card>
                  <Header title="Store" onEdit={() => tunnels.brand[1](1)} />
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
                  <Header
                     title="Customer"
                     onEdit={() => tunnels.customer[1](1)}
                  />
                  <Flex as="main" padding="0 8px 8px 8px">
                     {customer?.id ? (
                        <>
                           <Flex container alignItems="center">
                              <Avatar
                                 title={
                                    customer?.customer?.platform_customer
                                       ?.fullName || ''
                                 }
                              />
                              <Spacer size="22px" xAxis />
                              <Flex>
                                 <Text as="p">{customer?.customer?.email}</Text>
                                 <Text as="p">
                                    {
                                       customer?.customer?.platform_customer
                                          ?.phoneNumber
                                    }
                                 </Text>
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
               </Styles.Card>
               <Spacer size="8px" />
               <Styles.Card>
                  <Header title="Fulfillment" />
                  <Flex as="main" padding="0 8px 8px 8px">
                     {address?.id ? (
                        <>{address.id}</>
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
                  <Header title="Payment Details" />
                  <Flex as="main" padding="0 8px 8px 8px">
                     {paymentMethod?.id ? (
                        <>{paymentMethod.id}</>
                     ) : (
                        <Styles.Filler
                           height="100px"
                           message="Please select a payment method"
                           illustration={<EmptyIllo width="120px" />}
                        />
                     )}
                  </Flex>
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

const Header = ({ title = '', onEdit = () => {} }) => {
   return (
      <Flex
         container
         as="header"
         height="40px"
         padding="0 8px"
         alignItems="center"
         justifyContent="space-between"
      >
         <Text as="text2">{title}</Text>
         <IconButton type="ghost" size="sm" onClick={onEdit}>
            <Icon.EditIcon size="14px" />
         </IconButton>
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
   `,
   Filler: styled(Filler)`
      p {
         font-size: 14px;
         text-align: center;
      }
   `,
}
