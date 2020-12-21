import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Spacer } from '@dailykit/ui'

import {
   PhoneIcon,
   EmailIcon,
   HomeIcon,
   ArrowUpIcon,
   ArrowDownIcon,
   Notes,
} from '../../../assets/icons'
import { Styles, StyledStat } from './styled'
import { currencyFmt } from '../../../../../shared/utils'

const address = 'apps.order.components.orderlistitem.'

export const Details = ({ order }) => {
   const { t } = useTranslation()
   const [currentPanel, setCurrentPanel] = React.useState('customer')
   return (
      <aside>
         <Styles.Accordian isOpen={currentPanel === 'customer'}>
            <header>
               <Text as="p">
                  {order.customer?.customerFirstName || 'N/A'}&nbsp;
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
                  <Text as="subtitle">
                     {order.customer?.customerPhone || 'N/A'}
                  </Text>
               </Flex>
               <Spacer size="8px" />
               <Flex container alignItems="center">
                  <span>
                     <EmailIcon size={14} color="#718096" />
                  </span>
                  <Spacer size="4px" xAxis />
                  {order.customer?.customerEmail ? (
                     <Text as="subtitle">
                        <a
                           target="__blank"
                           rel="noopener roreferrer"
                           href={`mailto:${order.customer?.customerEmail}`}
                        >
                           {order.customer?.customerEmail}
                        </a>
                     </Text>
                  ) : (
                     <Text as="subtitle">N/A</Text>
                  )}
               </Flex>
               <Spacer size="8px" />
               <Flex container>
                  <span>
                     <HomeIcon size={14} color="#718096" />
                  </span>
                  <Spacer size="4px" xAxis />
                  <Text as="subtitle">
                     {normalize(order?.customer?.customerAddress) || 'N/A'}
                  </Text>
               </Flex>
               <Spacer size="8px" />
               <Flex container>
                  <span>
                     <Notes size={14} color="#718096" />
                  </span>
                  <Spacer size="4px" xAxis />
                  <Text as="subtitle">
                     {order?.customer?.customerAddress?.notes || 'N/A'}
                  </Text>
               </Flex>
               <Spacer size="8px" />
            </main>
         </Styles.Accordian>
         <Styles.Accordian isOpen={currentPanel === 'billing'}>
            <header>
               <Text as="p">
                  Amount: {currencyFmt(Number(order.amountPaid) || 0)}
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
      </aside>
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

const normalize = (address = {}) => {
   let result = ''
   if (address?.line1) {
      result += address.line1
   }
   if (address?.line2) {
      result += ', ' + address.line2
   }
   if (address?.landmark) {
      result += ', ' + address.landmark
   }
   if (address?.city) {
      result += ', ' + address.city
   }
   if (address?.state) {
      result += ', ' + address.state
   }
   if (address?.country) {
      result += ', ' + address.country
   }
   if (address?.zipcode) {
      result += ', ' + address.zipcode
   }
   return result
}