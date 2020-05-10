import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Text,
   useSingleList,
} from '@dailykit/ui'
import { CloseIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { TunnelBody, TunnelHeader } from '../styled'

const ItemTunnel = ({ openTunnel, closeTunnel, items }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(items)

   React.useEffect(() => {
      if (Object.keys(current).length) {
         ingredientDispatch({
            type: 'MODE',
            payload: {
               mode: ingredientState.currentMode,
               name:
                  ingredientState.currentMode === 'realTime'
                     ? 'bulkItem'
                     : 'sachetItem',
               value: current,
            },
         })
         closeTunnel(4)
         closeTunnel(3)
      }
   }, [current])

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(4)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Select Item</Text>
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

export default ItemTunnel
