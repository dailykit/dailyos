import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import { UPDATE_COMBO_PRODUCT_COMPONENT } from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.comboproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ close, products }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(ComboProductContext)

   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(products)

   // Mutation
   const [updateComboProductComponent] = useMutation(
      UPDATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: () => {
            toast.success(t(address.concat('product added!')))
            close(4)
            close(3)
         },
      }
   )

   const select = product => {
      selectOption('id', product.id)
      updateComboProductComponent({
         variables: {
            id: productState.meta.componentId,
            set: {
               customizableProductId:
                  productState.meta.productType === 'customizable'
                     ? product.id
                     : null,
               inventoryProductId:
                  productState.meta.productType === 'inventory'
                     ? product.id
                     : null,
               simpleRecipeProductId:
                  productState.meta.productType === 'simple'
                     ? product.id
                     : null,
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select product to add'))}
            close={() => close(4)}
         />
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
                           onClick={() => select(option)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </>
   )
}

export default ProductsTunnel
