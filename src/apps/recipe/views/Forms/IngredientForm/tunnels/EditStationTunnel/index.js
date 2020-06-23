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
import { FETCH_STATIONS } from '../../../../../graphql'

const EditStationTunnel = ({ closeTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )
   const [stations, setStations] = React.useState([])
   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(stations)

   const { loading } = useSubscription(FETCH_STATIONS, {
      onSubscriptionData: data => {
         setStations([...data.subscriptionData.data.stations])
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
               station: current,
            },
         })
         closeTunnel(3)
      }
   }, [current])

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader title="Select Station" close={() => closeTunnel(3)} />
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
      </>
   )
}

export default EditStationTunnel
