import React from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import { Spacer, Input, TunnelHeader } from '@dailykit/ui'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

import { Flex } from '../../../../../../shared/components'
import { useScript } from '../../../../../../shared/utils/useScript'

export const AddressTunnel = ({ address, update, settingId, closeTunnel }) => {
   const [populated, setPopulated] = React.useState(address)
   const [loaded, error] = useScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}&libraries=places`
   )

   const updateSetting = () => {
      update({ id: settingId, value: populated })
      closeTunnel(1)
   }

   const formatAddress = async address => {
      const response = await fetch(
         `https://maps.googleapis.com/maps/api/geocode/json?key=${
            process.env.REACT_APP_MAPS_API_KEY
         }&address=${encodeURIComponent(address.description)}`
      )
      const data = await response.json()
      if (data.status === 'OK' && data.results.length > 0) {
         const [result] = data.results

         const address = {
            line2: '',
            lat: result.geometry.location.lat.toString(),
            lng: result.geometry.location.lng.toString(),
         }

         result.address_components.forEach(node => {
            if (node.types.includes('street_number')) {
               address.line1 = `${node.long_name} `
            }
            if (node.types.includes('route')) {
               address.line1 += node.long_name
            }
            if (node.types.includes('locality')) {
               address.city = node.long_name
            }
            if (node.types.includes('administrative_area_level_1')) {
               address.state = node.long_name
            }
            if (node.types.includes('country')) {
               address.country = node.long_name
            }
            if (node.types.includes('postal_code')) {
               address.zipcode = node.long_name
            }
         })
         setPopulated(address)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Address"
            right={{ action: updateSetting, title: 'Save' }}
            close={() => closeTunnel(1)}
         />
         <Flex padding="16px">
            <GPlaces>
               {loaded && !error && (
                  <GooglePlacesAutocomplete
                     placeholder=""
                     onSelect={data => formatAddress(data)}
                     renderInput={props => (
                        <Flex>
                           <Input
                              type="text"
                              label="Search on Google"
                              name="search"
                              {...props}
                           />
                        </Flex>
                     )}
                  />
               )}
            </GPlaces>
            {!isEmpty(populated) && (
               <>
                  <Flex margin="24px 0">
                     <Input
                        type="text"
                        label="Line 1"
                        name="line1"
                        value={populated.line1}
                        onChange={e =>
                           setPopulated({ ...populated, line1: e.target.value })
                        }
                     />
                     <Spacer size="24px" />
                     <Input
                        type="text"
                        label="Line 2"
                        name="line2"
                        value={populated.line2}
                        onChange={e =>
                           setPopulated({ ...populated, line2: e.target.value })
                        }
                     />
                  </Flex>
                  <Flex container alignItems="center" margin="0 0 24px 0">
                     <Input
                        type="text"
                        label="City"
                        name="city"
                        value={populated.city}
                        onChange={e =>
                           setPopulated({
                              ...populated,
                              city: e.target.value,
                           })
                        }
                     />
                     <Spacer size="16px" xAxis />
                     <Input
                        type="text"
                        label="State"
                        name="state"
                        value={populated.state}
                        onChange={e =>
                           setPopulated({
                              ...populated,
                              state: e.target.value,
                           })
                        }
                     />
                  </Flex>
                  <Flex container alignItems="center" margin="0 0 24px 0">
                     <Input
                        type="text"
                        label="Country"
                        name="country"
                        value={populated.country}
                        onChange={e =>
                           setPopulated({
                              ...populated,
                              country: e.target.value,
                           })
                        }
                     />
                     <Spacer size="16px" xAxis />
                     <Input
                        type="text"
                        label="ZIP"
                        name="zipcode"
                        value={populated.zipcode}
                        onChange={e =>
                           setPopulated({
                              ...populated,
                              zipcode: e.target.value,
                           })
                        }
                     />
                  </Flex>
               </>
            )}
         </Flex>
      </>
   )
}

const GPlaces = styled.section`
   .google-places-autocomplete {
      width: 100%;
      position: relative;
   }
   .google-places-autocomplete__input {
   }
   .google-places-autocomplete__input:active,
   .google-places-autocomplete__input:focus,
   .google-places-autocomplete__input:hover {
      outline: 0;
      border: none;
   }
   .google-places-autocomplete__suggestions-container {
      background: #fff;
      border-radius: 0 0 5px 5px;
      color: #000;
      position: absolute;
      width: 100%;
      z-index: 2;
      box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.09);
   }
   .google-places-autocomplete__suggestion {
      font-size: 1rem;
      text-align: left;
      padding: 10px;
      :hover {
         background: rgba(0, 0, 0, 0.1);
      }
   }
   .google-places-autocomplete__suggestion--active {
      background: #e0e3e7;
   }
`
