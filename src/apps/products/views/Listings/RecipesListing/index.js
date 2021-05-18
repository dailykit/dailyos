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
   ButtonGroup,
   Dropdown,
   Tunnel,
   Tunnels,
   useTunnel,
   TunnelHeader,
   Context,
   ContextualMenu,
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
import { BulkActionsTunnel, ApplyFilterTunnel } from './tunnels'
import {
   CREATE_SIMPLE_RECIPE,
   DELETE_SIMPLE_RECIPES,
   S_RECIPES,
} from '../../../graphql'
import ServingsCount from '../../../utils/countFormatter'
import tableOptions from '../tableOption'
import { ResponsiveFlex } from '../styled'
import { useRef } from 'react'
import { FilterIcon, PublishIcon, UnPublishIcon } from '../../../assets/icons'

const address = 'apps.products.views.listings.recipeslisting.'

const RecipesListing = () => {
   const dataTableRef = useRef()
   const { t } = useTranslation()
   const { addTab, tab } = useTabs()
   const [selectedRows, setSelectedRows] = React.useState([])

   const [tunnels, openTunnel, closeTunnel, visible] = useTunnel(2)
   // Queries and Mutations

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

   const removeSelectedRow = id => {
      dataTableRef.current.removeSelectedRow(id)
   }

   if (!loading && error) {
      toast.error('Failed to fetch Recipes!')
      logger(error)
      return <ErrorState />
   }
   return (
      <ResponsiveFlex maxWidth="1280px" margin="0 auto">
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="lg">
               <BulkActionsTunnel
                  removeSelectedRow={removeSelectedRow}
                  close={closeTunnel}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
               />
            </Tunnel>
            <Tunnel layer={2} size="lg" visible={visible}>
               <ApplyFilterTunnel close={closeTunnel} />
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
            <ComboButton type="solid" onClick={createRecipeHandler}>
               <AddIcon color="#fff" size={24} /> Create Recipe
            </ComboButton>
         </Flex>
         {loading ? (
            <InlineLoader />
         ) : (
            <DataTable
               ref={dataTableRef}
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
      this.state = {
         groups: [],
      }
      this.tableRef = React.createRef()
      this.handleRowSelection = this.handleRowSelection.bind(this)
   }
   columns = [
      {
         formatter: 'rowSelection',
         titleFormatter: 'rowSelection',
         hozAlign: 'center',
         headerSort: false,
         frozen: true,
         width: 15,
      },
      {
         title: 'Name',
         field: 'name',
         width: 400,
         frozen: true,
         headerFilter: true,
         formatter: reactFormatter(<RecipeName />),
         // cellClick: (e, cell) => {
         //    const { name, id } = cell._cell.row.data
         //    this.props.addTab(name, `/products/recipes/${id}`)
         // },
         cssClass: 'colHover',
      },
      { title: 'Author', field: 'author', headerFilter: true },
      {
         title: 'Cooking Time',
         field: 'cookingTime',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
      },
      {
         title: 'Cuisine type',
         field: 'cuisine',
         headerFilter: true,
         hozAlign: 'left',
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
      // {
      //    title: 'Published',
      //    field: 'isPublished',
      //    // formatter: 'tickCross',
      //    // frozen: true,
      //    hozAlign: 'center',
      //    headerHozAlign: 'center',
      //    formatter: reactFormatter(<PublishStatus />),
      //    width: 150,
      //    headerFilter: true,
      // },
      // {
      //    title: 'Actions',
      //    headerSort: false,
      //    headerFilter: false,
      //    hozAlign: 'center',
      //    // frozen: true,
      //    headerHozAlign: 'center',
      //    formatter: reactFormatter(
      //       <DeleteRecipe onDelete={this.props.deleteRecipeHandler} />
      //    ),
      //    width: 100,
      // },
   ]
   handleRowSelection = rows => {
      this.props.setSelectedRows(rows)
      localStorage.setItem('rows', rows)
   }

   removeSelectedRow = id => {
      this.tableRef.current.table.deselectRow(id)
   }
   handleGroupBy = value => {
      this.setState(
         {
            groups: value,
         },
         () => {
            console.log('value', value)
            console.log('group', JSON.stringify(this.state.groups))
            this.tableRef.current.table.setGroupBy(this.state.groups)
         }
      )
   }
   clearHeaderFilter = () => {
      this.tableRef.current.table.clearHeaderFilter()
   }
   render() {
      return (
         <>
            <Spacer size="5px" />
            <ActionBar
               selectedRows={this.props.selectedRows}
               openTunnel={this.props.openTunnel}
               handleGroupBy={this.handleGroupBy}
               clearHeaderFilter={this.clearHeaderFilter}
            />
            <Spacer size="30px" />
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
      // <IconButton type="ghost" onClick={() => onDelete(recipe)}>
      //    <DeleteIcon color="#FF5A52" />
      // </IconButton>
      <ContextualMenu>
         <Context
            title="This is context 1"
            handleClick={() => console.log('Context1')}
         >
            <p>This is things could be done</p>
            <TextButton type="solid" size="sm">
               Update
            </TextButton>
         </Context>
         <Context
            title="This is context 2"
            handleClick={() => console.log('Context2')}
         />
      </ContextualMenu>
   )
}

function PublishStatus({ cell }) {
   const data = cell.getData()
   return (
      <Flex
         container
         width="100%"
         justifyContent="space-between"
         alignItems="center"
      >
         <IconButton type="ghost">
            {data.isPublished ? <PublishIcon /> : <UnPublishIcon />}
         </IconButton>
      </Flex>
   )
}

function RecipeName({ cell }) {
   const data = cell.getData()
   console.log('cell', data)
   return (
      <>
         <Flex
            container
            width="100%"
            justifyContent="space-between"
            alignItems="center"
         >
            <Flex
               container
               width="100%"
               justifyContent="flex-end"
               alignItems="center"
            >
               <p
                  style={{
                     width: '200px',
                     whiteSpace: 'nowrap',
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                  }}
                  onClick={() => console.log('hi')}

                  // onClick(e, cell) => {
                  //    const { name, id } = cell._cell.row.data
                  //    this.props.addTab(name, `/products/recipes/${id}`)
                  // }
               >
                  {cell._cell.value}
               </p>
            </Flex>

            <Flex
               container
               width="100%"
               justifyContent="space-between"
               alignItems="center"
            >
               <IconButton type="ghost">
                  {data.isPublished ? <PublishIcon /> : <UnPublishIcon />}
               </IconButton>
               <ContextualMenu>
                  <Context
                     title="This is context 1"
                     handleClick={() => console.log('Context1')}
                  >
                     <p>This is things could be done</p>
                     <TextButton type="solid" size="sm">
                        Update
                     </TextButton>
                  </Context>
                  <Context
                     title="This is context 2"
                     handleClick={() => console.log('Context2')}
                  />
               </ContextualMenu>
            </Flex>
         </Flex>
      </>
   )
}

const ActionBar = ({
   selectedRows,
   openTunnel,
   handleGroupBy,
   clearHeaderFilter,
}) => {
   const [groupByOptions] = React.useState([
      { id: 1, title: 'isPublished' },
      { id: 2, title: 'cuisine' },
      { id: 3, title: 'author' },
   ])
   const selectedOption = option => {
      const newOptions = option.map(x => x.title)
      handleGroupBy(newOptions)
   }
   const searchedOption = option => console.log(option)
   return (
      <>
         <Flex
            container
            as="header"
            width="100%"
            justifyContent="space-between"
         >
            <Flex
               container
               as="header"
               width="30%"
               alignItems="center"
               justifyContent="space-between"
            >
               <Text as="subtitle">
                  {selectedRows.length == 0
                     ? 'No recipe'
                     : selectedRows.length == 1
                     ? `${selectedRows.length} recipe`
                     : `${selectedRows.length} recipes`}{' '}
                  selected
               </Text>

               <ButtonGroup align="left">
                  <TextButton
                     type="ghost"
                     size="sm"
                     disabled={selectedRows.length === 0 ? true : false}
                     onClick={() => openTunnel(1)}
                  >
                     APPLY BULK ACTIONS
                  </TextButton>
               </ButtonGroup>
            </Flex>
            <Flex
               container
               as="header"
               width="70%"
               alignItems="center"
               justifyContent="space-around"
            >
               <Flex
                  container
                  as="header"
                  width="70%"
                  alignItems="center"
                  justifyContent="flex-end"
               >
                  <Text as="text1">Group By:</Text>
                  <Spacer size="5px" xAxis />
                  <Dropdown
                     type="multi"
                     variant="revamp"
                     disabled={true}
                     options={groupByOptions}
                     searchedOption={searchedOption}
                     selectedOption={selectedOption}
                     typeName="cuisine"
                  />
               </Flex>
               <Flex
                  container
                  as="header"
                  width="30%"
                  alignItems="center"
                  justifyContent="flex-end"
               >
                  <Text as="text1">Apply Filter:</Text>
                  <Spacer size="5px" xAxis />
                  <IconButton
                     type="ghost"
                     size="sm"
                     onClick={() => openTunnel(2)}
                  >
                     <FilterIcon />
                  </IconButton>
                  <ButtonGroup align="left">
                     <TextButton
                        type="ghost"
                        size="sm"
                        onClick={() => clearHeaderFilter()}
                     >
                        Clear
                     </TextButton>
                  </ButtonGroup>
               </Flex>
            </Flex>
         </Flex>
      </>
   )
}

export default RecipesListing
