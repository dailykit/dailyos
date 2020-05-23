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
import { UNITS, DELETE_UNITS } from '../../../../graphql'
import { toast } from 'react-toastify'

const address = 'apps.settings.views.forms.units.'

const UnitsForm = () => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(UNITS)

   // Mutation
   const [deleteElement] = useMutation(DELETE_UNITS, {
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
                  <Text as="title">{t(address.concat('units'))}</Text>
               </div>
               <div>
                  <Text as="title">{data.units.length}</Text>
                  <span onClick={() => openTunnel(1)}>
                     <AddIcon color="#00A7E1" size={24} />
                  </span>
               </div>
            </Card>
            <Listing>
               <ListingHeader>
                  <Text as="p">
                     {t(address.concat('units'))} ({data.units.length})
                  </Text>
                  <IconButton type="solid" onClick={() => openTunnel(1)}>
                     <AddIcon size={24} />
                  </IconButton>
               </ListingHeader>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>{t(address.concat('name'))}</TableCell>
                        <TableCell></TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.units.map(unit => (
                        <TableRow key={unit.id}>
                           <TableCell>{unit.name}</TableCell>
                           <TableCell>
                              <IconButton onClick={e => deleteHandler(e, unit)}>
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

export default UnitsForm
