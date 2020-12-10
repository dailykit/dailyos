import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Spacer } from '@dailykit/ui'

import {
   PhoneIcon,
   EmailIcon,
   HomeIcon,
   ArrowUpIcon,
   ArrowDownIcon,
} from '../../../assets/icons'
import { Styles, StyledStat } from './styled'
import { currencyFmt } from '../../../../../shared/utils'

const address = 'apps.order.components.orderlistitem.'

const normalize = address => {
   return `${address.line1}, ${address.line2 ? `${address.line2}, ` : ''} ${
      address.city
   }, ${address.state}, ${address.zipcode}`
}

export const Details = ({ order }) => {
   const { t } = useTranslation()
   const [currentPanel, setCurrentPanel] = React.useState('customer')
   return (
      <section>
         <Styles.Accordian isOpen={currentPanel === 'customer'}>
            <header>
               <Text as="p">
                  {order.customer?.customerFirstName}&nbsp;
                  {order.customer?.customerLastName}
               </Text>
               <ToggleButton
                  type="customer"
                  current={currentPanel}
                  toggle={setCurrentPanel}
               />
            </header>
            <main>
               <Flex container alignItems="center">
                  <span>
                     <PhoneIcon size={14} color="#718096" />
                  </span>
                  <Spacer size="4px" xAxis />
                  <Text as="subtitle">{order.customer?.customerPhone}</Text>
               </Flex>
               <Spacer size="8px" />
               <Flex container alignItems="center">
                  <span>
                     <EmailIcon size={14} color="#718096" />
                  </span>
                  <Spacer size="4px" xAxis />
                  <Text as="subtitle">
                     <a
                        target="__blank"
                        rel="noopener roreferrer"
                        href={`mailto:${order.customer?.customerEmail}`}
                     >
                        {order.customer?.customerEmail}
                     </a>
                  </Text>
               </Flex>
               {order?.customer?.customerAddress && (
                  <>
                     <Spacer size="8px" />
                     <Flex container>
                        <span>
                           <HomeIcon size={14} color="#718096" />
                        </span>
                        <Spacer size="4px" xAxis />
                        <Text as="subtitle">
                           {normalize(order?.customer?.customerAddress)}
                        </Text>
                     </Flex>
                  </>
               )}
               <Spacer size="8px" />
            </main>
         </Styles.Accordian>
         <Styles.Accordian isOpen={currentPanel === 'billing'}>
            <header>
               <Text as="p">
                  Amount Paid: {currencyFmt(Number(order.amountPaid) || 0)}
               </Text>
               <ToggleButton
                  type="billing"
                  current={currentPanel}
                  toggle={setCurrentPanel}
               />
            </header>
            <main>
               <StyledStat>
                  <span>{t(address.concat('tax'))}</span>
                  <span>{currencyFmt(Number(order.tax) || 0)}</span>
               </StyledStat>
               <StyledStat>
                  <span>{t(address.concat('discount'))}</span>
                  <span>{order.discount}</span>
               </StyledStat>
               <StyledStat>
                  <span>{t(address.concat('delivery price'))}</span>
                  <span>{currencyFmt(Number(order.deliveryPrice) || 0)}</span>
               </StyledStat>
               <StyledStat>
                  <span>{t(address.concat('total'))}</span>
                  <span>{currencyFmt(Number(order.amountPaid) || 0)}</span>
               </StyledStat>
            </main>
         </Styles.Accordian>
      </section>
   )
}

const ToggleButton = ({ type, current, toggle }) => {
   return (
      <button
         type="button"
         onClick={() => toggle(current === type ? '' : type)}
      >
         {current === type ? <ArrowDownIcon /> : <ArrowUpIcon />}
      </button>
   )
}
