import React, { useContext, useState } from 'react'
import { Input, HelperText } from '@dailykit/ui'

import { Context as RecipeContext } from '../../../../context/recipe'

import { TunnelContainer } from '../styled'

import { TunnelHeader, Spacer } from '../../../../components/index'

export default function AddServings({ close }) {
   const {
      recipeState: {
         pushableState: {
            description: oldDesc,
            cookingTime: oldTime,
            utensils: oldUtensils,
         },
      },
      recipeDispatch,
   } = useContext(RecipeContext)

   const [description, setDescription] = useState(oldDesc || '')
   const [utensils, setUtensils] = useState(oldUtensils || '')
   const [cookingTime, setCookingTime] = useState(oldTime || '')

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Add Recipe Meta"
            close={() => {
               close(1)
            }}
            next={() => {
               if (description || utensils || cookingTime) {
                  recipeDispatch({
                     type: 'ADD_RECIPE_META',
                     payload: { description, utensils, cookingTime },
                  })

                  close(1)
               }

               close(1)
            }}
            nextAction="Add"
         />
         <Spacer />

         <Input
            type="text"
            placeholder="Utensils (add list of utensils with comma separated values)"
            name="utensils"
            value={utensils}
            onChange={e => setUtensils(e.target.value)}
         />
         <br />
         <Input
            type="textarea"
            placeholder="Recipe Description"
            name="description"
            rows="3"
            value={description}
            onChange={e => setDescription(e.target.value)}
         />
         <br />
         <Input
            type="text"
            placeholder="Cooking Time (in minutes)"
            name="time"
            value={cookingTime}
            onChange={e => setCookingTime(e.target.value)}
         />
         <br />
         <HelperText type="hint" message="Fill all of the fields above!" />
      </TunnelContainer>
   )
}
