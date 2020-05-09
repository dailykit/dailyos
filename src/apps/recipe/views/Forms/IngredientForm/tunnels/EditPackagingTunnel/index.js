import React from 'react'
import {
   Text,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { TunnelBody, TunnelHeader } from '../styled'

import { IngredientContext } from '../../../../../context/ingredient'

const EditPackagingTunnel = ({ openTunnel, closeTunnel, packagings }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(packagings)

   React.useEffect(() => {
      if (Object.keys(current).length) {
         ingredientDispatch({
            type: 'EDIT_MODE',
            payload: {
               ...ingredientState.editMode,
               packaging: current,
            },
         })
         closeTunnel(11)
      }
   }, [current])

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(11)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Select Packaging</Text>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder="type what you’re looking for..."
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
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}

export default EditPackagingTunnel
