import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
   Input,
   TextButton,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'

import {
   state as initialState,
   SimpleProductContext,
   reducers,
} from '../../../../context/product/simpleProduct'

import { RecipeTunnel, DescriptionTunnel } from './tunnels'
import { Recipe, Description } from './components'
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'
import { RECIPES } from '../../../../graphql'

export default function SimpleRecipeProduct() {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState('')
   const [recipes, setRecipes] = React.useState([])
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   useQuery(RECIPES, {
      onCompleted: data => {
         const { simpleRecipes } = data
         const updatedRecipes = simpleRecipes.map(item => {
            item.title = item.name
            return item
         })
         setRecipes(updatedRecipes)
      },
   })

   return (
      <SimpleProductContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <RecipeTunnel close={closeTunnel} recipes={recipes} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Input
                     label="Untitled Product"
                     type="text"
                     name="name"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={e =>
                        dispatch({
                           type: 'TITLE',
                           payload: { value: e.target.value },
                        })
                     }
                  />
               </div>
               <div>
                  <TextButton type="ghost" style={{ margin: '0px 10px' }}>
                     Save
                  </TextButton>

                  <TextButton type="solid" style={{ margin: '0px 10px' }}>
                     Publish
                  </TextButton>
               </div>
            </StyledHeader>
            <StyledBody>
               <StyledMeta>
                  <div>
                     <Description openTunnel={openTunnel} />
                  </div>
                  <div>stats</div>
               </StyledMeta>
               <StyledRule />
               <Recipe openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </SimpleProductContext.Provider>
   )
}
