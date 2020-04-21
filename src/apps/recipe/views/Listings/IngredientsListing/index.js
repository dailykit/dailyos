import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import {
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Checkbox,
   SearchBox
} from '@dailykit/ui'

import { generateRandomString } from '../../../utils'

// Icons
import {
   AddIcon,
   ChevronLeftIcon,
   ChevronRightIcon
} from '../../../assets/icons'

// State
import { Context } from '../../../store/tabs'

// Styled
import {
   StyledWrapper,
   StyledTableHeader,
   StyledTableActions,
   StyledHeader,
   StyledContent,
   StyledPagination
} from '../styled'
import { CREATE_INGREDIENT, INGREDIENTS, INGREDIENT } from '../../../graphql'

const IngredientsListing = () => {
   const { dispatch } = React.useContext(Context)
   const { loading, error, data } = useQuery(INGREDIENTS)
   const [search, setSearch] = React.useState('')

   const addTab = (title, view, ID) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, ID } })
   }
   const [createIngredient] = useMutation(CREATE_INGREDIENT, {
      onCompleted: data => {
         if (data.createIngredient.success) {
            addTab(
               data.createIngredient.ingredient.name,
               'ingredient',
               data.createIngredient.ingredient.id
            )
         } else {
            // Fire toast
            console.log(data)
         }
      },
      update: (
         cache,
         {
            data: {
               createIngredient: { ingredient }
            }
         }
      ) => {
         const { ingredients } = cache.readQuery({ query: INGREDIENTS })
         cache.writeQuery({
            query: INGREDIENTS,
            data: {
               ingredients: ingredients.concat([ingredient])
            }
         })
      }
   })

   const createIngredientHandler = async () => {
      let name = 'ingredient-' + generateRandomString()
      createIngredient({ variables: { name } })
   }

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Ingredients</h1>
            <StyledPagination>
               {data?.ingredients?.length}
               <span disabled={true}>
                  <ChevronLeftIcon />
               </span>
               <span>
                  <ChevronRightIcon />
               </span>
            </StyledPagination>
         </StyledHeader>
         <StyledTableHeader>
            <p>filters</p>
            <StyledTableActions>
               <SearchBox
                  placeholder='Search'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
               <IconButton type='solid' onClick={createIngredientHandler}>
                  <AddIcon color='#fff' size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>
                        {' '}
                        <Checkbox checked={false} />{' '}
                     </TableCell>
                     <TableCell> Name </TableCell>
                     <TableCell> Variant </TableCell>
                     <TableCell> Quantity </TableCell>
                     <TableCell> Modes of Fulfillment </TableCell>
                     <TableCell> Stations </TableCell>
                     <TableCell> Supplier Item </TableCell>
                     <TableCell> Availability </TableCell>
                     <TableCell> </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {!loading &&
                     !error &&
                     data.ingredients.map(ingredient => (
                        <TableRow
                           key={ingredient.id}
                           onClick={() =>
                              addTab(
                                 ingredient.name,
                                 'ingredient',
                                 ingredient.id
                              )
                           }
                        >
                           <TableCell>
                              {' '}
                              <Checkbox checked={false} />{' '}
                           </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell></TableCell>
                        </TableRow>
                     ))}
               </TableBody>
            </Table>
         </StyledContent>
      </StyledWrapper>
   )
}

export default IngredientsListing
