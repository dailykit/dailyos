import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import {
   ComboButton,
   Flex,
   IconButton,
   Spacer,
   Text,
   TextButton,
} from '@dailykit/ui'
import * as moment from 'moment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
   InsightDashboard,
} from '../../../../../shared/components'
import { useTooltip, useTabs } from '../../../../../shared/providers'
import { logger, randomSuffix } from '../../../../../shared/utils'
import { AddIcon, DeleteIcon } from '../../../assets/icons'
import {
   CREATE_INGREDIENT,
   DELETE_INGREDIENTS,
   S_INGREDIENTS,
} from '../../../graphql'
import Count from '../../../utils/countFormatter'
import tableOptions from '../tableOption'
import { ResponsiveFlex } from '../styled'

const address = 'apps.products.views.listings.ingredientslisting.'

const IngredientsListing = () => {
   const { t } = useTranslation()
   const { addTab, tab } = useTabs()

   const { loading, data: { ingredients = [] } = {}, error } = useSubscription(
      S_INGREDIENTS
   )

   // Mutations
   const [createIngredient] = useMutation(CREATE_INGREDIENT, {
      onCompleted: data => {
         toast.success('Ingredient created!')
         addTab(
            data.createIngredient.returning[0].name,
            `/products/ingredients/${data.createIngredient.returning[0].id}`
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
         addTab('Ingredients', '/products/ingredients')
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

   if (!loading && error) {
      toast.error('Failed to fetch Ingredients!')
      logger(error)
      return <ErrorState />
   }

   return (
      <ResponsiveFlex maxWidth="1280px" margin="0 auto">
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
         {loading ? (
            <InlineLoader />
         ) : (
            <DataTable
               data={ingredients}
               addTab={addTab}
               deleteIngredientHandler={deleteIngredientHandler}
               createIngredientHandler={createIngredientHandler}
            />
         )}
      </ResponsiveFlex>
   )
}

function DataTable({
   data,
   addTab,
   deleteIngredientHandler,
   createIngredientHandler,
}) {
   const tableRef = React.useRef()
   const { tooltip } = useTooltip()

   const columns = [
      {
         title: 'Name',
         field: 'name',
         headerFilter: true,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            addTab(name, `/products/ingredients/${id}`)
         },
         cssClass: 'colHover',
         headerTooltip: function (column) {
            const identifier = 'ingredients_listing_name_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
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
         title: 'Published',
         field: 'isPublished',
         formatter: 'tickCross',
         hozAlign: 'center',
         headerHozAlign: 'center',
         width: 150,
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
         <InsightDashboard
            appTitle="Products App"
            moduleTitle="Ingredient Listing"
            showInTunnel={false}
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
