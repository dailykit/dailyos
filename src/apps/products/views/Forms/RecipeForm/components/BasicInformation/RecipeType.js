import React from 'react'
import { Flex, RadioGroup, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { UpdatingSpinner } from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'

const RecipeType = ({
   _state,
   _dispatch,
   getMutationOptions,
   updated,
   setUpdated,
}) => {
   const options = [
      { id: 'Non-vegetarian', title: 'Non-vegetarian' },
      { id: 'Vegetarian', title: 'Vegetarian' },
      { id: 'Vegan', title: 'Vegan' },
   ]

   const [updateRecipeType, { loading: updatingRecipeType }] = useMutation(
      UPDATE_RECIPE,
      getMutationOptions({ type: _state.type.value }, 'type')
   )

   return (
      <Flex container alignItems="center">
         <RadioGroup
            options={options}
            active={_state.type.value}
            onChange={option => {
               _dispatch({
                  type: 'SET_VALUE',
                  payload: {
                     field: 'type',
                     value: option.title,
                  },
               })
               updateRecipeType()
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
