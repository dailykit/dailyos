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

import { ImageContainer } from '../styled'
import { BRANDS } from '../../../../../../../graphql'
import { EditIcon } from '../../../../../../../../../shared/assets/icons'
import {
   Flex,
   AssetUploader,
} from '../../../../../../../../../shared/components'

export const Favicon = ({ update }) => {
   const params = useParams()
   const [url, setUrl] = React.useState('')
   const [settingId, setSettingId] = React.useState(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         brandId: { _eq: params.id },
         identifier: { _eq: 'Favicon' },
         type: { _eq: 'visual' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { onDemandSetting = [] } = {} } = {},
      }) => {
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
      <div id="Favicon">
         <Text as="h3">Fav Icon</Text>
         <Spacer size="16px" />
         {url ? (
            <ImageContainer width="120px" height="120px">
               <div>
                  <IconButton
                     size="sm"
                     type="solid"
                     onClick={() => openTunnel(1)}
                  >
                     <EditIcon />
                  </IconButton>
               </div>
               <img src={url} alt="Favicon" />
            </ImageContainer>
         ) : (
            <ImageContainer width="120px" height="120px" noThumb>
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
               <TunnelHeader title="Add Favicon" close={() => closeTunnel(1)} />
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
