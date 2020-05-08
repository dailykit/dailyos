import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   TextButton,
   useMultiList,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   Text,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody } from '../styled'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'

import { useTranslation, Trans } from 'react-i18next'
import { toast } from 'react-toastify'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.accompanimenttypetunnel.'

const AccompanimentTypeTunnel = ({ state, close, accompanimentTypes }) => {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)

   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(accompanimentTypes)

   //Mutation
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success('Accompaniment types added!')
         close(4)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      const accompaniments = selected.map(type => ({
         type: type.title,
         products: [],
      }))
      updateProduct({
         variables: {
            id: state.id,
            set: {
               accompaniments,
            },
         },
      })
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(4)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">
                  {t(address.concat('select accompaniment type'))}
               </Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy
                     ? t(address.concat('saving'))
                     : t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder={t(
                     address.concat("type what you're looking for")
                  )}
               />
               {selected.length > 0 && (
                  <TagGroup style={{ margin: '8px 0' }}>
                     {selected.map(option => (
                        <Tag
                           key={option.id}
                           title={option.title}
                           onClick={() => selectOption('id', option.id)}
                        >
                           {option.title}
                        </Tag>
                     ))}
                  </TagGroup>
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="MSL1"
                           key={option.id}
                           title={option.title}
                           onClick={() => selectOption('id', option.id)}
                           isActive={selected.find(
                              item => item.id === option.id
                           )}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}

export default AccompanimentTypeTunnel
