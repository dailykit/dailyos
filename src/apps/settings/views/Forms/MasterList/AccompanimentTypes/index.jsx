import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   IconButton,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { toast } from 'react-toastify'
import { AddIcon, DeleteIcon } from '../../../../../../shared/assets/icons'
import {
   ACCOMPANIMENT_TYPES,
   DELETE_ACCOMPANIMENT_TYPES,
} from '../../../../graphql'
import tableOptions from '../../../Listings/tableOption'
import { Card, Layout, Listing, ListingHeader } from '../styled'
import { AddTypesTunnel } from './tunnels'

const address = 'apps.settings.views.forms.accompanimenttypes.'

const AccompanimentTypesForm = () => {
   const { t } = useTranslation()
   const tableRef = React.useRef()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(ACCOMPANIMENT_TYPES)

   // Mutation
   const [deleteElement] = useMutation(DELETE_ACCOMPANIMENT_TYPES, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: err => {
         console.log(err)
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
               <AddTypesTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Layout>
            <Card>
               <div>
                  <Text as="title">
                     {t(address.concat('accompaniment types'))}
                  </Text>
               </div>
               <div>
                  <Text as="title">{data.master_accompanimentType.length}</Text>
                  <span onClick={() => openTunnel(1)}>
                     <AddIcon color="#00A7E1" size={24} />
                  </span>
               </div>
            </Card>
            <Listing>
               <ListingHeader>
                  <Text as="p">
                     {t(address.concat('accompaniment types'))} (
                     {data.master_accompanimentType.length})
                  </Text>
                  <IconButton type="solid" onClick={() => openTunnel(1)}>
                     <AddIcon size={24} />
                  </IconButton>
               </ListingHeader>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={data.master_accompanimentType}
                  options={tableOptions}
               />
            </Listing>
         </Layout>
      </>
   )
}

export default AccompanimentTypesForm
