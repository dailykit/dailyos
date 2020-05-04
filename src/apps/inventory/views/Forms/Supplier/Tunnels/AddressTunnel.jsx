import React, { useState, useContext } from 'react'
import { Input, Checkbox } from '@dailykit/ui'

import { SupplierContext } from '../../../../context/supplier'

import MapView from '../../../../assets/images/mapView.png'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'
import { FlexContainer } from '../../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.supplier.tunnels.'

export default function AddressTunnel({ close }) {
   const { t } = useTranslation()
   const {
      supplierState: {
         address: {
            address1: oldAddress1,
            address2: oldAddress2,
            city: oldCity,
            zip: oldZip,
            instructions: oldInstructions,
            location: oldLocation,
            isManual: oldIsManual,
         },
      },
      supplierDispatch,
   } = useContext(SupplierContext)

   const [isManual, setIsManual] = useState(Boolean(oldIsManual))
   const [location, setLocation] = useState(oldLocation || '')
   const [address1, setAddress1] = useState(oldAddress1 || '')
   const [address2, setAddress2] = useState(oldAddress2 || '')
   const [city, setCity] = useState(oldCity || '')
   const [zip, setZip] = useState(oldZip || '')
   const [instructions, setInstructions] = useState(oldInstructions || '')

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("add address"))}
            next={() => {
               supplierDispatch({
                  type: 'ADD_ADDRESS',
                  payload: {
                     isManual,
                     location,
                     address1,
                     address2,
                     city,
                     zip,
                     instructions,
                  },
               })
               close(1)
            }}
            close={() => close(1)}
            nextAction="Save"
         />

         <Spacer />

         <FlexContainer
            style={{ width: '100%', justifyContent: 'space-between' }}
         >
            <div>
               <Input
                  disabled={isManual}
                  placeholder={t(address.concat("shipping location"))}
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
                        placeholder={t(address.concat("address line 1"))}
                        type="text"
                        name="address1"
                        value={address1}
                        onChange={e => {
                           setAddress1(e.target.value)
                        }}
                     />{' '}
                     <br />
                     <Input
                        placeholder={t(address.concat("address line 2"))}
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
                           placeholder={t(address.concat("city"))}
                           type="text"
                           name="city"
                           value={city}
                           onChange={e => setCity(e.target.value)}
                        />
                        <div style={{ width: '10px' }} />
                        <Input
                           placeholder={t(address.concat("zip code"))}
                           type="text"
                           name="zip"
                           value={zip}
                           onChange={e => setZip(e.target.value)}
                        />
                     </FlexContainer>
                     <br />
                     <Input
                        placeholder={t(address.concat("special instructions"))}
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
   )
}
