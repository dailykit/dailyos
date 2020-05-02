import React from 'react'

import {
   TextButton,
   Tag,
   TagGroup,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useMultiList,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody } from '../styled'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.customizableproduct.tunnels.itemstunnel.'

const ItemsTunnel = ({ close, items }) => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(CustomizableProductContext)

   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(items)

   const save = () => {
      const updatedItems = selected.map(el => {
         return {
            ...el,
            type: state.meta.itemType,
            accompaniments: [],
         }
      })
      dispatch({
         type: 'ITEMS',
         payload: {
            value: updatedItems,
         },
      })
      if (!Object.keys(state.default).length) {
         dispatch({
            type: 'DEFAULT',
            payload: {
               value: {
                  type: state.meta.itemType,
                  id: updatedItems[0].id,
               },
            },
         })
      }
      close(3)
      close(2)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(3)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>
                  {t(address.concat('select'))}{' '}
                  {state.meta.itemType === 'inventory'
                     ? t(address.concat('inventory products'))
                     : t(address.concat('simple recipe products'))}{' '}
                  {t(address.concat('to add'))}
               </span>
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

export default ItemsTunnel
