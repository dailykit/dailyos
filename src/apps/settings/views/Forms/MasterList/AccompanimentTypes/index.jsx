import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'

// Components
import {
   Text,
   Table,
   TableHead,
   TableCell,
   TableBody,
   TableRow,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
   IconButton,
} from '@dailykit/ui'

// Styled
import { Layout, Card, Listing, ListingHeader } from '../styled'

// Icons
import {
   EditIcon,
   DeleteIcon,
   AddIcon,
} from '../../../../../../shared/assets/icons'

// Tunnels
import { AddTypesTunnel } from './tunnels'

import { useTranslation } from 'react-i18next'
import {
   ACCOMPANIMENT_TYPES,
   DELETE_ACCOMPANIMENT_TYPES,
} from '../../../../graphql'
import { toast } from 'react-toastify'

const address = 'apps.settings.views.forms.accompanimenttypes.'

const AccompanimentTypesForm = () => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(ACCOMPANIMENT_TYPES)

   // Mutation
   const [deleteElement] = useMutation(DELETE_ACCOMPANIMENT_TYPES, {
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

   if (error) {
      console.log(error)
   }
   if (loading) return <Loader />

   return (
      <React.Fragment>
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
               </ListingHeader>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>{t(address.concat('type'))}</TableCell>
                        <TableCell></TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.master_accompanimentType.map(type => (
                        <TableRow key={type.id}>
                           <TableCell>{type.name}</TableCell>
                           <TableCell>
                              <IconButton onClick={e => deleteHandler(e, type)}>
                                 <DeleteIcon color="#FF5A52" />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </Listing>
         </Layout>
      </React.Fragment>
   )
}

export default AccompanimentTypesForm
