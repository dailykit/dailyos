import React from 'react'
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
import { CollectionContext } from '../../../../../context/collection'
import { TunnelBody } from '../styled'

const address = 'apps.online_store.views.forms.collection.tunnels.products.'

const ProductsTunnel = ({ close, products }) => {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const { collectionDispatch } = React.useContext(CollectionContext)
   const [list, selected, selectOption] = useMultiList(products)

   const save = () => {
      collectionDispatch({
         type: 'ADD_PRODUCTS',
         payload: {
            products: selected,
         },
      })
      close(2)
      close(1)
   }

   return (
      <>
         <TunnelHeader
            title={t(
               address.concat('select and add products to the collection')
            )}
            right={{ action: save, title: t(address.concat('save')) }}
            close={() => close(2)}
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
