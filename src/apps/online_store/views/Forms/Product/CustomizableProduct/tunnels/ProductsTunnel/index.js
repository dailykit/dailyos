import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   useMultiList,
   TunnelHeader,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'
import { CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS } from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.customizableproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ state, close, products }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(CustomizableProductContext)

   const [busy, setBusy] = React.useState(false)

   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(products)

   const [createCustomizableProductOptions] = useMutation(
      CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
      {
         onCompleted: () => {
            toast.success(t(address.concat('products added!')))
            close(3)
            close(2)
         },
         onError: () => {
            toast.error(t(address.concat('error')))
            setBusy(false)
         },
      }
   )

   const save = () => {
      if (busy) return
      setBusy(true)
      const objects = selected.map(product => {
         return {
            customizableProductId: state.id,
            inventoryProductId:
               productState.meta.itemType === 'inventory' ? product.id : null,
            simpleRecipeProductId:
               productState.meta.itemType === 'simple' ? product.id : null,
         }
      })
      createCustomizableProductOptions({
         variables: {
            objects,
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title={`${t(address.concat('select'))} 
                  ${
                     productState.meta.itemType === 'inventory'
                        ? t(address.concat('inventory products'))
                        : t(address.concat('simple recipe products'))
                  }{' '}
                  {t(address.concat('to add'))}`}
            right={{
               action: save,
               title: busy
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(3)}
         />
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
      </>
   )
}

export default ProductsTunnel
