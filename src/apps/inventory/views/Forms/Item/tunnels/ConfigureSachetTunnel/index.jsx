import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { Input, Loader, Text } from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { ItemContext } from '../../../../../context/item'
import { CREATE_SACHET_ITEM } from '../../../../../graphql'
import { FlexContainer } from '../../../styled'
import handleNumberInputErrors from '../../../utils/handleNumberInputErrors'

const address = 'apps.inventory.views.forms.item.tunnels.configuresachettunnel.'

export default function ConfigureSachetTunnel({ close, formState }) {
   const { t } = useTranslation()
   const { state } = useContext(ItemContext)
   const [errors, setErrors] = useState([])

   const [quantity, setQuantity] = useState('')
   const [par, setPar] = useState('')
   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')

   const [creatSachetItem, { loading }] = useMutation(CREATE_SACHET_ITEM, {
      onCompleted: () => {
         close(9)
         toast.info('Sachet added!')
      },
      onError: error => {
         close(9)
         console.log(error)
         toast.error('Err! creating sachets. Please try again')
      },
   })

   const active = formState.bulkItems.find(
      item => item.id === state.activeProcessing.id
   )

   const handleNext = () => {
      if (!active) return toast.error('Error, Please try again.')
      if (errors.length) {
         errors.forEach(err => toast.error(err.message))
         toast.error(`Cannot add sachets !`)
      } else {
         creatSachetItem({
            variables: {
               unitSize: quantity,
               bulkItemId: active.id,
               unit: active.unit,
               par,
               maxLevel: maxInventoryLevel,
            },
         })
      }
   }

   if (loading) return <Loader />

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('add sachet'))}
            next={handleNext}
            close={() => close(9)}
            nextAction="Save"
         />

         <Spacer />

         <br />

         <div style={{ width: '45%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '70%' }}>
               <Input
                  type="number"
                  name="quantity"
                  value={quantity}
                  label="Sachet Quantity"
                  onChange={e => setQuantity(e.target.value)}
                  onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
               />
            </div>
            <span style={{ width: '10px' }} />
            <Text as="subtitle">in {active.unit}</Text>
         </div>

         <br />

         <FlexContainer
            style={{
               justifyContent: 'space-between',
            }}
         >
            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="number"
                  name="par"
                  value={par}
                  label={t(address.concat('set par level'))}
                  onChange={e => setPar(e.target.value)}
                  onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
               />
               <span style={{ marginLeft: '5px' }}>
                  {t(address.concat('pkt'))}
               </span>
            </FlexContainer>

            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="number"
                  name="inventory level"
                  value={maxInventoryLevel}
                  label={t(address.concat('max inventory level'))}
                  onChange={e => setMaxInventoryLevel(e.target.value)}
                  onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
               />
               <span style={{ marginLeft: '5px' }}>
                  {t(address.concat('pkt'))}
               </span>
            </FlexContainer>
         </FlexContainer>
      </TunnelContainer>
   )
}
