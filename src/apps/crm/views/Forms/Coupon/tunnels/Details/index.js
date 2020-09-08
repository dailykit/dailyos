import React from 'react'
import { TunnelHeader, Text, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import DescriptionTunnel from './Description'
import TitleTunnel from './Title'
import { TunnelBody, SolidTile } from '../styled'

const DetailsTunnel = ({ state, close }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={2}>
               <TitleTunnel state={state} close={() => closeTunnel(1)} />
            </Tunnel>
            <Tunnel layer={3}>
               <DescriptionTunnel state={state} close={() => closeTunnel(2)} />
            </Tunnel>
         </Tunnels>
         <TunnelHeader title="Select type of Details" close={() => close(1)} />
         <TunnelBody>
            <SolidTile onClick={() => openTunnel(1)}>
               <Text as="h1">Title</Text>
               <Text as="subtitle">Give a title to this coupon</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => openTunnel(2)}>
               <Text as="h1">Description</Text>
               <Text as="subtitle">Write a Description of this coupon</Text>
            </SolidTile>
            <br />
         </TunnelBody>
      </>
   )
}

export default DetailsTunnel
