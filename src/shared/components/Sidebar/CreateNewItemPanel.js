import { useMutation } from '@apollo/react-hooks'
import React from 'react'
import { toast } from 'react-toastify'
import { GENERAL_ERROR_MESSAGE } from '../../../apps/inventory/constants/errorMessages'
import { CREATE_SUPPLIER } from '../../../apps/inventory/graphql'
import { RectangularIcon } from '../../assets/icons'
import { useTabs } from '../../providers'
import { logger, randomSuffix } from '../../utils'
import Styles from './styled'

const CreateNewItemPanel = () => {
   const { addTab } = useTabs()
   const [createSupplier] = useMutation(CREATE_SUPPLIER, {
      onCompleted: input => {
         const supplierData = input.createSupplier.returning[0]
         toast.success('Supplier Added!')
         addTab(supplierData.name, `/inventory/suppliers/${supplierData.id}`)
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
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

   return (
      <Styles.CreateNewItems>
         <CreateNewBtn title="Brands" />
         <CreateNewBtn title="Collection" />
         <CreateNewBtn title="Products" />
         <CreateNewBtn title="Recipe" />
         <CreateNewBtn title="Ingredient" />
         <CreateNewBtn title="Supplier Item" />
         <CreateNewBtn title="Supplier" onClick={createSupplierHandler} />
      </Styles.CreateNewItems>
   )
}

const CreateNewBtn = ({ title, onClick }) => (
   <Styles.PageItem onClick={onClick}>
      <RectangularIcon size="10px" color="#367bf5" />
      <span style={{ color: '#367bf5' }}>{title}</span>
   </Styles.PageItem>
)

export default CreateNewItemPanel
