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

const EditLabelTemplateTunnel = ({ closeTunnel, templates }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(templates)

   React.useEffect(() => {
      if (Object.keys(current).length) {
         ingredientDispatch({
            type: 'EDIT_MODE',
            payload: {
               ...ingredientState.editMode,
               labelTemplate: current,
            },
         })
         closeTunnel(12)
      }
   }, [current])

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(12)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Select Label Template</Text>
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

export default EditLabelTemplateTunnel
