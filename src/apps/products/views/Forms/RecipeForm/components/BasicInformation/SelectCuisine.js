import { Dropdown, Flex, Spacer } from '@dailykit/ui'
import React from 'react'
import { UpdatingSpinner } from '../../../../../../../shared/components'

const SelectCuisine = ({
   _dispatch,
   cuisineNames,
   updateCuisine,
   updatingCuisine,
   updated,
   setUpdated,
}) => {
   return (
      <Flex container alignItems="center">
         <Dropdown
            type="single"
            title="cuisine"
            variant="revamp"
            addOption={() => console.log('Item added')}
            options={cuisineNames}
            selectedOption={option => {
               _dispatch({
                  type: 'SET_VALUE',
                  payload: {
                     field: 'cuisine',
                     value: option.title,
                  },
               })
               updateCuisine()
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
   )
}

export default SelectCuisine
