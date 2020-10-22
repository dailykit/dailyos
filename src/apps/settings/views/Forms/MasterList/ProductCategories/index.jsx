import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ComboButton,
   IconButton,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import { AddIcon, DeleteIcon } from '../../../../../../shared/assets/icons'
import {
   PRODUCT_CATEGORIES,
   DELETE_PRODUCT_CATEGORY,
} from '../../../../graphql'
import tableOptions from '../../../Listings/tableOption'
import { Card, Layout, Listing, ListingHeader } from '../styled'
import { Add } from './tunnels'
import { logger } from '../../../../../../shared/utils'

const address = 'apps.settings.views.forms.accompanimenttypes.'

const ProductCategoriesForm = () => {
   const { t } = useTranslation()
   const tableRef = React.useRef()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(PRODUCT_CATEGORIES)

   // Mutation
   const [deleteElement] = useMutation(DELETE_PRODUCT_CATEGORY, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const deleteHandler = (e, el) => {
      e.stopPropagation()
      if (window.confirm(`Are you sure you want to delete - ${el.name}?`)) {
         deleteElement({
            variables: {
               ids: [el.id],
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
         cellClick: (e, cell) => {
            e.stopPropagation()
            const { id, name } = cell._cell.row.data
            deleteHandler(e, { id, name })
         },
         formatter: reactFormatter(<DeleteIcon color="#FF5A52" />),
      },
   ]

   if (error) {
      console.log(error)
   }
   if (loading) return <Loader />

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <Add closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
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
      </>
   )
}

export default ProductCategoriesForm
