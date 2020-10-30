import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import {
   ComboButton,
   IconButton,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { ErrorBoundary } from '@sentry/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AddIcon, DeleteIcon } from '../../../../../../shared/assets/icons'
import { InlineLoader } from '../../../../../../shared/components'
import { logger } from '../../../../../../shared/utils'
import { MASTER } from '../../../../graphql'
import tableOptions from '../../../Listings/tableOption'
import { Card, Layout, Listing, ListingHeader } from '../styled'
import { Add } from './tunnels'

const address = 'apps.settings.views.forms.accompanimenttypes.'

const ProductCategoriesForm = () => {
   const { t } = useTranslation()
   const tableRef = React.useRef()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(
      MASTER.PRODUCT_CATEGORY.LIST
   )

   // Mutation
   const [deleteElement] = useMutation(MASTER.PRODUCT_CATEGORY.DELETE, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const deleteHandler = el => {
      if (window.confirm(`Are you sure you want to delete - ${el.name}?`)) {
         deleteElement({
            variables: {
               where: {
                  name: { _eq: el.name },
               },
            },
         })
      }
   }

   const columns = [
      {
         title: t(address.concat('type')),
         field: 'name',
         headerFilter: true,
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cssClass: 'center-text',
         formatter: reactFormatter(<DeleteCategory onDelete={deleteHandler} />),
      },
   ]

   if (!loading && error) return <ErrorBoundary rootRoute="/apps/settings" />

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <Add closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         {loading ? (
            <InlineLoader />
         ) : (
            <Layout>
               <Card>
                  <div>
                     <Text as="title">Product Categories</Text>
                  </div>
                  <div>
                     <Text as="title">{data.productCategories.length}</Text>
                     <IconButton type="ghost" onClick={() => openTunnel(1)}>
                        <AddIcon color="#00A7E1" size={24} />
                     </IconButton>
                  </div>
               </Card>
               <Listing>
                  <ListingHeader>
                     <Text as="p">
                        Product Categories ({data.productCategories.length})
                     </Text>
                     <ComboButton type="solid" onClick={() => openTunnel(1)}>
                        <AddIcon size={24} /> Create Product Category
                     </ComboButton>
                  </ListingHeader>
                  <ReactTabulator
                     ref={tableRef}
                     columns={columns}
                     data={data.productCategories}
                     options={tableOptions}
                  />
               </Listing>
            </Layout>
         )}
      </>
   )
}

export default ProductCategoriesForm

function DeleteCategory({ cell, onDelete }) {
   const category = cell.getData()

   return (
      <IconButton type="ghost" onClick={() => onDelete(category)}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}
