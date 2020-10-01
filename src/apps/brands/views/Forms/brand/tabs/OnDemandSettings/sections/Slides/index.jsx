import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import {
   Text,
   Spacer,
   Tunnel,
   Tunnels,
   useTunnel,
   IconButton,
   ButtonTile,
   TunnelHeader,
} from '@dailykit/ui'

import { ImageGrid } from './styled'
import { ImageContainer } from '../styled'
import { BRANDS } from '../../../../../../../graphql'
import { DeleteIcon } from '../../../../../../../../../shared/assets/icons'
import {
   AssetUploader,
   Flex,
} from '../../../../../../../../../shared/components'

export const Slides = ({ update }) => {
   const params = useParams()
   const [slides, setSlides] = React.useState([])
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [settingId, setSettingId] = React.useState(null)

   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         identifier: { _eq: 'Slides' },
         type: { _eq: 'visual' },
         brandId: { _eq: params.id },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { storeSettings = [] } = {} } = {},
      }) => {
         if (!isEmpty(storeSettings)) {
            const { brand, id } = storeSettings[0]
            setSettingId(id)
            setSlides(brand.value)
         }
      },
   })

   const removeSlide = index => {
      slides.splice(index, 1)
      update({ id: settingId, value: slides })
      closeTunnel(1)
   }

   const addSlide = (data = {}) => {
      if ('url' in data) {
         update({ id: settingId, value: [...slides, { url: data.url }] })
      }
      closeTunnel(1)
   }

   return (
      <div id="Slides">
         <Text as="h3">Slides</Text>
         <Spacer size="16px" />
         <ButtonTile
            type="primary"
            size="sm"
            text="Add a slide"
            onClick={() => openTunnel(1)}
         />
         <Spacer size="16px" />
         <ImageGrid>
            {slides.map((slide, index) => (
               <li key={index}>
                  <ImageContainer>
                     <div>
                        <IconButton
                           size="sm"
                           type="solid"
                           onClick={() => removeSlide(index)}
                        >
                           <DeleteIcon />
                        </IconButton>
                     </div>
                     <img src={slide?.url} alt="" />
                  </ImageContainer>
               </li>
            ))}
         </ImageGrid>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="md">
               <TunnelHeader title="Add Slide" close={() => closeTunnel(1)} />
               <Flex padding="16px">
                  <AssetUploader
                     onAssetUpload={data => addSlide(data)}
                     onImageSelect={data => addSlide(data)}
                  />
               </Flex>
            </Tunnel>
         </Tunnels>
      </div>
   )
}
