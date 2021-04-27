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
} from '@dailykit/ui'
// third party imports
import { useTranslation } from 'react-i18next'
// shared dir imports
import {
   InlineLoader,
   Tooltip,
   InsightDashboard,
} from '../../../../../shared/components'
import { useTabs, useTooltip } from '../../../../../shared/providers'
// local imports
import { AddIcon } from '../../../assets/icons'
import { ResponsiveFlex } from '../styled'
import { ProductTypeTunnel } from './tunnels'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { PRODUCTS } from '../../../graphql'
import { toast } from 'react-toastify'
import { logger } from '../../../../../shared/utils'
import tableOptions from '../tableOption'
import { DeleteIcon } from '../../../../../shared/assets/icons'

const address = 'apps.menu.views.listings.productslisting.'

const ProductsListing = () => {
   const { t } = useTranslation()
   const { tab, addTab } = useTabs()
   const { tooltip } = useTooltip()

   const tableRef = React.useRef()
   const [view, setView] = React.useState('simple')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

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

   const columns = [
      {
         title: t(address.concat('product name')),
         field: 'name',
         headerFilter: true,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            addTab(name, `/products/products/${id}`)
         },
         cssClass: 'colHover',
         headerTooltip: function (column) {
            const identifier = 'products_listing_name_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
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
            <DeleteProduct onDelete={deleteProductHandler} />
         ),
         width: 150,
      },
   ]

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
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
               <ComboButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} /> Add Product
               </ComboButton>
            </Flex>
            <RadioGroup
               options={options}
               active={view}
               onChange={option => setView(option.id)}
            />
            <Spacer size="16px" />
            <TextButton
               type="outline"
               onClick={() => tableRef.current.table.clearHeaderFilter()}
            >
               Clear Filters
            </TextButton>
            <Spacer size="16px" />
            {loading ? (
               <InlineLoader />
            ) : (
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={products}
                  options={tableOptions}
               />
            )}
            <InsightDashboard
               appTitle="Products App"
               moduleTitle="Product Listing"
               showInTunnel={false}
            />
         </ResponsiveFlex>
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
