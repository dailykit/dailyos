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
   Form,
   Checkbox,
   TunnelHeader,
   Context,
   ContextualMenu,
   typeOf,
} from '@dailykit/ui'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
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

   // const [recipes, setRecipes] = React.useState([])

   let {
      loading,
      data: { simpleRecipes: recipes = [] } = {},
      error,
   } = useSubscription(S_RECIPES)

   // if (recipes.length > 0) {
   //    const updatedRecipes = recipes.map(recipe => {
   //       recipe.simpleRecipeYieldsLength = recipe.simpleRecipeYields.length
   //       return recipe
   //    })
   //    recipes = [...updatedRecipes]
   // }

   // let recipes = []

   // const { loading, error } = useSubscription(S_RECIPES, {
   //    onSubscriptionData: data => {
   //       const { simpleRecipes } = data.subscriptionData.data
   //       const updatedRecipes = simpleRecipes.map(recipe => {
   //          recipe.simpleRecipeYieldsLength = recipe.simpleRecipeYields.length
   //          return recipe
   //       })

   //       console.log('up', updatedRecipes)
   //       recipes = updatedRecipes
   //    },
   // })

   console.log('re', recipes)

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

   console.log('data', recipes)
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
         groups: [localStorage.getItem('tabulator-recipe_table-group')],
      }
      this.tableRef = React.createRef()
      this.handleRowSelection = this.handleRowSelection.bind(this)
   }

   // componentDidMount() {
   //    // console.log('local', JSON.parse(localStorage.getItem('rows-schema')))
   //    var selectedRowsId = JSON.parse(localStorage.getItem('rows-schema'))
   //    console.log(typeof selectedRowsId)

   //    // console.log('table', this.tableRef.current)
   //    // console.log('id', selectedRowsId)
   //    // console.log('is', Array.isArray(selectedRowsId))
   //    if (Array.isArray(selectedRowsId) && selectedRowsId.length > 0) {
   //       console.log('h1llon')
   //       if (this.tableRef.current !== null) {
   //          console.log('h1llonkjn')
   //          console.log('table', this.tableRef.current.table)
   //          this.tableRef.current.table.selectRow([1064, 1008])
   //       }
   //    }
   //    // this.props.setSelectedRows(localStorage.getItem('rows-schema'))
   // }

   columns = [
      {
         formatter: 'rowSelection',
         // titleFormatter: 'tickcross',
         titleFormatter: reactFormatter(<Selection />),
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
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            this.props.addTab(name, `/products/recipes/${id}`)
         },
         cssClass: 'colHover',
         resizable: 'true',
         maxWidth: 400,
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
         title: 'Cuisine type',
         field: 'cuisine',
         headerFilter: true,
         hozAlign: 'left',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: '# of Servings',
         field: 'simpleRecipeYields.aggregate.count',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         // formatter: reactFormatter(<ServingsCount />),
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
      {
         title: 'Actions',
         headerSort: false,
         headerFilter: false,
         hozAlign: 'center',
         download: false,
         frozen: true,
         headerHozAlign: 'center',
         formatter: reactFormatter(
            <DeleteRecipe onDelete={this.props.deleteRecipeHandler} />
         ),
         width: 80,
      },
   ]
   handleRowSelection = ({ _row }) => {
      console.log(_row.getData())
      this.props.setSelectedRows(prevState => [...prevState, _row.getData()])

      let newData = [...this.props.selectedRows.map(row => row.id)]
      localStorage.setItem(
         'selected-rows-id_recipe_table',
         JSON.stringify(newData)
      )
   }

   handleDeSelection = ({ _row }) => {
      const data = _row.getData()
      console.log('de', _row.getData())
      this.props.setSelectedRows(prevState =>
         prevState.filter(row => row.id != data.id)
      )
      localStorage.setItem(
         'selected-rows-id_recipe_table',
         JSON.stringify(this.props.selectedRows.map(row => row.id))
      )
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

   downloadCsvData = () => {
      this.tableRef.current.table.download('csv', 'recipe_table.csv')
   }

   downloadPdfData = () => {
      this.tableRef.current.table.downloadToTab('pdf', 'recipe_table.pdf')
   }

   downloadXlsxData = () => {
      this.tableRef.current.table.download('xlsx', 'recipe_table.xlsx')
   }

   selectRows = () => {
      const selectedRowsId =
         localStorage.getItem('selected-rows-id_recipe_table') || '[]'
      this.tableRef.current.table.selectRow(JSON.parse(selectedRowsId))
      if (JSON.parse(selectedRowsId).length > 0) {
         let newArr = []
         JSON.parse(selectedRowsId).forEach(x => {
            const newFind = this.props.data.find(y => y.id == x)
            newArr = [...newArr, newFind]
         })
         this.props.setSelectedRows(newArr)
      }
   }

   handleMultipleRowSelection = () => {
      console.log('checkbox')
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

            <Spacer size="24px" />
            <Flex container as="header" width="100%" justifyContent="flex-end">
               <TextButton
                  onClick={this.downloadCsvData}
                  type="solid"
                  size="sm"
               >
                  Download CSV
               </TextButton>
               <Spacer size="10px" xAxis />
               <TextButton
                  onClick={this.downloadPdfData}
                  type="solid"
                  size="sm"
               >
                  Download PDF
               </TextButton>
               <Spacer size="10px" xAxis />
               <TextButton
                  onClick={this.downloadXlsxData}
                  type="solid"
                  size="sm"
               >
                  Download XLSX
               </TextButton>
            </Flex>

            <Spacer size="30px" />
            <ReactTabulator
               ref={this.tableRef}
               dataLoaded={this.selectRows}
               columns={this.columns}
               data={this.props.data}
               selectableCheck={() => true}
               // rowSelectionChanged={(data, components) => {
               //    this.handleRowSelection(data)
               // }}
               rowSelected={this.handleRowSelection}
               rowDeselected={this.handleDeSelection}
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
      // <ContextualMenu>
      //    <Context
      //       title="This is context 1"
      //       handleClick={() => console.log('Context1')}
      //    >
      //       <p>This is things could be done</p>
      //       <TextButton type="solid" size="sm">
      //          Update
      //       </TextButton>
      //    </Context>
      //    <Context
      //       title="This is context 2"
      //       handleClick={() => console.log('Context2')}
      //    />
      // </ContextualMenu>
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

function Selection() {
   const [checked, setChecked] = React.useState(true)

   const handleMultipleRowSelection = () => {
      setChecked(!checked)
      console.log('handleMultipleRowSelection')
   }
   return (
      <Checkbox
         id="label"
         checked={checked}
         onChange={handleMultipleRowSelection}
      ></Checkbox>
   )
}

function RecipeName({ cell, addTab }) {
   const data = cell.getData()
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
                  // onClick={(e, cell) => {
                  //    const { name, id } = data
                  //    addTab(name, `/products/recipes/${id}`)
                  //    console.log('hi')
                  // }}

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
               {/* <ContextualMenu>
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
               </ContextualMenu> */}
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
