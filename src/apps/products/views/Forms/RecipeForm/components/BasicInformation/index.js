import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Filler, Flex, Spacer, Text } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { CUISINES, UPDATE_RECIPE } from '../../../../../graphql'
import SelectCuisine from './SelectCuisine'
import RecipeType from './RecipeType'
import CookingTime from './CookingTime'
import Author from './Author'
import Utensils from './Utensils'
import NotIncluded from './NotIncluded'
import Description from './Description'
import { initialState, reducer } from './reduxOption'

const BasicInformation = ({ state }) => {
   // State
   const [updated, setUpdated] = React.useState(null)
   const [_state, _dispatch] = React.useReducer(reducer, initialState)
   console.log(_state)
   // Subscription
   const { data: { cuisineNames = [] } = {}, loading } = useQuery(CUISINES, {
      onCompleted: data => {
         if (!state.cuisine && data.cuisineNames.length) {
            _dispatch({
               type: 'SET_VALUE',
               payload: {
                  field: 'cuisine',
                  value: data.cuisineNames[0].title,
               },
            })
         }
      },
      onError: error => {
         console.log('Something went wrong!')
         logger(error)
      },
      fetchPolicy: 'cache-and-network',
   })

   //Mutations
   const getMutationOptions = (set, updatedField) => {
      return {
         variables: {
            id: state.id,
            set,
         },
         onCompleted: () => {
            setUpdated(updatedField)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   }

   const [updateCuisine, { loading: updatingCuisine }] = useMutation(
      UPDATE_RECIPE,
      getMutationOptions({ cuisine: _state.cuisine.value }, 'cuisine')
   )

   React.useEffect(() => {
      _dispatch({
         type: 'SEED',
         payload: {
            state: initialState,
         },
      })
   }, [])

   return (
      <>
         {loading ? (
            <InlineLoader />
         ) : (
            <>
               {cuisineNames.length ? (
                  <div>
                     <Flex padding="48px 0px 30px 0px">
                        <Text as="h2">Basic Information</Text>
                     </Flex>
                     <RecipeType
                        updated={updated}
                        setUpdated={setUpdated}
                        _state={_state}
                        _dispatch={_dispatch}
                        getMutationOptions={getMutationOptions}
                     />
                     <Spacer yAxis size="48px" />
                     <SelectCuisine
                        updated={updated}
                        setUpdated={setUpdated}
                        _dispatch={_dispatch}
                        cuisineNames={cuisineNames}
                        updateCuisine={updateCuisine}
                        updatingCuisine={updatingCuisine}
                     />
                     <Spacer yAxis size="48px" />

                     <CookingTime
                        updated={updated}
                        setUpdated={setUpdated}
                        _state={_state}
                        _dispatch={_dispatch}
                        getMutationOptions={getMutationOptions}
                     />
                     <Spacer yAxis size="48px" />

                     <Author
                        updated={updated}
                        setUpdated={setUpdated}
                        _state={_state}
                        _dispatch={_dispatch}
                        getMutationOptions={getMutationOptions}
                     />
                     <Spacer yAxis size="48px" />

                     <Utensils
                        updated={updated}
                        setUpdated={setUpdated}
                        _state={_state}
                        _dispatch={_dispatch}
                        getMutationOptions={getMutationOptions}
                     />
                     <Spacer yAxis size="48px" />

                     <NotIncluded
                        updated={updated}
                        setUpdated={setUpdated}
                        _state={_state}
                        _dispatch={_dispatch}
                        getMutationOptions={getMutationOptions}
                     />
                     <Spacer yAxis size="48px" />

                     <Description
                        updated={updated}
                        setUpdated={setUpdated}
                        _state={_state}
                        _dispatch={_dispatch}
                        getMutationOptions={getMutationOptions}
                     />
                     <Spacer yAxis size="48px" />
                  </div>
               ) : (
                  <Filler
                     message="No cuisines found! To start, add some."
                     height="500px"
                  />
               )}
            </>
         )}
      </>
   )
}

export default BasicInformation
