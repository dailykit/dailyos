import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import {
   Input,
   TextButton,
   Text,
   Spacer,
   IconButton,
   PlusIcon,
   Tunnels,
   Tunnel,
   useTunnel,
   TunnelHeader,
} from '@dailykit/ui'

import { ImageContainer } from '../styled'
import { BRANDS } from '../../../../../../../graphql'
import { EditIcon } from '../../../../../../../../../shared/assets/icons'
import {
   Flex,
   AssetUploader,
} from '../../../../../../../../../shared/components'

export const Brand = ({ update }) => {
   const params = useParams()
   const [form, setForm] = React.useState({
      url: '',
      name: '',
      favicon: '',
      logoMark: '',
      wordMark: '',
      metaDescription: '',
   })
   const [current, setCurrent] = React.useState(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'theme-brand' },
         type: { _eq: 'brand' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { subscriptionSetting = [] } = {} } = {},
      }) => {
         if (!isEmpty(subscriptionSetting)) {
            const index = subscriptionSetting.findIndex(
               node => node?.brand?.brandId === Number(params.id)
            )

            if (index === -1) {
               const { id } = subscriptionSetting[0]
               setSettingId(id)
               return
            }
            const { brand, id } = subscriptionSetting[index]
            setSettingId(id)
            if (!isNull(brand) && !isEmpty(brand)) {
               setForm(form => ({
                  ...form,
                  ...(brand.value?.name && { name: brand.value.name }),
                  ...(brand.value?.favicon && { favicon: brand.value.favicon }),
                  ...(brand.value?.metaDescription && {
                     metaDescription: brand.value.metaDescription,
                  }),
                  ...(brand.value?.logo?.url && { url: brand.value.logo.url }),
                  ...(brand.value?.logo?.wordMark && {
                     wordMark: brand.value.logo.wordMark,
                  }),
                  ...(brand.value?.logo?.logoMark && {
                     logoMark: brand.value.logo.logoMark,
                  }),
               }))
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      if (!settingId) return
      update({
         id: settingId,
         value: {
            name: form.name,
            favicon: form.favicon,
            metaDescription: form.metaDescription,
            logo: {
               url: form.url,
               logoMark: form.logoMark,
               wordMark: form.wordMark,
            },
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm(form => ({ ...form, [name]: value }))
      closeTunnel(1)
      setCurrent(null)
   }

   return (
      <div id="theme-brand">
         <Flex>
            <Flex>
               <Text as="h3">Name</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  type="text"
                  name="name"
                  value={form.name}
                  style={{ width: '240px' }}
                  placeholder="Enter brand name"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Text as="h3">Meta Description</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  rows="3"
                  type="textarea"
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={e => handleChange(e.target.name, e.target.value)}
                  placeholder="Enter meta description for your brand"
               />
            </Flex>
            <Spacer size="24px" />
            <Flex container alignItems="center">
               <ImageItem
                  alt="Fav Icon"
                  title="Fav Icon"
                  image={form.favicon}
                  setCurrent={setCurrent}
                  openTunnel={openTunnel}
               />
               <Spacer size="16px" xAxis />
               <ImageItem
                  alt="Logo"
                  title="Logo"
                  image={form.url}
                  setCurrent={setCurrent}
                  openTunnel={openTunnel}
               />
               <Spacer size="16px" xAxis />
               <ImageItem
                  alt="Word Mark"
                  title="Word Mark"
                  image={form.wordMark}
                  setCurrent={setCurrent}
                  openTunnel={openTunnel}
               />
               <Spacer size="16px" xAxis />
               <ImageItem
                  alt="Logo Mark"
                  title="Logo Mark"
                  image={form.logoMark}
                  setCurrent={setCurrent}
                  openTunnel={openTunnel}
               />
            </Flex>
            <Spacer size="16px" />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="md">
               <TunnelHeader title="Add Image" close={() => closeTunnel(1)} />
               <Flex padding="16px">
                  <AssetUploader
                     onAssetUpload={data =>
                        handleChange(current, data?.url || '')
                     }
                     onImageSelect={data =>
                        handleChange(current, data?.url || '')
                     }
                  />
               </Flex>
            </Tunnel>
         </Tunnels>
      </div>
   )
}

const ImageItem = ({ image, title, alt, setCurrent, openTunnel }) => {
   return (
      <Flex>
         <Text as="h3">{title}</Text>
         <Spacer size="12px" />
         {image ? (
            <ImageContainer width="120px" height="120px">
               <div>
                  <IconButton
                     size="sm"
                     type="solid"
                     onClick={() => {
                        setCurrent('favicon')
                        openTunnel(1)
                     }}
                  >
                     <EditIcon />
                  </IconButton>
               </div>
               <img src={image} alt={alt} />
            </ImageContainer>
         ) : (
            <ImageContainer width="120px" height="120px" noThumb>
               <div>
                  <IconButton
                     size="sm"
                     type="solid"
                     onClick={() => {
                        setCurrent('favicon')
                        openTunnel(1)
                     }}
                  >
                     <PlusIcon />
                  </IconButton>
               </div>
            </ImageContainer>
         )}
      </Flex>
   )
}
