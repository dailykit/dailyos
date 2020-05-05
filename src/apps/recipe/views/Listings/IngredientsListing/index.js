import React from 'react'
import * as moment from 'moment'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Checkbox,
   SearchBox,
   Loader,
} from '@dailykit/ui'

import { randomSuffix } from '../../../../../shared/utils'

// Icons
import {
   AddIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
   EditIcon,
} from '../../../assets/icons'

// State
import { Context } from '../../../context/tabs'

// Styled
import {
   StyledWrapper,
   StyledTableHeader,
   StyledTableActions,
   StyledHeader,
   StyledContent,
   StyledPagination,
} from '../styled'
import { CREATE_INGREDIENT, INGREDIENTS } from '../../../graphql'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.views.listings.ingredientslisting.'

const IngredientsListing = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const { loading, error, data } = useQuery(INGREDIENTS)
   console.log(data)
   const [search, setSearch] = React.useState('')

   const addTab = (title, view, ID) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, ID } })
   }
   const [createIngredient] = useMutation(CREATE_INGREDIENT, {
      onCompleted: data => {
         if (data.createIngredient.returning?.length) {
            addTab(
               data.createIngredient.returning[0].name,
               'ingredient',
               data.createIngredient.returning[0].id
            )
         } else {
            // Fire toast
            console.log(data)
         }
      },
      // update: (
      //    cache,
      //    {
      //       data: {
      //          createIngredient: { ingredient }
      //       }
      //    }
      // ) => {
      //    const { ingredients } = cache.readQuery({ query: INGREDIENTS })
      //    cache.writeQuery({
      //       query: INGREDIENTS,
      //       data: {
      //          ingredients: ingredients.concat([ingredient])
      //       }
      //    })
      // }
   })

   const createIngredientHandler = async () => {
      let name = 'ingredient-' + randomSuffix()
      createIngredient({ variables: { name } })
   }

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('ingredients'))}</h1>
            <StyledPagination>
               Total: {data?.ingredients?.length}
               {/* <span disabled={true}>
                  <ChevronLeftIcon />
               </span>
               <span>
                  <ChevronRightIcon />
               </span> */}
            </StyledPagination>
         </StyledHeader>
         <StyledTableHeader>
            <p>{t(address.concat('filters'))}</p>
            <StyledTableActions>
               <SearchBox
                  placeholder={t(address.concat('search'))}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
               <IconButton type="solid" onClick={createIngredientHandler}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{/* <Checkbox checked={false} /> */}</TableCell>
                     <TableCell> {t(address.concat('name'))} </TableCell>
                     <TableCell>{t(address.concat('processings'))}</TableCell>
                     <TableCell>{t(address.concat('created at'))}</TableCell>
                     <TableCell> </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {!loading &&
                     !error &&
                     data.ingredients.map(ingredient => (
                        <TableRow key={ingredient.id}>
                           <TableCell>
                              {/* <Checkbox checked={false} /> */}
                           </TableCell>
                           <TableCell> {ingredient.name} </TableCell>
                           <TableCell>
                              {ingredient.ingredientProcessings.length}
                           </TableCell>
                           <TableCell>
                              {ingredient.createdAt
                                 ? moment(ingredient.createdAt).calendar()
                                 : 'NA'}
                           </TableCell>
                           <TableCell>
                              <IconButton
                                 onClick={() =>
                                    addTab(
                                       ingredient.name,
                                       'ingredient',
                                       ingredient.id
                                    )
                                 }
                              >
                                 <EditIcon color="#28C1F6" />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
               </TableBody>
            </Table>
         </StyledContent>
      </StyledWrapper>
   )
}

export default IngredientsListing
