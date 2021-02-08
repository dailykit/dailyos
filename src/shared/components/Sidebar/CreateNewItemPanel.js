import { useMutation } from '@apollo/react-hooks'
import { Tunnel, Tunnels, useTunnel } from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import CreateBrandTunnel from '../../../apps/brands/views/Listings/brands/CreateBrandTunnel'
import { GENERAL_ERROR_MESSAGE } from '../../../apps/inventory/constants/errorMessages'
import { CREATE_SUPPLIER } from '../../../apps/inventory/graphql'
import { RectangularIcon } from '../../assets/icons'
import { useTabs, TooltipProvider } from '../../providers'
import { logger, randomSuffix } from '../../utils'
import Styles from './styled'

const CreateNewItemPanel = () => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
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
         <CreateNewBtn title="Brands" onClick={() => openTunnel(1)} />
         <CreateNewBtn title="Collection" />
         <CreateNewBtn title="Products" />
         <CreateNewBtn title="Recipe" />
         <CreateNewBtn title="Ingredient" />
         <CreateNewBtn title="Supplier Item" />
         <CreateNewBtn title="Supplier" onClick={createSupplierHandler} />
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="md">
               <TooltipProvider app="Brand App">
                  <CreateBrandTunnel closeTunnel={closeTunnel} />
               </TooltipProvider>
            </Tunnel>
         </Tunnels>
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
