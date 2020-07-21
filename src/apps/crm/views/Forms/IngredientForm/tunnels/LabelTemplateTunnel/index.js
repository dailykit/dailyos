import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
   Loader,
} from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { IngredientContext } from '../../../../../context/ingredient'
import { TunnelBody } from '../styled'
import { FETCH_LABEL_TEMPLATES } from '../../../../../graphql'

const LabelTemplateTunnel = ({ closeTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )
   const [templates, setTemplates] = React.useState([])
   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(templates)

   // Subscription
   const { loading } = useSubscription(FETCH_LABEL_TEMPLATES, {
      onSubscriptionData: data => {
         setTemplates([...data.subscriptionData.data.labelTemplates])
      },
      onError: error => {
         console.log(error)
      },
   })

   React.useEffect(() => {
      if (Object.keys(current).length) {
         ingredientDispatch({
            type: 'MODE',
            payload: {
               mode: ingredientState.currentMode,
               name: 'labelTemplate',
               value: current,
            },
         })
         closeTunnel(5)
      }
   }, [current])

   return (
      <>
         <TunnelHeader
            title="Select Label Template"
            close={() => closeTunnel(5)}
         />
         <TunnelBody>
            {loading ? (
               <Loader />
            ) : (
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
            )}
         </TunnelBody>
      </>
   )
}

export default LabelTemplateTunnel
