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
import { PROCESSINGS, DELETE_PROCESSINGS } from '../../../../graphql'
import { toast } from 'react-toastify'

const address = 'apps.settings.views.forms.processings.'

const ProcessingsForm = () => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(PROCESSINGS)

   // Mutation
   const [deleteElement] = useMutation(DELETE_PROCESSINGS, {
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
                  <Text as="title">{t(address.concat('processings'))}</Text>
               </div>
               <div>
                  <Text as="title">{data.masterProcessings.length}</Text>
                  <span onClick={() => openTunnel(1)}>
                     <AddIcon color="#00A7E1" size={24} />
                  </span>
               </div>
            </Card>
            <Listing>
               <ListingHeader>
                  <Text as="p">
                     {t(address.concat('processings'))} (
                     {data.masterProcessings.length})
                  </Text>
               </ListingHeader>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>{t(address.concat('name'))}</TableCell>
                        <TableCell>
                           {t(address.concat('reference count'))}
                        </TableCell>
                        <TableCell></TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.masterProcessings.map(processing => (
                        <TableRow key={processing.id}>
                           <TableCell>{processing.name}</TableCell>
                           <TableCell>
                              {processing.ingredientProcessings.length}
                           </TableCell>
                           <TableCell>
                              <IconButton
                                 onClick={e => deleteHandler(e, processing)}
                              >
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

export default ProcessingsForm
