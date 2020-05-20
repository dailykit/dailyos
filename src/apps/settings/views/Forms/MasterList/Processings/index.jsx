import React from 'react'

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

const address = 'apps.settings.views.forms.processings.'

const ProcessingsForm = () => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const data = [
      {
         id: 1,
         name: 'Mashed',
      },
      {
         id: 2,
         name: 'Boiled',
      },
   ]

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
                  <Text as="title">{data.length}</Text>
                  <span onClick={() => openTunnel(1)}>
                     <AddIcon color="#00A7E1" size={24} />
                  </span>
               </div>
            </Card>
            <Listing>
               <ListingHeader>
                  <Text as="p">
                     {t(address.concat('processings'))} ({data.length})
                  </Text>
               </ListingHeader>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>{t(address.concat('name'))}</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.map(processing => (
                        <TableRow key={processing.id}>
                           <TableCell>{processing.name}</TableCell>
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
