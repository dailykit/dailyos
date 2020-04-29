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

const AccompanimentTypeTunnel = ({ close, accompanimentTypes }) => {
   const { state, dispatch } = React.useContext(InventoryProductContext)

   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(accompanimentTypes)

   const save = () => {
      dispatch({
         type: 'ACCOMPANIMENT_TYPES',
         payload: {
            value: selected,
         },
      })
      close(3)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(3)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Select Accompaniment Type</span>
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

export default AccompanimentTypeTunnel
