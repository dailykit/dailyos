import React from 'react'

// third party imports
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   ComboButton,
   Flex,
   IconButton,
   Loader,
   Spacer,
   Text,
   TextButton,
} from '@dailykit/ui'
import * as moment from 'moment'

// shared dir imports
import { Tooltip } from '../../../../../shared/components'
import { logger, randomSuffix } from '../../../../../shared/utils'

// graphql imports
import {
   CREATE_INGREDIENT,
   DELETE_INGREDIENTS,
   S_INGREDIENTS,
} from '../../../graphql'

// context imports
import { useTabs } from '../../../context'

// local imports
import { AddIcon, DeleteIcon } from '../../../assets/icons'
import Count from '../../../utils/countFormatter'
import tableOptions from '../tableOption'

const address = 'apps.recipe.views.listings.ingredientslisting.'

const IngredientsListing = () => {
   const { t } = useTranslation()
   const { addTab, tab } = useTabs()

   const { loading, data: { ingredients = [] } = {}, error } = useSubscription(
      S_INGREDIENTS
   )

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

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
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [deleteIngredients] = useMutation(DELETE_INGREDIENTS, {
      onCompleted: () => {
         toast.success('Ingredient deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      if (!tab) {
         addTab('Ingredients', '/recipe/ingredients')
      }
   }, [tab, addTab])

   const createIngredientHandler = async () => {
      const name = `ingredient-${randomSuffix()}`
      createIngredient({ variables: { name } })
   }

   const deleteIngredientHandler = ingredient => {
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
      <Flex maxWidth="1280px" margin="0 auto" width="calc(100vw - 64px)">
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            height="72px"
         >
            <Flex container>
               <Text as="h2">Ingredients({ingredients.length}) </Text>
               <Tooltip identifier="ingredients_list_heading" />
            </Flex>
         </Flex>
         <DataTable
            data={ingredients}
            addTab={addTab}
            deleteIngredientHandler={deleteIngredientHandler}
            createIngredientHandler={createIngredientHandler}
         />
      </Flex>
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
      {
         title: 'Name',
         field: 'name',
         headerFilter: true,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            addTab(name, `/recipe/ingredients/${id}`)
         },
      },
      { title: 'Category', field: 'category', headerFilter: true },
      {
         title: 'Processings',
         field: 'ingredientProcessings',
         headerFilter: false,
         hozAlign: 'right',
         formatter: reactFormatter(<Count />),
         width: 150,
      },
      {
         title: 'Sachets',
         field: 'ingredientSachets',
         headerFilter: false,
         hozAlign: 'right',
         formatter: reactFormatter(<Count />),
         width: 150,
      },
      {
         title: 'Created At',
         field: 'createdAt',
         headerFilter: false,
         hozAlign: 'right',
         formatter: reactFormatter(<FormatDate />),
         width: 250,
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         formatter: reactFormatter(
            <DeleteIngredient onDelete={deleteIngredientHandler} />
         ),
         width: 150,
      },
   ]

   return (
      <>
         <Flex container alignItems="center" justifyContent="space-between">
            <TextButton
               type="outline"
               onClick={() => tableRef.current.table.clearHeaderFilter()}
            >
               Clear Filters
            </TextButton>
            <ComboButton type="solid" onClick={createIngredientHandler}>
               <AddIcon color="#fff" size={24} /> Add Ingredient
            </ComboButton>
         </Flex>
         <Spacer size="16px" />
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={data}
            options={tableOptions}
            data-custom-attr="test-custom-attribute"
            className="custom-css-class"
         />
      </>
   )
}

function DeleteIngredient({ cell, onDelete }) {
   const ingredient = cell.getData()

   return (
      <IconButton type="ghost" onClick={() => onDelete(ingredient)}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}

function FormatDate({
   cell: {
      _cell: { value },
   },
}) {
   return <>{value ? moment(value).format('LLL') : 'NA'}</>
}

export default IngredientsListing
