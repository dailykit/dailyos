import { useMutation, useSubscription } from '@apollo/react-hooks'
import { IconButton, Loader, TextButton } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { toast } from 'react-toastify'

import DeleteIcon from '../../../../../shared/assets/icons/Delete'
import { randomSuffix } from '../../../../../shared/utils/index'
import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import {
   CREATE_SUPPLIER,
   DELETE_SUPPLIER,
   ALL_SUPPLIERS_SUBSCRIPTION,
} from '../../../graphql'
import { StyledHeader, StyledWrapper } from '../styled'
import tableOptions from '../tableOption'

const address = 'apps.inventory.views.listings.supplier.'

export default function SupplierListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view, id) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, id },
      })
   }

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
         addTab(supplierData.name, 'suppliers', supplierData.id)
      },
      onError: error => {
         console.log(error)
         toast.error('Something went wrong, try again')
      },
   })

   const [deleteSupplier, { loading }] = useMutation(DELETE_SUPPLIER, {
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
         headerFilter: true,
         formatter: reactFormatter(<ContactPerson />),
      },
      {
         title: 'Available',
         field: 'available',
         formatter: 'tickCross',
         headerFilter: true,
         hozAlign: 'center',
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cellClick: (e, cell) => {
            e.stopPropagation()
            const { id } = cell._cell.row.data
            deleteSupplier({
               variables: { id },
            })
         },
         formatter: reactFormatter(<DeleteSupplier />),
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, 'suppliers', id)
   }

   if (loading || listLoading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('suppliers'))}</h1>
               <IconButton type="solid" onClick={createSupplierHandler}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <div style={{ margin: '0 auto', width: '80%' }}>
               <TextButton
                  style={{ marginBottom: '20px' }}
                  type="outline"
                  onClick={() => tableRef.current.table.clearHeaderFilter()}
               >
                  Clear Filters
               </TextButton>
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
