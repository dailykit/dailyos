import React from 'react'
import { TunnelHeader, Input } from '@dailykit/ui'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { TunnelBody } from '../styled'
import { useScript } from '../../../../../../../../shared/utils/useScript'
import { Container, Grid } from '../../../styled'
import { UPDATE_STORE_SETTING } from '../../../../../../graphql'

const AddressTunnel = ({ closeTunnel, address }) => {
   const [loaded, error] = useScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}&libraries=places`
   )

   const [busy, setBusy] = React.useState(false)
   const [populated, setPopulated] = React.useState(address)

   // Mutation
   const [updateSetting] = useMutation(UPDATE_STORE_SETTING, {
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

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
         console.log(address)
         setPopulated(address)
      }
   }

   const save = () => {
      try {
         setBusy(true)
         updateSetting({
            variables: {
               type: 'brand',
               identifier: 'Address',
               value: populated,
            },
         })
      } catch (error) {
         console.log(error)
         setBusy(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Address"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {loaded && !error && (
               <GooglePlacesAutocomplete
                  onSelect={data => formatAddress(data)}
                  placeholder=""
                  renderInput={props => (
                     <Container bottom="32">
                        <Input
                           type="text"
                           label="Search on Google"
                           name="search"
                           {...props}
                        />
                     </Container>
                  )}
               />
            )}
            {Boolean(Object.keys(populated).length) && (
               <>
                  <Container bottom="16">
                     <Input
                        type="text"
                        label="Line 1"
                        name="line1"
                        value={populated.line1}
                        onChange={e =>
                           setPopulated({ ...populated, line1: e.target.value })
                        }
                     />
                  </Container>
                  <Container bottom="16">
                     <Input
                        type="text"
                        label="Line 2"
                        name="line2"
                        value={populated.line2}
                        onChange={e =>
                           setPopulated({ ...populated, line2: e.target.value })
                        }
                     />
                  </Container>
                  <Container bottom="16">
                     <Grid>
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
                     </Grid>
                  </Container>
                  <Container bottom="16">
                     <Grid>
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
                     </Grid>
                  </Container>
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default AddressTunnel
