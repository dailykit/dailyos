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

const ItemsTunnel = ({ close, items }) => {
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
                  Select{' '}
                  {state.meta.itemType === 'inventory'
                     ? 'Inventory Items'
                     : 'Recipes'}{' '}
                  to Add
               </span>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  Save
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder="type what you’re looking for..."
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
