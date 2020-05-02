import React from 'react'

import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody } from '../styled'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import { useMutation } from '@apollo/react-hooks'

import { UPDATE_COMBO_PRODUCT_COMPONENT } from '../../../../../../graphql'
import { toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.comboproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ close, products }) => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(ComboProductContext)

   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(products)

   // Mutation
   const [updateComboProductComponent] = useMutation(
      UPDATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: data => {
            const updatedComponent =
               data.updateComboProductComponent.returning[0]
            dispatch({
               type: 'UPDATE_COMPONENT',
               payload: {
                  updatedComponent,
               },
            })
            toast.success('Product added!')
            close(4)
            close(3)
         },
         onError: error => {
            console.log(error)
         },
      }
   )

   const select = product => {
      selectOption('id', product.id)
      updateComboProductComponent({
         variables: {
            where: { id: { _eq: state.meta.componentId } },
            set: {
               customizableProductId:
                  state.meta.productType === 'customizable' ? product.id : null,
               inventoryProductId:
                  state.meta.productType === 'inventory' ? product.id : null,
               simpleRecipeProductId:
                  state.meta.productType === 'simple' ? product.id : null,
            },
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
               <span>{t(address.concat('select product to add'))}</span>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder={t(address.concat("type what you’re looking for"))}
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
      </React.Fragment>
   )
}

export default ProductsTunnel
