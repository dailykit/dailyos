import { useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   IconButton,
   Spacer,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { EditIcon } from '../../../../../../shared/assets/icons'
import { PACKAGING_SPECS_SUBSCRIPTION } from '../../../../graphql'
import { ShadowCard } from '../../styled'
import AdditionalInfo from '../AdditionalInfo'
import { OtherProperties, PackagingMaterial } from '../Tunnels'
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

         <Flex container>
            <Flex style={{ flex: 2 }}>
               <AdditionalInfo id={state.id} />
            </Flex>
            <Spacer xAxis size="16px" />
            <Flex style={{ flex: 3 }}>
               <ShadowCard style={{ flexDirection: 'column' }}>
                  <Spacer size="16px" />
                  <Flex
                     container
                     alignItems="center"
                     justifyContent="space-between"
                  >
                     <Text as="title">Packaging Material</Text>
                     {spec.packagingMaterial ? (
                        <IconButton
                           type="outline"
                           onClick={() => openPackagingMaterial(1)}
                        >
                           <EditIcon />
                        </IconButton>
                     ) : null}
                  </Flex>
                  <Spacer size="16px" />

                  {spec.packagingMaterial ? (
                     <Text as="h3">{spec.packagingMaterial}</Text>
                  ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text="Select Packaging Material"
                        onClick={() => openPackagingMaterial(1)}
                        style={{ margin: '20px 0' }}
                     />
                  )}
                  <Spacer size="16px" />

                  <Flex
                     container
                     alignItems="center"
                     justifyContent="space-between"
                  >
                     <Text as="title">Other Properties</Text>
                     <IconButton
                        type="outline"
                        onClick={() => openOtherPropertiesTunnel(1)}
                     >
                        <EditIcon />
                     </IconButton>
                  </Flex>
                  <Spacer size="16px" />
                  <Content>
                     <Flex container alignItems="center">
                        {renderIcon(spec.recycled)}
                        <h4>Recyled</h4>
                     </Flex>
                     <Flex container alignItems="center">
                        {renderIcon(spec.compressibility)}
                        <h4>Compressable</h4>
                     </Flex>
                  </Content>
                  <Spacer size="16px" />

                  <Content>
                     <h4>
                        Opacity: <b>{spec.opacity ? spec.opacity : 'N/A'}</b>
                     </h4>
                  </Content>
               </ShadowCard>
            </Flex>
         </Flex>
      </>
   )
}

const Content = styled.div`
   display: flex;
   width: 70%;
   justify-content: space-between;
   align-items: center;

   h4 {
      font-weight: 500;
      font-size: 14px;
      color: #555b6e;
   }
`
