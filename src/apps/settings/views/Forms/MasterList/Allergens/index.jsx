import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

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
import { ALLERGENS } from '../../../../graphql'

const address = 'apps.settings.views.forms.allergens.'

const AllergensForm = () => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // subscription
   const { loading, data, error } = useSubscription(ALLERGENS)

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
                  <Text as="title">{t(address.concat('allergens'))}</Text>
               </div>
               <div>
                  <Text as="title">{data.masterAllergens.length}</Text>
                  <span onClick={() => openTunnel(1)}>
                     <AddIcon color="#00A7E1" size={24} />
                  </span>
               </div>
            </Card>
            <Listing>
               <ListingHeader>
                  <Text as="p">
                     {t(address.concat('allergens'))} (
                     {data.masterAllergens.length})
                  </Text>
               </ListingHeader>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>{t(address.concat('name'))}</TableCell>
                        <TableCell>
                           {t(address.concat('description'))}
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.masterAllergens.map(allergen => (
                        <TableRow key={allergen.id}>
                           <TableCell>{allergen.name}</TableCell>
                           <TableCell>{allergen.description || 'NA'}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </Listing>
         </Layout>
      </React.Fragment>
   )
}

export default AllergensForm
