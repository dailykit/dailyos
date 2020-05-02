import React from 'react'
import {
   TextButton,
   useMultiList,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody } from '../styled'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.inventoryproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ close, products }) => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(InventoryProductContext)

   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(products)

   const save = () => {
      const products = selected.map(el => {
         return {
            ...el,
            discount: {
               value: '',
            },
         }
      })
      dispatch({
         type: 'ADD_ACCOMPANIMENTS',
         payload: {
            value: products,
         },
      })
      close(6)
      close(5)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(6)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>{t(address.concat('select products to add'))}</span>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder={t(address.concat("type what you’re looking for"))}
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
