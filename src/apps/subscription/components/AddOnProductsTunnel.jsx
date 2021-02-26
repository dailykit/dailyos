import React from 'react'
import { startCase } from 'lodash'
import styled from 'styled-components'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import {
   Flex,
   Tunnel,
   Tunnels,
   IconButton,
   TunnelHeader,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import tableOptions from '../tableOption'
import { currencyFmt } from '../../../shared/utils'
import { useTooltip } from '../../../shared/providers'
import { InlineLoader } from '../../../shared/components'
import { DeleteIcon } from '../../../shared/assets/icons'
import { ADDON_PRODUCTS, DELETE_ADDON_PRODUCT } from '../graphql'

export const AddOnProductsTunnel = ({
   tunnel,
   occurenceId,
   subscriptionId,
}) => {
   const { tooltip } = useTooltip()
   const [remove] = useMutation(DELETE_ADDON_PRODUCT)
   const columns = React.useMemo(
      () => [
         {
            title: 'Product',
            headerFilter: true,
            field: 'productOption.product.name',
            headerFilterPlaceholder: 'Search products...',
            headerTooltip: column => {
               const identifier = 'product_listing_column_name'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Label',
            field: 'productOption.label',
            headerTooltip: column => {
               const identifier = 'product_listing_column_label'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            width: 120,
            hozAlign: 'right',
            title: 'Unit Price',
            headerFilter: true,
            field: 'unitPrice',
            headerTooltip: column => {
               const identifier = 'product_listing_column_unitPrice'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
            formatter: ({ _cell }) => currencyFmt(_cell.value),
         },
         {
            width: 150,
            title: 'Type',
            headerFilter: true,
            field: 'productOption.type',
            headerFilterPlaceholder: 'Search label...',
            headerTooltip: column => {
               const identifier = 'product_listing_column_label'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
            formatter: ({ _cell }) => startCase(_cell.value),
         },
         {
            width: 80,
            hozAlign: 'center',
            title: 'Visibility',
            formatter: 'tickCross',
            field: 'isVisible',
            headerTooltip: column => {
               const identifier = 'product_listing_column_isVisible'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            width: 80,
            hozAlign: 'center',
            title: 'Availability',
            formatter: 'tickCross',
            field: 'isAvailable',
            headerTooltip: column => {
               const identifier = 'product_listing_column_isAvailable'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            width: 80,
            hozAlign: 'center',
            title: 'Single Select',
            formatter: 'tickCross',
            field: 'isSingleSelect',
            headerTooltip: column => {
               const identifier = 'product_listing_column_isSingleSelect'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            width: 150,
            title: 'Actions',
            headerFilter: false,
            headerSort: false,
            hozAlign: 'center',
            cssClass: 'center-text',
            formatter: reactFormatter(<Delete remove={remove} />),
         },
      ],
      []
   )
   return (
      <Tunnels tunnels={tunnel.list}>
         <Tunnel layer={1} size="full">
            <TunnelHeader
               title="Manage Add On Products"
               close={() => tunnel.close(1)}
            />
            <Flex
               overflowY="auto"
               padding="0 16px 16px 16px"
               height="calc(100% - 40px)"
            >
               <Tabs>
                  <HorizontalTabList>
                     <HorizontalTab>Added to Occurence</HorizontalTab>
                     <HorizontalTab>Added to Subscription</HorizontalTab>
                  </HorizontalTabList>
                  <HorizontalTabPanels>
                     <HorizontalTabPanel>
                        <AddedToOccurence
                           columns={columns}
                           occurenceId={occurenceId || 706}
                        />
                     </HorizontalTabPanel>
                     <HorizontalTabPanel>
                        <AddedToSubscription
                           columns={columns}
                           subscriptionId={subscriptionId || 126}
                        />
                     </HorizontalTabPanel>
                  </HorizontalTabPanels>
               </Tabs>
            </Flex>
         </Tunnel>
      </Tunnels>
   )
}

const AddedToOccurence = ({ columns, occurenceId }) => {
   const tableRef = React.useRef()
   const { loading, data: { addOnProducts = {} } = {} } = useSubscription(
      ADDON_PRODUCTS,
      {
         variables: {
            where: { subscriptionOccurenceId: { _eq: occurenceId } },
         },
      }
   )

   if (loading) return <InlineLoader />
   return (
      <div>
         <ReactTabulator
            columns={columns}
            ref={tableRef}
            data={addOnProducts.nodes || []}
            options={{
               ...tableOptions,
               layout: 'fitColumns',
               groupBy: 'productCategory',
            }}
         />
      </div>
   )
}

const AddedToSubscription = ({ columns, subscriptionId }) => {
   const tableRef = React.useRef()
   const { loading, data: { addOnProducts = {} } = {} } = useSubscription(
      ADDON_PRODUCTS,
      {
         variables: {
            where: { subscriptionId: { _eq: subscriptionId } },
         },
      }
   )

   if (loading) return <InlineLoader />
   return (
      <div>
         <ReactTabulator
            columns={columns}
            ref={tableRef}
            data={addOnProducts.nodes || []}
            options={{
               ...tableOptions,
               layout: 'fitColumns',
               groupBy: 'productCategory',
            }}
         />
      </div>
   )
}

const Delete = ({ cell, remove }) => {
   const removeItem = () => {
      const { id, productOption = {} } = cell.getData()
      if (
         window.confirm(
            `Are your sure you want to delete this ${productOption?.product.name} product?`
         )
      ) {
         remove({ variables: { id } })
      }
   }

   return (
      <IconButton size="sm" type="ghost" onClick={removeItem}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}

const Tabs = styled(HorizontalTabs)`
   > [data-reach-tab-panels] {
      > [data-reach-tab-panel] {
         padding: 16px 0;
      }
   }
`
