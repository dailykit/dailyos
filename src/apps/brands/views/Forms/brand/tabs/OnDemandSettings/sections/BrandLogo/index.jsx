import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import {
   Text,
   IconButton,
   Spacer,
   PlusIcon,
   Tunnels,
   Tunnel,
   TunnelHeader,
   useTunnel,
} from '@dailykit/ui'

import { ImageContainer } from './styled'
import { BRANDS } from '../../../../../../../graphql'
import { EditIcon } from '../../../../../../../../../shared/assets/icons'
import {
   AssetUploader,
   Flex,
} from '../../../../../../../../../shared/components'

export const BrandLogo = ({ update }) => {
   const params = useParams()
   const [url, setUrl] = React.useState('')
   const [settingId, setSettingId] = React.useState(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         brandId: { _eq: params.id },
         identifier: { _eq: 'Brand Logo' },
         type: { _eq: 'brand' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { onDemandSetting = [] } = {} } = {},
      }) => {
         console.log('BrandLogo -> onDemandSetting', onDemandSetting)
         if (!isEmpty(onDemandSetting)) {
            const { value, storeSettingId } = onDemandSetting[0]
            setUrl(value.url)
            setSettingId(storeSettingId)
         }
      },
   })

   const updateSetting = (data = {}) => {
      if ('url' in data) {
         update({ id: settingId, value: { url: data.url } })
      }
      closeTunnel(1)
   }

   return (
      <div id="Brand Logo">
         <Text as="h3">Logo</Text>
         <Spacer size="16px" />
         {url ? (
            <ImageContainer width="160px" height="160px">
               <div>
                  <IconButton
                     size="sm"
                     type="solid"
                     onClick={() => openTunnel(1)}
                  >
                     <EditIcon />
                  </IconButton>
               </div>
               <img src={url} alt="Brand Logo" />
            </ImageContainer>
         ) : (
            <ImageContainer width="160px" height="160px" noThumb>
               <div>
                  <IconButton
                     size="sm"
                     type="solid"
                     onClick={() => openTunnel(1)}
                  >
                     <PlusIcon />
                  </IconButton>
               </div>
            </ImageContainer>
         )}
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="md">
               <TunnelHeader
                  title="Add Brand Logo"
                  close={() => closeTunnel(1)}
               />
               <Flex padding="16px">
                  <AssetUploader
                     onAssetUpload={data => updateSetting(data)}
                     onImageSelect={data => updateSetting(data)}
                  />
               </Flex>
            </Tunnel>
         </Tunnels>
      </div>
   )
}
