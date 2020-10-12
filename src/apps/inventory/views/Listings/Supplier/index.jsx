import { useMutation, useSubscription } from '@apollo/react-hooks'
import { IconButton, Loader, TextButton } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'

import DeleteIcon from '../../../../../shared/assets/icons/Delete'
import { randomSuffix } from '../../../../../shared/utils/index'
import { AddIcon } from '../../../assets/icons'
// import { Context } from '../../../context/tabs'
import {
   CREATE_SUPPLIER,
   DELETE_SUPPLIER,
   ALL_SUPPLIERS_SUBSCRIPTION,
} from '../../../graphql'
import { StyledHeader, StyledWrapper } from '../styled'
import tableOptions from '../tableOption'
import { FlexContainer } from '../../Forms/styled'
import { useTabs } from '../../../context'

const address = 'apps.inventory.views.listings.supplier.'

export default function SupplierListing() {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const {
      loading: listLoading,
      data: { suppliers = [] } = {},
   } = useSubscription(ALL_SUPPLIERS_SUBSCRIPTION, {
      onError: error => {
         console.log(error)
         toast.error('Error! Please try reloading the page')
      },
   })

   const [createSupplier] = useMutation(CREATE_SUPPLIER, {
      onCompleted: input => {
         const supplierData = input.createSupplier.returning[0]
         toast.success('Supplier Added!')
         addTab(supplierData.name, `/inventory/suppliers/${supplierData.id}`)
      },
      onError: error => {
         console.log(error)
         toast.error('Something went wrong, try again')
      },
   })

   const [deleteSupplier] = useMutation(DELETE_SUPPLIER, {
      onCompleted: () => {
         toast.info('Supplier deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error(
            'Supplier is linked with items, hence can not be removed. To delete the supplier, remove those items first'
         )
      },
   })

   const createSupplierHandler = () => {
      // create supplier in DB
      const name = `supplier-${randomSuffix()}`
      createSupplier({
         variables: {
            object: {
               name,
            },
         },
      })
   }

   const tableRef = React.useRef()

   const columns = [
      { title: 'Name', field: 'name', headerFilter: true },
      {
         title: 'Person of Contact',
         field: 'contactPerson',
         headerFilter: false,
         hozAlign: 'left',
         formatter: reactFormatter(<ContactPerson />),
      },
      {
         title: 'Available',
         field: 'available',
         formatter: 'tickCross',
         headerFilter: true,
         hozAlign: 'center',
         cssClass: 'center-text',
         width: 120,
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cssClass: 'center-text',
         cellClick: (e, cell) => {
            e.stopPropagation()
            const { id } = cell._cell.row.data
            deleteSupplier({
               variables: { id },
            })
         },
         formatter: reactFormatter(<DeleteSupplier />),
         width: 100,
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/inventory/suppliers/${id}`)
   }

   if (listLoading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('suppliers'))}</h1>
               <FlexContainer>
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <span style={{ width: '10px' }} />
                  <IconButton type="solid" onClick={createSupplierHandler}>
                     <AddIcon color="#fff" size={24} />
                  </IconButton>
               </FlexContainer>
            </StyledHeader>
            <br />

            <div style={{ margin: '0 auto', width: '90%' }}>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={suppliers}
                  rowClick={rowClick}
                  options={tableOptions}
               />
            </div>
         </StyledWrapper>
      </>
   )
}

function DeleteSupplier() {
   return <DeleteIcon color="#FF5A52" />
}

function ContactPerson({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.firstName && value.lastName && value.phoneNumber)
      return (
         <>{`${value.firstName} ${value.lastName} (${value.phoneNumber})`}</>
      )

   return 'NA'
}
