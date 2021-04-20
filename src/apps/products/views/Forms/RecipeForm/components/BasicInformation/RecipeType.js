import React from 'react'
import { Flex, RadioGroup, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { UpdatingSpinner } from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'

const RecipeType = ({ state, updated, setUpdated }) => {
   const options = [
      { id: 'Non-vegetarian', title: 'Non-vegetarian' },
      { id: 'Vegetarian', title: 'Vegetarian' },
      { id: 'Vegan', title: 'Vegan' },
   ]

   const [updateRecipeType, { loading: updatingRecipeType }] = useMutation(
      UPDATE_RECIPE,
      {
         onCompleted: () => {
            setUpdated('type')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   return (
      <Flex container alignItems="center">
         <RadioGroup
            options={options}
            active={state.type}
            onChange={option => {
               updateRecipeType({
                  variables: {
                     id: state.id,
                     set: { type: option.title },
                  },
               })
            }}
         />
         <Spacer xAxis size="16px" />
         <UpdatingSpinner
            updated={updated}
            setUpdated={setUpdated}
            updatedField="type"
            loading={updatingRecipeType}
         />
      </Flex>
   )
}

export default RecipeType
