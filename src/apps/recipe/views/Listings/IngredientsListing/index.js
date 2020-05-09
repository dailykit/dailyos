import React from 'react'
import * as moment from 'moment'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
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
   DeleteIcon,
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
   GridContainer,
} from '../styled'
import { CREATE_INGREDIENT, INGREDIENTS, S_INGREDIENTS } from '../../../graphql'

import { useTranslation, Trans } from 'react-i18next'
import { toast } from 'react-toastify'

const address = 'apps.recipe.views.listings.ingredientslisting.'

const IngredientsListing = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const [ingredients, setIngredients] = React.useState([])
   const [search, setSearch] = React.useState('')

   // Queries
   const { loading, error, data } = useSubscription(S_INGREDIENTS, {
      onSubscriptionData: data => {
         console.log(data)
         setIngredients(data.subscriptionData.data.ingredients)
      },
   })

   // Mutations
   const [createIngredient] = useMutation(CREATE_INGREDIENT, {
      onCompleted: data => {
         toast.success('Ingredient created!')
         addTab(
            data.createIngredient.returning[0].name,
            'ingredient',
            data.createIngredient.returning[0].id
         )
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Effects
   React.useEffect(() => {
      if (data)
         setIngredients(
            data.ingredients.filter(ing =>
               ing.name.toLowerCase().includes(search.toLowerCase())
            )
         )
   }, [search])

   // Handlers
   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

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
               Total: {ingredients?.length}
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
                     <TableCell> {t(address.concat('name'))} </TableCell>
                     <TableCell>{t(address.concat('processings'))}</TableCell>
                     <TableCell>{t(address.concat('created at'))}</TableCell>
                     <TableCell> </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {!loading &&
                     !error &&
                     ingredients.map(ingredient => (
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
                              <GridContainer>
                                 <IconButton>
                                    <DeleteIcon color="#FF5A52" />
                                 </IconButton>
                              </GridContainer>
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
