import { useMutation, useSubscription } from '@apollo/react-hooks'
import { IconButton, Loader, TextButton } from '@dailykit/ui'
import * as moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { toast } from 'react-toastify'
import tableOptions from '../tableOption'

import ProcessingCount from '../../../utils/countFormatter'

import { randomSuffix } from '../../../../../shared/utils'
import { AddIcon, DeleteIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
import {
   CREATE_INGREDIENT,
   DELETE_INGREDIENTS,
   S_INGREDIENTS,
} from '../../../graphql'
import {
   StyledContent,
   StyledHeader,
   StyledPagination,
   StyledTableActions,
   StyledTableHeader,
   StyledWrapper,
} from '../styled'

const address = 'apps.recipe.views.listings.ingredientslisting.'

const IngredientsListing = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const { loading, data: { ingredients = [] } = {} } = useSubscription(
      S_INGREDIENTS,
      {
         onError: error => {
            console.log(error)
            toast.error(error.message)
         },
      }
   )
   // Mutations
   const [createIngredient] = useMutation(CREATE_INGREDIENT, {
      onCompleted: data => {
         toast.success('Ingredient created!')
         addTab(
            data.createIngredient.returning[0].name,
            `/recipe/ingredients/${data.createIngredient.returning[0].id}`
         )
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })
   const [deleteIngredients] = useMutation(DELETE_INGREDIENTS, {
      onCompleted: () => {
         toast.success('Ingredient deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Failed to delete!')
      },
   })

   const createIngredientHandler = async () => {
      const name = `ingredient-${randomSuffix()}`
      createIngredient({ variables: { name } })
   }

   const deleteIngredientHandler = (e, ingredient) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete ingredient - ${ingredient.name}?`
         )
      ) {
         deleteIngredients({
            variables: {
               ids: [ingredient.id],
            },
         })
      }
   }

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('ingredients'))}</h1>
            <StyledPagination>Total: {ingredients?.length}</StyledPagination>
         </StyledHeader>
         <DataTable
            data={ingredients}
            addTab={addTab}
            deleteIngredientHandler={deleteIngredientHandler}
            createIngredientHandler={createIngredientHandler}
         />
      </StyledWrapper>
   )
}

function DataTable({
   data,
   addTab,
   deleteIngredientHandler,
   createIngredientHandler,
}) {
   const tableRef = React.useRef()

   const columns = [
      { title: 'Name', field: 'name', headerFilter: true },
      {
         title: 'Processings',
         field: 'ingredientProcessings',
         headerFilter: false,
         hozAlign: 'right',
         formatter: reactFormatter(<ProcessingCount />),
      },
      {
         title: 'Created At',
         field: 'createdAt',
         headerFilter: false,
         hozAlign: 'right',
         formatter: reactFormatter(<FormatDate />),
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteIngredientHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIngredient />),
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/recipe/ingredients/${id}`)
   }

   return (
      <>
         <StyledTableHeader>
            <TextButton
               type="outline"
               onClick={() => tableRef.current.table.clearHeaderFilter()}
            >
               Clear Filters
            </TextButton>

            <StyledTableActions>
               <IconButton type="solid" onClick={createIngredientHandler}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent>
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={data}
               rowClick={rowClick}
               options={tableOptions}
               data-custom-attr="test-custom-attribute"
               className="custom-css-class"
            />
         </StyledContent>
      </>
   )
}

function DeleteIngredient() {
   return <DeleteIcon color="#FF5A52" />
}

function FormatDate({
   cell: {
      _cell: { value },
   },
}) {
   return <>{value ? moment(value).format('LLL') : 'NA'}</>
}

export default IngredientsListing
