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
import { CUISINES, DELETE_CUISINES } from '../../../../graphql'
import tableOptions from '../../../Listings/tableOption'
import { Card, Layout, Listing, ListingHeader } from '../styled'
import { AddTypesTunnel } from './tunnels'

const address = 'apps.settings.views.forms.cuisines.'

const CuisineForm = () => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(CUISINES)

   // Mutation
   const [deleteElement] = useMutation(DELETE_CUISINES, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
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
         title: t(address.concat('name')),
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
               <AddTypesTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Layout>
            <Card>
               <div>
                  <Text as="title">{t(address.concat('cuisines'))}</Text>
               </div>
               <div>
                  <Text as="title">{data.cuisineNames.length}</Text>
                  <IconButton type="ghost" onClick={() => openTunnel(1)}>
                     <AddIcon color="#00A7E1" size={24} />
                  </IconButton>
               </div>
            </Card>
            <Listing>
               <ListingHeader>
                  <Text as="p">
                     {t(address.concat('cuisines'))} ({data.cuisineNames.length}
                     )
                  </Text>
                  <ComboButton type="solid" onClick={() => openTunnel(1)}>
                     <AddIcon size={24} /> Create Cuisine
                  </ComboButton>
               </ListingHeader>
               <ReactTabulator
                  columns={columns}
                  data={data.cuisineNames}
                  options={tableOptions}
               />
            </Listing>
         </Layout>
      </>
   )
}

export default CuisineForm
