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

import { TunnelHeader, TunnelBody } from '../styled'
import { CloseIcon } from '../../../../../assets/icons'
import { CollectionContext } from '../../../../../context/collection'

const ProductsTunnel = ({ close, products }) => {
   const [search, setSearch] = React.useState('')
   const { state, dispatch } = React.useContext(CollectionContext)
   const [list, selected, selectOption] = useMultiList(products)

   const save = () => {
      dispatch({
         type: 'ADD_PRODUCTS',
         payload: {
            products: selected,
         },
      })
      close(1)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(1)}>
                  <CloseIcon />
               </span>
               <span>Select and add products to the collection</span>
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

export default ProductsTunnel
