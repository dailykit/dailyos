import React from 'react'
import {
   Dropdown,
   Flex,
   Spacer,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { UpdatingSpinner } from '../../../../../../../shared/components'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import { useMutation } from '@apollo/react-hooks'
import { AddTypesTunnel } from '../../../../../../settings/views/Forms/MasterList/Cuisine/tunnels'

const SelectCuisine = ({
   state,
   _dispatch,
   cuisineNames,
   updated,
   setUpdated,
}) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const [updateCuisine, { loading: updatingCuisine }] = useMutation(
      UPDATE_RECIPE,
      {
         onCompleted: () => {
            setUpdated('cuisine')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   return (
      <>
         <Flex container alignItems="center">
            <Dropdown
               type="single"
               title="cuisine"
               variant="revamp"
               addOption={() => openTunnel(1)}
               searchedOption={e => console.log('Searched for ', e)}
               options={cuisineNames}
               selectedOption={option => {
                  _dispatch({
                     type: 'SET_VALUE',
                     payload: {
                        field: 'cuisine',
                        value: option.title,
                     },
                  })
                  updateCuisine({
                     variables: {
                        id: state.id,
                        set: { cuisine: option.title },
                     },
                  })
               }}
               typeName="cuisine"
            />
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="cuisine"
               loading={updatingCuisine}
            />
         </Flex>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <AddTypesTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export default SelectCuisine
