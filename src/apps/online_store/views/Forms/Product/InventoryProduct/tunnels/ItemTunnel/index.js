import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Text,
   TextButton,
   useSingleList,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../../assets/icons'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'
import { TunnelBody, TunnelHeader } from '../styled'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.itemtunnel.'

export default function ItemTunnel({ state, close, items }) {
   const { t } = useTranslation()
   const { productState } = React.useContext(InventoryProductContext)

   const [busy, setBusy] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(items)

   //Mutation
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            supplierItemId:
               productState.meta.itemType === 'inventory' ? current.id : null,
            sachetItemId:
               productState.meta.itemType === 'sachet' ? current.id : null,
         },
      },
      onCompleted: () => {
         toast.success('Item added!')
         close(3)
         close(2)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const add = item => {
      if (busy) return
      else setBusy(true)
      updateProduct()
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(3)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">{t(address.concat('select an item'))}</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={add}>
                  {busy
                     ? t(address.concat('adding'))
                     : t(address.concat('add'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(
                        address.concat("type what you're looking for")
                     )}
                  />
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL1"
                           key={option.id}
                           title={option.title}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}
