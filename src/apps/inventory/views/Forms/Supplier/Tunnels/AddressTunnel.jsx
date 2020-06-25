import { Checkbox, Input, Loader, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import MapView from '../../../../assets/images/mapView.png'
import { TunnelContainer } from '../../../../components'
import { FlexContainer } from '../../styled'
import { UPDATE_SUPPLIER } from '../../../../graphql'

const address = 'apps.inventory.views.forms.supplier.tunnels.'

export default function AddressTunnel({ close, formState }) {
   const { t } = useTranslation()

   const [isManual, setIsManual] = useState(
      Boolean(formState.address?.isManual)
   )
   const [location, setLocation] = useState(
      (!isManual && formState.address?.location) || ''
   )
   const [address1, setAddress1] = useState(
      (isManual && formState.address?.address1) || ''
   )
   const [address2, setAddress2] = useState(
      (isManual && formState.address?.address2) || ''
   )
   const [city, setCity] = useState((isManual && formState.address?.city) || '')
   const [zip, setZip] = useState((isManual && formState.address?.zip) || '')
   const [instructions, setInstructions] = useState(
      (isManual && formState.address?.instructions) || ''
   )

   const [updateSupplier, { loading }] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info('Address information added!')
         close(1)
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(1)
      },
   })

   const handleNext = () => {
      if (isManual && (!address1 || !city))
         return toast.error('Fill the form properly')

      let pushableAddress = null

      if (isManual) {
         pushableAddress = {
            isManual,
            address1,
            address2,
            city,
            zip,
            instructions,
         }
      } else {
         pushableAddress = {
            isManual,
            location,
         }
      }

      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               address: pushableAddress,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add address'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />

         <TunnelContainer>
            <FlexContainer
               style={{ width: '100%', justifyContent: 'space-between' }}
            >
               <div>
                  <Input
                     disabled={isManual}
                     placeholder={t(address.concat('shipping location'))}
                     type="text"
                     name="location"
                     value={location}
                     onChange={e => {
                        setLocation(e.target.value)
                     }}
                  />
                  <div style={{ height: '10px' }} />
                  <Checkbox
                     id="label"
                     checked={isManual}
                     onChange={() => setIsManual(!isManual)}
                  >
                     {t(address.concat('enter manually'))}
                  </Checkbox>

                  {isManual && (
                     <>
                        <br />
                        <Input
                           placeholder={t(address.concat('address line 1'))}
                           type="text"
                           name="address1"
                           value={address1}
                           onChange={e => {
                              setAddress1(e.target.value)
                           }}
                        />{' '}
                        <br />
                        <Input
                           placeholder={t(address.concat('address line 2'))}
                           type="text"
                           name="address2"
                           value={address2}
                           onChange={e => {
                              setAddress2(e.target.value)
                           }}
                        />
                        <br />
                        <FlexContainer>
                           <Input
                              placeholder={t(address.concat('city'))}
                              type="text"
                              name="city"
                              value={city}
                              onChange={e => setCity(e.target.value)}
                           />
                           <div style={{ width: '10px' }} />
                           <Input
                              placeholder={t(address.concat('zip code'))}
                              type="number"
                              name="zip"
                              value={zip}
                              onChange={e => setZip(e.target.value)}
                           />
                        </FlexContainer>
                        <br />
                        <Input
                           placeholder={t(
                              address.concat('special instructions')
                           )}
                           type="text"
                           name="instructions"
                           value={instructions}
                           onChange={e => setInstructions(e.target.value)}
                        />{' '}
                     </>
                  )}
               </div>

               <div style={{ marginLeft: '20px' }}>
                  <img src={MapView} alt="map" />
               </div>
            </FlexContainer>
         </TunnelContainer>
      </>
   )
}
