import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   Text,
   TextButton,
   useMultiList,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../../assets/icons'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'
import { CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS } from '../../../../../../graphql'
import { TunnelBody, TunnelHeader } from '../styled'

const address =
   'apps.online_store.views.forms.product.customizableproduct.tunnels.itemstunnel.'

const ProductsTunnel = ({ state, close, products }) => {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      CustomizableProductContext
   )

   const [busy, setBusy] = React.useState(false)

   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(products)

   const [createCustomizableProductOptions] = useMutation(
      CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
      {
         onCompleted: () => {
            toast.success('Products added!')
            close(3)
            close(2)
         },
         onError: error => {
            console.log(error)
            toast.error('Error')
            setBusy(false)
         },
      }
   )

   const save = () => {
      if (busy) return
      else setBusy(true)
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
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(3)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">
                  {t(address.concat('select'))}{' '}
                  {productState.meta.itemType === 'inventory'
                     ? t(address.concat('inventory products'))
                     : t(address.concat('simple recipe products'))}{' '}
                  {t(address.concat('to add'))}
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

export default ProductsTunnel
