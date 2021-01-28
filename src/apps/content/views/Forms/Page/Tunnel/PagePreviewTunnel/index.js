import React from 'react'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { TunnelHeader, Tunnel, Tunnels, Dropdown } from '@dailykit/ui'
// import { GET_FILES, LINK_CSS_FILES } from '../../../graphql'
import { TunnelBody } from './style'
import BrandContext from '../../../../../context/Brand'

export default function PagePreviewTunnel({
   tunnels,
   openTunnel,
   closeTunnel,
   pageRoute,
}) {
   const [context, setContext] = React.useContext(BrandContext)

   return (
      <div>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="full">
               <TunnelHeader
                  title="Preview Page"
                  close={() => closeTunnel(1)}
               />
               <TunnelBody>
                  <iframe
                     src={`https://${context.brandDomain}${pageRoute.value}`}
                     style={{ width: '100%', height: '100%' }}
                  />
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </div>
   )
}
