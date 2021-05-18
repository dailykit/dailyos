import React from 'react'
import {
   ComboButton,
   Flex,
   IconButton,
   RadioGroup,
   Spacer,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
   ButtonGroup,
   Dropdown,
} from '@dailykit/ui'
// third party imports
import { useTranslation } from 'react-i18next'
// shared dir imports
import { InlineLoader, Tooltip } from '../../../../../shared/components'
import { useTabs, useTooltip } from '../../../../../shared/providers'
// local imports
import { AddIcon } from '../../../assets/icons'
import { ResponsiveFlex } from '../styled'
import { ProductTypeTunnel, BulkActionsTunnel } from './tunnels'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { PRODUCTS } from '../../../graphql'
import { toast } from 'react-toastify'
import { logger } from '../../../../../shared/utils'
import tableOptions from '../tableOption'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import FilterIcon from '../../../assets/icons/Filter'

const address = 'apps.menu.views.listings.productslisting.'

const ProductsListing = () => {
   const { t } = useTranslation()
   const { tab, addTab } = useTabs()
   const { tooltip } = useTooltip()

   const tableRef = React.useRef()
   const [view, setView] = React.useState('simple')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(3)
   const [selectedRows, setSelectedRows] = React.useState([])

   const options = [
      { id: 'simple', title: 'Simple' },
      { id: 'customizable', title: t(address.concat('customizable')) },
      { id: 'combo', title: t(address.concat('combo')) },
   ]

   React.useEffect(() => {
      if (!tab) {
         addTab('Products', `/products/products`)
      }
   }, [tab, addTab])

   const { data: { products = [] } = {}, loading } = useSubscription(
      PRODUCTS.LIST,
      {
         variables: {
            where: {
               type: { _eq: view },
               isArchived: { _eq: false },
            },
         },
      }
   )

   const [deleteProduct] = useMutation(PRODUCTS.DELETE, {
      onCompleted: () => {
         toast.success('Product deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handler
   const deleteProductHandler = product => {
      if (
         window.confirm(
            `Are you sure you want to delete product - ${product.name}?`
         )
      ) {
         deleteProduct({
            variables: {
               id: product.id,
            },
         })
      }
   }

   const removeSelectedRow = id => {
      tableRef.current.removeSelectedRow(id)
      console.log(tableRef.current.table)
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="lg">
               <BulkActionsTunnel
                  close={closeTunnel}
                  selectedRows={selectedRows}
                  removeSelectedRow={removeSelectedRow}
               />
            </Tunnel>
            <Tunnel layer={2}></Tunnel>
            <Tunnel layer={3}>
               <ProductTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <ResponsiveFlex maxWidth="1280px" margin="0 auto">
            <Flex
               container
               alignItems="center"
               justifyContent="space-between"
               height="72px"
            >
               <Flex container alignItems="center">
                  <Text as="h2">{t(address.concat('products'))}</Text>
                  <Tooltip identifier="products_list_heading" />
               </Flex>
               <ComboButton type="solid" onClick={() => openTunnel(3)}>
                  <AddIcon color="#fff" size={24} /> Add Product
               </ComboButton>
            </Flex>
            <RadioGroup
               options={options}
               active={view}
               onChange={option => setView(option.id)}
            />
            <Spacer size="16px" />
            {loading ? (
               <InlineLoader />
            ) : (
               <DataTable
                  ref={tableRef}
                  data={products}
                  addTab={addTab}
                  openTunnel={openTunnel}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  deleteProductHandler={deleteProductHandler}
                  t={t}
                  view={view}
               />
            )}
         </ResponsiveFlex>
      </>
   )
}
class DataTable extends React.Component {
   constructor(props) {
      super(props)
      this.tableRef = React.createRef()
      this.handleRowSelection = this.handleRowSelection.bind(this)
   }
   newColumns = [
      {
         formatter: 'rowSelection',
         titleFormatter: 'rowSelection',
         align: 'center',
         headerSort: false,
         width: 10,
      },
      {
         title: this.props.t(address.concat('product name')),
         field: 'name',
         headerFilter: true,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            this.props.addTab(name, `/products/products/${id}`)
         },
         cssClass: 'colHover',
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
            <DeleteProduct onDelete={this.props.deleteIngredientHandler} />
         ),

         width: 150,
      },
   ]
   groupByOptions = [{ id: 1, title: 'isPublished' }]

   handleRowSelection = rows => {
      this.props.setSelectedRows(rows)
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
            <ActionBar
               title={`${this.props.view} product`}
               groupByOptions={this.groupByOptions}
               selectedRows={this.props.selectedRows}
               openTunnel={this.props.openTunnel}
               handleGroupBy={this.handleGroupBy}
               clearHeaderFilter={this.clearHeaderFilter}
            />
            <Spacer size="30px" />

            <ReactTabulator
               ref={this.tableRef}
               columns={this.newColumns}
               data={this.props.data}
               options={tableOptions}
               selectableCheck={() => true}
               rowSelectionChanged={(data, components) => {
                  this.handleRowSelection(data)
               }}
               data-custom-attr="test-custom-attribute"
               className="custom-css-class"
            />
         </>
      )
   }
}
const ActionBar = ({
   title,
   groupByOptions,
   selectedRows,
   openTunnel,
   handleGroupBy,
   clearHeaderFilter,
}) => {
   const selectedOption = option => {
      const newOptions = option.map(x => x.title)
      handleGroupBy(newOptions)
   }
   const searchedOption = option => console.log(option)
   console.log('in action bar', selectedRows)
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
                     ? `No ${title}`
                     : selectedRows.length == 1
                     ? `${selectedRows.length} ${title}`
                     : `${selectedRows.length} ${title}s`}{' '}
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
export default ProductsListing

function DeleteProduct({ cell, onDelete }) {
   const product = cell.getData()

   return (
      <IconButton type="ghost" onClick={() => onDelete(product)}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}
