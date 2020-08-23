import { ButtonTile, IconButton, Input, Text } from '@dailykit/ui/'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'

import {
   UPDATE_SACHET_WORK_ORDER,
   INCREMENT_SACHET_WORK_ORDER,
} from '../../../graphql'

import AddIcon from '../../../../../shared/assets/icons/Add'
import { ItemCard, Spacer } from '../../../components'
import { FlexContainer } from '../styled'

const address = 'apps.inventory.views.forms.sachetworkorder.'

export default function Configurator({
   openPackagingTunnel,
   openLabelTemplateTunnel,
   openUserTunnel,
   openStationTunnel,
   state,
}) {
   const { t } = useTranslation()

   const [updateSachetWorkOrder] = useMutation(UPDATE_SACHET_WORK_ORDER, {
      onCompleted: () => {
         toast.info('Work Order updated successfully!')
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const [quantity, setQuantity] = useState(state.outputQuantity || 0)

   const [changeQuantity] = useMutation(INCREMENT_SACHET_WORK_ORDER, {
      onCompleted: resp => {
         const { outputQuantity } = resp.updateSachetWorkOrder.returning[0]
         toast.info('Work Order updated successfully!')
         setQuantity(outputQuantity)
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const [assignedDate, setAssignedDate] = useState(state.scheduleOn || '')

   const incrementOutputQuantity = () => {
      changeQuantity({
         variables: {
            id: state.id,
            inc: {
               outputQuantity: +1,
            },
         },
      })
   }

   const decrementOutputQuantity = () => {
      if (quantity === 1) return toast.error('quantity cannot be negative')
      changeQuantity({
         variables: {
            id: state.id,
            inc: {
               outputQuantity: -1,
            },
         },
      })
   }

   const inputQuantity = state.outputQuantity * +state.outputSachetItem.unitSize

   return (
      <>
         <Spacer />

         <Text as="title">{t(address.concat('enter number of sachtes'))}</Text>
         <br />
         <FlexContainer
            style={{ width: '50%', justifyContent: 'space-between' }}
         >
            <FlexContainer style={{ width: '35%', alignItems: 'center' }}>
               <IconButton
                  disabled={quantity === 1}
                  onClick={decrementOutputQuantity}
                  type="ghost"
               >
                  <span style={{ color: '#00a7e1', fontWeight: '600' }}>-</span>
               </IconButton>
               <span style={{ width: '10px' }} />
               <Input
                  type="number"
                  value={quantity}
                  name="quantity"
                  onChange={e => {
                     setQuantity(e.target.value)
                  }}
                  onBlur={e => {
                     updateSachetWorkOrder({
                        variables: {
                           id: state.id,
                           set: {
                              outputQuantity: +e.target.value,
                           },
                        },
                     })
                  }}
               />
               <span style={{ width: '10px' }} />

               <IconButton onClick={incrementOutputQuantity} type="ghost">
                  <AddIcon color="#00a7e1" />
               </IconButton>
            </FlexContainer>

            <div>
               {state.outputQuantity ? (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('suggested committed quantity'))}
                     </Text>
                     <Text as="title">{inputQuantity}</Text>
                  </>
               ) : null}
            </div>
         </FlexContainer>

         <br />

         <Text as="title">{t(address.concat('packaging'))}</Text>

         <>
            {state.packaging?.name ? (
               <ItemCard
                  title={state.packaging.name}
                  edit={() => openPackagingTunnel(1)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select packaging'))}
                  onClick={() => openPackagingTunnel(1)}
               />
            )}
         </>

         <br />

         {state.packaging?.name && (
            <>
               <Text as="title">{t(address.concat('label template'))}</Text>
               <>
                  {state.label &&
                  Array.isArray(state.label) &&
                  state.label[0].title ? (
                     <ItemCard
                        title={state.label.map(temp => temp.title).join(', ')}
                        edit={() => openLabelTemplateTunnel(1)}
                     />
                  ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text={t(address.concat('select label template'))}
                        onClick={() => openLabelTemplateTunnel(1)}
                     />
                  )}
               </>
            </>
         )}

         <br />

         <Text as="title">{t(address.concat('user assigned'))}</Text>

         <>
            {state.user?.firstName ? (
               <ItemCard
                  title={`${state.user.firstName} ${state.user.lastName || ''}`}
                  edit={() => openUserTunnel(1)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select and assign user to work'))}
                  onClick={() => openUserTunnel(1)}
               />
            )}
         </>

         <br />
         <br />

         <Text as="title">{t(address.concat('scheduled on'))}</Text>
         <br />

         <Input
            style={{
               border: 0,
               borderBottom: '1px solid rgba(0,0,0,0.2)',
               color: '#555b6e',
               padding: '5px',
            }}
            value={assignedDate}
            onChange={e => {
               setAssignedDate(e.target.value)
            }}
            type="datetime-local"
            placeholder={t(address.concat('date (mm/dd/yyyy)'))}
            onBlur={e => {
               updateSachetWorkOrder({
                  variables: {
                     id: state.id,
                     set: {
                        scheduledOn: e.target.value,
                     },
                  },
               })
            }}
         />

         <br />

         <>
            <Text as="title">{t(address.concat('station assigned'))}</Text>

            {state.station?.name ? (
               <ItemCard
                  title={state.station.name}
                  edit={() => openStationTunnel(1)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(
                     address.concat('select and assign station to route to')
                  )}
                  onClick={() => openStationTunnel(1)}
               />
            )}
         </>
         <br />
      </>
   )
}
