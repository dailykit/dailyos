import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { GENERAL_ERROR_MESSAGE } from '../../../../apps/inventory/constants/errorMessages'
import {
   CREATE_ITEM,
   CREATE_SUPPLIER,
} from '../../../../apps/inventory/graphql'
import { CREATE_COLLECTION } from '../../../../apps/menu/graphql'
import {
   CREATE_INGREDIENT,
   CREATE_SIMPLE_RECIPE,
} from '../../../../apps/products/graphql'
import { useTabs } from '../../../providers'
import { logger, randomSuffix } from '../../../utils'
import Styles from '../styled'

const CreateNewItemPanel = ({
   setOpen,
   openCreateBrandTunnel,
   openCreateProductTunnel,
}) => {
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
   const [createRecipe] = useMutation(CREATE_SIMPLE_RECIPE, {
      onCompleted: input => {
         addTab(
            input.createSimpleRecipe.returning[0].name,
            `/products/recipes/${input.createSimpleRecipe.returning[0].id}`
         )
         toast.success('Recipe added!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createCollection] = useMutation(CREATE_COLLECTION, {
      variables: {
         object: {
            name: `collection-${randomSuffix()}`,
         },
      },
      onCompleted: data => {
         addTab(
            data.createCollection.name,
            `/menu/collections/${data.createCollection.id}`
         )
         toast.success('Collection created!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createItem] = useMutation(CREATE_ITEM, {
      onCompleted: input => {
         const itemData = input.createSupplierItem.returning[0]
         addTab(itemData.name, `/inventory/items/${itemData.id}`)
         toast.success('Supplier Item Added!')
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
      },
   })

   const [createIngredient] = useMutation(CREATE_INGREDIENT, {
      onCompleted: data => {
         toast.success('Ingredient created!')
         addTab(
            data.createIngredient.returning[0].name,
            `/products/ingredients/${data.createIngredient.returning[0].id}`
         )
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
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

   const createRecipeHandler = () => {
      const name = `recipe-${randomSuffix()}`
      createRecipe({ variables: { name } })
   }
   const createSupplierItemHandler = () => {
      // create item in DB
      const name = `item-${randomSuffix()}`
      createItem({
         variables: {
            object: {
               name,
            },
         },
      })
   }

   const createIngredientHandler = async () => {
      const name = `ingredient-${randomSuffix()}`
      createIngredient({ variables: { name } })
   }
   const handleCreate = cb => {
      setOpen(null)
      cb()
   }

   return (
      <div>
         <CreateNewBtn
            title="Brands"
            onClick={() => {
               openCreateBrandTunnel(1)
               setOpen(null)
            }}
         />
         <CreateNewBtn
            title="Collection"
            onClick={() => handleCreate(createCollection)}
         />
         <CreateNewBtn
            title="Products"
            onClick={() => {
               openCreateProductTunnel(1)
               setOpen(null)
            }}
         />
         <CreateNewBtn title="Recipe" onClick={createRecipeHandler} />
         <CreateNewBtn title="Ingredient" onClick={createIngredientHandler} />
         <CreateNewBtn
            title="Supplier Item"
            onClick={createSupplierItemHandler}
         />
         <CreateNewBtn title="Supplier" onClick={createSupplierHandler} />
      </div>
   )
}

const CreateNewBtn = ({ title, onClick }) => (
   <Styles.PageItem onClick={onClick}>
      <span style={{ padding: '6px 0px' }}>{title}</span>
   </Styles.PageItem>
)

export default CreateNewItemPanel
