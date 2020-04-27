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

// context
import {
   state as initialState,
   CustomizableProductContext,
   reducers,
} from '../../../../context/product/customizableProduct'

// styles
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'

// graphql
import { RECIPES, ACCOMPANIMENT_TYPES } from '../../../../graphql'

// components
import { Description } from './components'

// tunnels
import { DescriptionTunnel } from './tunnels'

export default function CustomizableProduct() {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState('')

   const [recipes, setRecipes] = React.useState([])
   const [accompanimentTypes, setAccompanimentTypes] = React.useState([
      { id: 1, title: 'Beverages' },
      { id: 2, title: 'Salads' },
      { id: 3, title: 'Sweets' },
   ])
   const [products, setProducts] = React.useState({
      inventory: [
         { id: 1, title: 'INV 1' },
         { id: 2, title: 'INV 2' },
      ],
      simple: [
         { id: 1, title: 'SIM 1' },
         { id: 2, title: 'SIM 2' },
      ],
   })
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
   // useQuery(ACCOMPANIMENT_TYPES, {
   //    onCompleted: data => {
   //       const { accompanimentTypes } = data
   //       const updatedAccompanimentTypes = accompanimentTypes.map(item => {
   //          item.title = item.name
   //          return item
   //       })
   //       setAccompanimentTypes(updatedAccompanimentTypes)
   //    },
   // })

   return (
      <CustomizableProductContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Input
                     label="Product Name"
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
                  <div></div>
               </StyledMeta>
               <StyledRule />
            </StyledBody>
         </StyledWrapper>
      </CustomizableProductContext.Provider>
   )
}
