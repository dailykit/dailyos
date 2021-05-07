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
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../shared/components'
import { useTooltip, useTabs } from '../../../../../shared/providers'
import { logger, randomSuffix } from '../../../../../shared/utils'
import { AddIcon, DeleteIcon } from '../../../assets/icons'
import { BulkActionsTunnel } from './tunnels'
import {
   CREATE_SIMPLE_RECIPE,
   DELETE_SIMPLE_RECIPES,
   S_RECIPES,
} from '../../../graphql'
import ServingsCount from '../../../utils/countFormatter'
import tableOptions from '../tableOption'
import { ResponsiveFlex } from '../styled'

const address = 'apps.products.views.listings.recipeslisting.'

const RecipesListing = () => {
   const { t } = useTranslation()
   const { addTab, tab } = useTabs()
   const [selectedRows, setSelectedRows] = React.useState([])

   // Queries and Mutations
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const {
      loading,
      data: { simpleRecipes: recipes = [] } = {},
      error,
   } = useSubscription(S_RECIPES)

   const [createRecipe] = useMutation(CREATE_SIMPLE_RECIPE, {
      onCompleted: input => {
         addTab(
            input.createSimpleRecipe.returning[0].name,
            `/products/recipes/${input.createSimpleRecipe.returning[0].id}`
         )
         toast.success('Recipe added!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [deleteRecipes] = useMutation(DELETE_SIMPLE_RECIPES, {
      onCompleted: () => {
         toast.success('Recipe deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      if (!tab) {
         addTab('Recipes', '/products/recipes')
      }
   }, [tab, addTab])

   // Handlers
   const createRecipeHandler = () => {
      const name = `recipe-${randomSuffix()}`
      createRecipe({ variables: { objects: { name } } })
   }

   const deleteRecipeHandler = recipe => {
      const confirmed = window.confirm(
         `Are you sure you want to delete recipe - ${recipe.name}?`
      )
      if (confirmed) {
         deleteRecipes({
            variables: {
               ids: [recipe.id],
            },
         })
      }
   }

   if (!loading && error) {
      toast.error('Failed to fetch Recipes!')
      logger(error)
      return <ErrorState />
   }
   console.log('this is selected rows', selectedRows)
   return (
      <ResponsiveFlex maxWidth="1280px" margin="0 auto">
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="lg">
               <BulkActionsTunnel
                  close={closeTunnel}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
               />
            </Tunnel>
         </Tunnels>
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            height="72px"
         >
            <Flex container alignItems="center">
               <Text as="h2">
                  {t(address.concat('recipes'))}({recipes.length})
               </Text>
               <Tooltip identifier="recipes_list_heading" />
            </Flex>
         </Flex>
         {loading ? (
            <InlineLoader />
         ) : (
            <DataTable
               openTunnel={openTunnel}
               data={recipes}
               addTab={addTab}
               deleteRecipeHandler={deleteRecipeHandler}
               createRecipeHandler={createRecipeHandler}
               selectedRows={selectedRows}
               setSelectedRows={setSelectedRows}
            />
         )}
      </ResponsiveFlex>
   )
}

class DataTable extends React.Component {
   constructor(props) {
      super(props)
      this.tableRef = React.createRef()
      this.handleRowSelection = this.handleRowSelection.bind(this)
   }
   columns = [
      {
         formatter: 'rowSelection',
         titleFormatter: 'rowSelection',
         hozAlign: 'center',
         headerSort: false,
         width: 15,
      },
      {
         title: 'Name',
         field: 'name',
         headerFilter: true,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            this.props.addTab(name, `/products/recipes/${id}`)
         },
         cssClass: 'colHover',
      },
      { title: 'Author', field: 'author', headerFilter: true },
      {
         title: 'Cooking Time',
         field: 'cookingTime',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: '# of Servings',
         field: 'simpleRecipeYields',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         formatter: reactFormatter(<ServingsCount />),
         width: 150,
      },
      {
         title: 'Published',
         field: 'isPublished',
         formatter: 'tickCross',
         hozAlign: 'center',
         headerHozAlign: 'center',
         width: 150,
         headerFilter: true,
      },
      {
         title: 'Actions',
         headerSort: false,
         headerFilter: false,
         hozAlign: 'center',
         headerHozAlign: 'center',
         formatter: reactFormatter(
            <DeleteRecipe onDelete={this.props.deleteRecipeHandler} />
         ),
         width: 150,
      },
   ]
   handleRowSelection = rows => {
      this.props.setSelectedRows(rows)
   }
   render() {
      return (
         <>
            <Flex container alignItems="center" justifyContent="space-between">
               <TextButton
                  type="outline"
                  onClick={() =>
                     this.tableRef.current.table.clearHeaderFilter()
                  }
               >
                  Clear Filters
               </TextButton>
               <ComboButton
                  type="solid"
                  onClick={this.props.createRecipeHandler}
               >
                  <AddIcon color="#fff" size={24} /> Create Recipe
               </ComboButton>
            </Flex>
            {this.props.selectedRows.length > 0 && (
               <ActionBar
                  selectedRows={this.props.selectedRows}
                  openTunnel={this.props.openTunnel}
               />
            )}
            <Spacer size="16px" />
            <ReactTabulator
               ref={this.tableRef}
               columns={this.columns}
               data={this.props.data}
               selectableCheck={() => true}
               rowSelectionChanged={(data, components) => {
                  this.handleRowSelection(data)
               }}
               options={tableOptions}
               data-custom-attr="test-custom-attribute"
               className="custom-css-class"
            />
         </>
      )
   }
}

function DeleteRecipe({ cell, onDelete }) {
   const recipe = cell.getData()

   return (
      <IconButton type="ghost" onClick={() => onDelete(recipe)}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}

function ActionBar({ selectedRows, openTunnel }) {
   return (
      <>
         <p style={{ padding: '10px', marginTop: '30px' }}>
            <span
               style={{
                  color: '#919699',
                  fontStyle: 'italic',
                  fontWeight: '500',
                  marginRight: '20px',
               }}
            >
               {selectedRows.length}{' '}
               {selectedRows.length > 1 ? 'recipes' : 'recipe'} selected{' '}
            </span>
            <span
               onClick={() => openTunnel(1)}
               style={{
                  cursor: 'pointer',
                  color: '#367BF5',
                  fontWeight: '700',
               }}
            >
               APPLY BULK ACTIONS
            </span>
         </p>
      </>
   )
}

export default RecipesListing
