import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import {
   Tooltip,
   InlineLoader,
   WebBuilder,
} from '../../../../../shared/components'
import tableOptions from '../../Listings/tableOption'
import {
   ComboButton,
   Flex,
   Text,
   PlusIcon,
   Tunnels,
   Tunnel,
   useTunnel,
   TunnelHeader,
} from '@dailykit/ui'
import { FAQS, FAQ_ARCHIVED, CONTENT_PAGE_ONE } from '../../../graphql'
import { useTabs } from '../../../context'
import { useTooltip } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { StyledWrapper, TunnelBody } from './style'

export default function Identifier() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const { page } = useParams()
   const { tab, addTab } = useTabs()
   const tableRef = React.useRef()
   const { tooltip } = useTooltip()
   const {
      data: { content_page_by_pk = {} } = {},
      loading,
      error,
   } = useSubscription(CONTENT_PAGE_ONE, {
      variables: {
         page,
      },
   })

   const AddButton = () => {
      return (
         <ComboButton type="solid" onClick={openTunnel(1)}>
            <PlusIcon />
            Add Section
         </ComboButton>
      )
   }

   const columns = [
      {
         title: 'Identifier',
         field: 'identifier',
         headerSort: true,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier = 'contentApp_identifier_listing_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Action',
         field: 'action',

         formatter: reactFormatter(<AddButton />),
         hozAlign: 'center',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 150,
      },
   ]

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error(error)
   }
   return (
      <StyledWrapper>
         <Flex container height="50px" alignItems="center">
            <Text as="title">Identifiers for {page} Page</Text>
            <Tooltip identifier="FAQ_list_heading" />
         </Flex>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={content_page_by_pk?.identifiers || []}
            options={tableOptions}
         />

         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="lg">
               <TunnelHeader
                  title="Add Section"
                  close={() => closeTunnel(1)}
                  right={{
                     title: 'Save',
                  }}
               />
               <TunnelBody>
                  <WebBuilder />
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </StyledWrapper>
   )
}
