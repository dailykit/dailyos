import React from 'react'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { IconButton, CloseIcon } from '@dailykit/ui'

import { UserIcon } from '../../../assets/icons'
import { CREATE_PRINT_JOB } from '../../../graphql'
import { useOrder, useConfig } from '../../../context'
import { Flex } from '../../../../../shared/components'
import { StyledButton, StyledLabelPreview } from './styled'
import {
   OrderItem,
   OrderItems,
   StyledServings,
   StyledProductTitle,
} from '../styled'

const address = 'apps.order.views.order.'

export const ReadyToEats = ({ readytoeats }) => {
   const { state } = useConfig()
   const { t } = useTranslation()
   const [label, setLabel] = React.useState('')
   const { switchView, selectReadyToEat } = useOrder()
   const [current, setCurrent] = React.useState(null)

   const [printLabel] = useMutation(CREATE_PRINT_JOB, {
      onCompleted: () => {
         const product = readytoeats.find(node => node.id === current)
         toast.success(
            `Label for ${product?.simpleRecipeProduct?.name} has been printed!`
         )
      },
      onError: () => {
         const product = readytoeats.find(node => node.id === current)
         toast.error(
            `Printing label for ${product?.simpleRecipeProduct?.name} failed!`
         )
      },
   })

   const selectProduct = id => {
      setCurrent(id)
      setLabel('')
      const product = readytoeats.find(node => id === node.id)
      if ('id' in product) {
         selectReadyToEat(product.id)
      } else {
         switchView('SUMMARY')
      }
   }

   const print = () => {
      if (_.isEmpty(state.stations)) {
         toast.error('No printers available')
         return
      }
      const url = `${process.env.REACT_APP_TEMPLATE_URL}?template={"name":"readytoeat_product1","type":"label","format":"html"}&data={"id":${current}}`

      if (state.print.print_simulation.value.isActive) {
         setLabel(url)
      } else {
         const product = readytoeats.find(node => node.id === current)
         printLabel({
            variables: {
               url,
               source: 'DailyOS',
               contentType: 'pdf_uri',
               title: `${product?.simpleRecipeProduct?.name}`,
               printerId: state.stations[0].defaultLabelPrinter.printNodeId,
            },
         })
      }
   }

   React.useEffect(() => {
      if (readytoeats.length > 0) {
         const [product] = readytoeats
         setCurrent(product.id)
      }
   }, [readytoeats])

   if (readytoeats.length === 0) return <div>No ready to eat products!</div>
   return (
      <>
         <OrderItems>
            {readytoeats.map(readytoeat => (
               <OrderItem
                  key={readytoeat.id}
                  onClick={() => selectProduct(readytoeat.id)}
                  isActive={current === readytoeat.id}
               >
                  <div>
                     <StyledProductTitle>
                        {readytoeat?.simpleRecipeProduct?.name}
                        {readytoeat?.comboProduct?.name}
                        &nbsp;
                        {readytoeat?.comboProductComponent?.label &&
                           `(${readytoeat?.comboProductComponent?.label})`}
                     </StyledProductTitle>
                  </div>
                  <section>
                     <span>
                        {readytoeat.isAssembled ? 1 : 0} /{' '}
                        {readytoeat.assemblyStatus === 'COMPLETED' ? 1 : 0} / 1
                     </span>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {
                              readytoeat?.simpleRecipeProductOption
                                 ?.simpleRecipeYield?.yield?.serving
                           }
                           &nbsp; {t(address.concat('servings'))}
                        </span>
                     </StyledServings>
                  </section>
               </OrderItem>
            ))}
         </OrderItems>
         <Flex>
            <StyledButton type="button" onClick={() => print()}>
               Print label
            </StyledButton>
            {label && (
               <StyledLabelPreview>
                  <header>
                     <h3>Label Preview</h3>
                     <IconButton type="ghost" onClick={() => setLabel('')}>
                        <CloseIcon />
                     </IconButton>
                  </header>
                  <div>
                     <iframe
                        src={label}
                        frameborder="0"
                        title="label preview"
                     />
                  </div>
               </StyledLabelPreview>
            )}
         </Flex>
      </>
   )
}
