import React from 'react'
import {
   Text,
   TextButton,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   useSingleList,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { TunnelBody, TunnelHeader } from '../styled'

import { IngredientContext } from '../../../../../context/ingredient'

const EditStationTunnel = ({ closeTunnel, stations }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(stations)

   React.useEffect(() => {
      if (Object.keys(current).length) {
         ingredientDispatch({
            type: 'EDIT_MODE',
            payload: {
               ...ingredientState.editMode,
               station: current,
            },
         })
         closeTunnel(9)
      }
   }, [current])

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(9)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Select Station</Text>
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

export default EditStationTunnel
