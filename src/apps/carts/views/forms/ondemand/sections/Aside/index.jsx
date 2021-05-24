import React from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { useMutation } from '@apollo/react-hooks'
import {
   Text,
   Flex,
   Spacer,
   Filler,
   Tunnel,
   Tunnels,
   useTunnel,
   IconButton,
   TextButton,
   OptionTile,
   TunnelHeader,
} from '@dailykit/ui'

import CartInfo from './CartInfo'
import { useManual } from '../../state'
import CartProducts from './CartProducts'
import { PaymentTunnel } from '../../tunnels'
import { MUTATIONS } from '../../../../../graphql'
import { logger } from '../../../../../../../shared/utils'
import EmptyIllo from '../../../../../assets/svgs/EmptyIllo'
import * as Icon from '../../../../../../../shared/assets/icons'

export const Aside = () => {
   const params = useParams()
   const { customer } = useManual()
   const [card, setCard] = React.useState()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [update] = useMutation(MUTATIONS.CART.UPDATE, {
      onCompleted: () => {
         closeTunnel(1)
         toast.success('Successfully initialized payment process.')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to initiate payment process.')
      },
   })

   const handlePayment = () => {
      if (!params?.id) return
      update({
         variables: {
            id: params.id,
            _set: { paymentMethodId: card?.id },
            _inc: { paymentRetryAttempt: 1 },
         },
      })
   }

   return (
      <Styles.Aside>
         <main>
            <CartProducts />
            <Spacer size="8px" xAxis />
            <CartInfo />
         </main>
         <footer>
            <TextButton type="solid" onClick={() => openTunnel(1)}>
               CHECKOUT
            </TextButton>
         </footer>
         <Tunnels tunnels={tunnels}>
            <Tunnel size="md">
               <TunnelHeader title="Payment" close={() => closeTunnel(1)} />
               <Flex
                  padding="16px"
                  overflowY="auto"
                  height="calc(100vh - 196px)"
               >
                  <OptionTile
                     title="Via Stripe"
                     onClick={() => openTunnel(2)}
                  />
               </Flex>
            </Tunnel>
            <Tunnel size="full">
               <TunnelHeader title="Payment" close={() => closeTunnel(2)} />
               <Flex
                  padding="16px"
                  overflowY="auto"
                  height="calc(100vh - 196px)"
               >
                  <Styles.Card>
                     <Header
                        title="Payment Details"
                        onEdit={() => {
                           if (!customer?.id) {
                              return toast.warning(
                                 'Please select a customer first.'
                              )
                           }
                           openTunnel(3)
                        }}
                     />
                     <Flex as="main" padding="0 8px 8px 8px">
                        {card?.id && card?.last4 ? (
                           <div>
                              <Text as="p">Name: {card?.name}</Text>
                              <Text as="p">
                                 Expiry: {card?.expMonth}/{card?.expYear}
                              </Text>
                              <Text as="p">Last 4: {card?.last4}</Text>
                           </div>
                        ) : (
                           <Styles.Filler
                              height="100px"
                              message="Please select a payment method"
                              illustration={<EmptyIllo width="120px" />}
                           />
                        )}
                     </Flex>
                  </Styles.Card>
                  <Spacer size="16px" />
                  <TextButton type="solid" size="sm" onClick={handlePayment}>
                     Pay
                  </TextButton>
               </Flex>
            </Tunnel>
            <Tunnel size="sm">
               <PaymentTunnel closeTunnel={closeTunnel} setCard={setCard} />
            </Tunnel>
         </Tunnels>
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
