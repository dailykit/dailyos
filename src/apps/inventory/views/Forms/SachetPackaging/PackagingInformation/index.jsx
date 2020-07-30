import { IconButton, Text, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import React from 'react'
import styled from 'styled-components'
import { useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import EditIcon from '../../../../../recipe/assets/icons/Edit'
import { FlexContainer, Flexible, ShadowCard } from '../../styled'
import AdditionalInfo from '../AdditionalInfo'
import { Spacer } from '../../../../components'

import { OtherProperties } from '../Tunnels'
import { PACKAGING_SPECS_SUBSCRIPTION } from '../../../../graphql'

import renderIcon from './renderIcon'

// Props<{state: Packaging}>
export default function PackagingInformation({ state }) {
   const [
      otherPropertiesTunnel,
      openOtherPropertiesTunnel,
      closeOtherPropertiesTunnel,
   ] = useTunnel(1)

   const {
      data: { packaging: { packagingSpecification: spec = {} } = {} } = {},
   } = useSubscription(PACKAGING_SPECS_SUBSCRIPTION, {
      variables: { id: state.id },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   // TODO: one section "other properties" to show all the other iconed props
   // TODO: have one tunnel for all the othe properties

   return (
      <>
         <Tunnels tunnels={otherPropertiesTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <OtherProperties
                  state={spec}
                  close={closeOtherPropertiesTunnel}
               />
            </Tunnel>
         </Tunnels>

         <FlexContainer style={{ padding: '0 30px', margin: '0 20px' }}>
            <Flexible width="2">
               <AdditionalInfo id={state.id} />
            </Flexible>
            <span style={{ width: '20px' }} />
            <Flexible width="3">
               <ShadowCard style={{ flexDirection: 'column' }}>
                  {/* <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Packaging type</Text>
                        {state.packagingType && (
                           <IconButton
                              type="ghost"
                              onClick={() => openPackagingTypeTunnel(1)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                        )}
                     </FlexContainer>
                     <br />
                     {state.packagingType ? (
                        <div
                           style={{
                              width: '70%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '10px 0',
                           }}
                        >
                           <div
                              style={{
                                 padding: '10px 80px',
                                 backgroundColor: '#ededed',
                                 borderRadius: '4px',
                              }}
                           >
                              {state.packagingType}
                           </div>
                        </div>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Packaging Material"
                           onClick={() => openPackagingTypeTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div> */}

                  {/* <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Sealing type</Text>
                        {state.sealingType && (
                           <IconButton
                              type="ghost"
                              onClick={() => openSealingTypeTunnel(1)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                        )}
                     </FlexContainer>
                     <br />
                     {state.sealingType ? (
                        <div
                           style={{
                              width: '70%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '10px 0',
                           }}
                        >
                           <div
                              style={{
                                 padding: '10px 80px',
                                 backgroundColor: '#ededed',
                                 borderRadius: '5px',
                              }}
                           >
                              {state.sealingType}
                           </div>
                        </div>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Sealing type"
                           onClick={() => openSealingTypeTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div> */}

                  <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Other Properties</Text>
                        <IconButton
                           type="ghost"
                           onClick={() => openOtherPropertiesTunnel(1)}
                        >
                           <EditIcon color="#555B6E" />
                        </IconButton>
                     </FlexContainer>

                     <Spacer />

                     <Content>
                        <Stats>
                           {renderIcon(spec.recycled)}
                           <h4>Recyled</h4>
                        </Stats>
                        <Stats>
                           {renderIcon(spec.compressibility)}
                           <h4>Compressable</h4>
                        </Stats>
                     </Content>

                     <Content>
                        <div>
                           <h4>
                              Opacity:{' '}
                              <b>{spec.opacity ? spec.opacity : 'N/A'}</b>
                           </h4>
                        </div>
                     </Content>
                  </div>
               </ShadowCard>
            </Flexible>
         </FlexContainer>
      </>
   )
}

const Stats = styled(FlexContainer)`
   align-items: center;
`

const Content = styled(FlexContainer)`
   width: 70%;
   justify-content: space-between;
   align-items: center;

   margin-bottom: 1rem;

   h4 {
      font-weight: 500;
      font-size: 14px;
      color: #555b6e;
   }
`
