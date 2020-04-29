import React from 'react'

import {
   useMultiList,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   TextButton,
   Tag,
   TagGroup,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { ItemContext } from '../../../../../context/item'

import { TunnelHeader, TunnelBody } from '../styled'

export default function AllergensTunnelForDerivedProcessing({ close }) {
   const [search, setSearch] = React.useState('')
   const { state, dispatch } = React.useContext(ItemContext)
   const [list, selected, selectOption] = useMultiList([
      {
         id: 1,
         title: 'ALG 1',
      },
      {
         id: 2,
         title: 'ALG 2',
      },
      {
         id: 3,
         title: 'ALG 3',
      },
   ])

   const save = () => {
      dispatch({
         type: 'ADD_ALLERGENS_FOR_DERIVED_PROCESSING',
         payload: selected,
      })
      close(8)
   }

   return (
      <>
         <TunnelHeader>
            <div>
               <span onClick={close}>
                  <CloseIcon size={24} />
               </span>
               <span>Add Allergens</span>
            </div>
            <TextButton type="solid" onClick={save}>
               Save
            </TextButton>
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
      </>
   )
}
