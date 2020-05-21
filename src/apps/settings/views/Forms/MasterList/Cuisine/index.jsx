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
import { CUISINES, DELETE_CUISINES } from '../../../../graphql'
import { toast } from 'react-toastify'

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
                  <Text as="title">{t(address.concat('cuisines'))}</Text>
               </div>
               <div>
                  <Text as="title">{data.cuisineNames.length}</Text>
                  <span onClick={() => openTunnel(1)}>
                     <AddIcon color="#00A7E1" size={24} />
                  </span>
               </div>
            </Card>
            <Listing>
               <ListingHeader>
                  <Text as="p">
                     {t(address.concat('cuisines'))} ({data.cuisineNames.length}
                     )
                  </Text>
               </ListingHeader>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>{t(address.concat('name'))}</TableCell>
                        <TableCell>
                           {t(address.concat('# of recipes'))}
                        </TableCell>
                        <TableCell></TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.cuisineNames.map(cuisine => (
                        <TableRow key={cuisine.id}>
                           <TableCell>{cuisine.name}</TableCell>
                           <TableCell>{cuisine.simpleRecipes.length}</TableCell>
                           <TableCell>
                              <IconButton
                                 onClick={e => deleteHandler(e, cuisine)}
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

export default CuisineForm
