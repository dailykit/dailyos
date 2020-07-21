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
import { FETCH_PACKAGINGS } from '../../../../../graphql'

const EditPackagingTunnel = ({ closeTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )
   const [packagings, setPackagings] = React.useState([])
   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(packagings)

   // Subscription
   const { loading } = useSubscription(FETCH_PACKAGINGS, {
      onSubscriptionData: data => {
         setPackagings([...data.subscriptionData.data.packagings])
      },
      onError: error => {
         console.log(error)
      },
   })

   React.useEffect(() => {
      if (Object.keys(current).length) {
         ingredientDispatch({
            type: 'EDIT_MODE',
            payload: {
               ...ingredientState.editMode,
               packaging: current,
            },
         })
         closeTunnel(5)
      }
   }, [current])

   return (
      <>
         <TunnelHeader title="Select Packaging" close={() => closeTunnel(5)} />
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

export default EditPackagingTunnel
