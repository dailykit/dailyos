import React from 'react'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Text,
   Input,
   Spacer,
   PlusIcon,
   IconButton,
   Tunnel,
   Tunnels,
   useTunnel,
   TunnelHeader,
} from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

import { BRANDS } from '../../../graphql'
import { useTabs } from '../../../context'
import tableOptions from '../../../tableOption'
import { StyledWrapper, StyledHeader } from '../styled'
import { EditIcon } from '../../../../../shared/assets/icons'
import { InlineLoader, Flex, Tooltip } from '../../../../../shared/components'
import { useTooltip } from '../../../../../shared/providers'

export const Brands = () => {
   const { tooltip } = useTooltip()
   const tableRef = React.useRef()
   const { tab, addTab } = useTabs()
   const [form, setForm] = React.useState({
      title: '',
      domain: '',
   })
   const [create] = useMutation(BRANDS.CREATE_BRAND, {
      onCompleted: () => {
         setForm({
            title: '',
            domain: '',
         })
         closeTunnel(1)
         toast.success('Successfully created the brand!')
      },
      onError: () =>
         toast.success('Failed to create the brand, please try again!'),
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { error, loading, data: { brands = {} } = {} } = useSubscription(
      BRANDS.LIST
   )

   React.useEffect(() => {
      if (!tab) {
         addTab('Brands', '/brands/brands')
      }
   }, [tab, addTab])

   const edit = brand => {
      addTab(
         brand?.title || brand?.domain || 'N/A',
         `/brands/brands/${brand.id}`
      )
   }

   const columns = React.useMemo(
      () => [
         {
            title: 'Brand',
            field: 'title',
            headerSort: true,
            headerFilter: true,
            formatter: cell => cell.getData().title || 'N/A',
            headerTooltip: function (column) {
               const identifier = 'brands_listing_brand_column'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Domain',
            field: 'domain',
            headerSort: true,
            headerFilter: true,
            formatter: cell => cell.getData().domain || 'N/A',
            headerTooltip: function (column) {
               const identifier = 'brands_listing_domain_column'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Published',
            headerSort: false,
            hozAlign: 'center',
            headerHozAlign: 'center',
            field: 'isPublished',
            formatter: 'tickCross',
            headerTooltip: function (column) {
               const identifier = 'brands_listing_publish_column'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Actions',
            hozAlign: 'center',
            headerSort: false,
            headerHozAlign: 'center',
            formatter: reactFormatter(<EditBrand edit={edit} />),
            headerTooltip: function (column) {
               const identifier = 'brands_listing_actions_column'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
      ],
      []
   )

   const save = () => {
      if (form.title && form.domain) {
         return create({
            variables: {
               object: {
                  ...form,
               },
            },
         })
      }
      return toast.error('Title and Domain is required!')
   }

   const handleChange = e => {
      const { name, value } = e.target
      setForm(form => ({ ...form, [name]: value }))
   }

   if (error) return <div>Something went wrong, please refresh!</div>
   return (
      <StyledWrapper>
         <StyledHeader>
            <Flex container alignItems="center">
               <Text as="h2">Brands ({brands?.aggregate?.count || 0})</Text>
               <Tooltip identifier="brands_listing_heading" />
            </Flex>
            <IconButton type="solid" onClick={() => openTunnel(1)}>
               <PlusIcon />
            </IconButton>
         </StyledHeader>
         {loading ? (
            <InlineLoader />
         ) : (
            <>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={brands?.nodes || []}
                  options={{
                     ...tableOptions,
                     placeholder: 'No Brands Available Yet !',
                  }}
               />
            </>
         )}
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <TunnelHeader
                  title="Add Brand"
                  right={{ action: save, title: 'Save' }}
                  close={() => closeTunnel(1)}
               />
               <Flex padding="16px">
                  <Input
                     type="text"
                     label="Title"
                     name="title"
                     value={form.title}
                     onChange={e => handleChange(e)}
                  />
                  <Spacer size="24px" />
                  <Input
                     type="text"
                     label="Domain"
                     name="domain"
                     value={form.domain}
                     onChange={e => handleChange(e)}
                  />
               </Flex>
            </Tunnel>
         </Tunnels>
      </StyledWrapper>
   )
}

const EditBrand = ({ cell, edit }) => {
   return (
      <IconButton type="outline" size="sm" onClick={() => edit(cell.getData())}>
         <EditIcon color="rgb(40, 193, 247)" />
      </IconButton>
   )
}
