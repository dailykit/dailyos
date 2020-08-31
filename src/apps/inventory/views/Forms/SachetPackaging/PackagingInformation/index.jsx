import {
   IconButton,
   Text,
   Tunnels,
   Tunnel,
   useTunnel,
   ButtonTile,
} from '@dailykit/ui'
import React from 'react'
import styled from 'styled-components'
import { useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import EditIcon from '../../../../../recipe/assets/icons/Edit'
import { FlexContainer, Flexible, ShadowCard } from '../../styled'
import AdditionalInfo from '../AdditionalInfo'

import { OtherProperties, PackagingMaterial } from '../Tunnels'
import { PACKAGING_SPECS_SUBSCRIPTION } from '../../../../graphql'

import renderIcon from './renderIcon'

// Props<{state: Packaging}>
export default function PackagingInformation({ state }) {
   const [
      otherPropertiesTunnel,
      openOtherPropertiesTunnel,
      closeOtherPropertiesTunnel,
   ] = useTunnel(1)

   const [
      packagingMaterial,
      openPackagingMaterial,
      closePackagingMaterial,
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

         <Tunnels tunnels={packagingMaterial}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <PackagingMaterial state={spec} close={closePackagingMaterial} />
            </Tunnel>
         </Tunnels>

         <FlexContainer style={{ padding: '0 30px', margin: '0 20px' }}>
            <Flexible width="2">
               <AdditionalInfo id={state.id} />
            </Flexible>
            <span style={{ width: '20px' }} />
            <Flexible width="3">
               <ShadowCard style={{ flexDirection: 'column' }}>
                  <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Packaging Material</Text>
                        {spec.packagingMaterial ? (
                           <IconButton
                              type="ghost"
                              onClick={() => openPackagingMaterial(1)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                        ) : null}
                     </FlexContainer>
                     <br />
                     {spec.packagingMaterial ? (
                        <Content>
                           <div
                              style={{
                                 padding: '10px 80px',
                                 backgroundColor: '#ededed',
                                 borderRadius: '4px',
                              }}
                           >
                              {spec.packagingMaterial}
                           </div>
                        </Content>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Packaging Material"
                           onClick={() => openPackagingMaterial(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>

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
                     <br />
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

   margin: 10px 0;

   h4 {
      font-weight: 500;
      font-size: 14px;
      color: #555b6e;
   }
`
