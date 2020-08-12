import React from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import {
   TunnelHeader,
   Loader,
   List,
   ListSearch,
   ListOptions,
   ListItem,
   useSingleList,
} from '@dailykit/ui'
import { TunnelBody } from '../styled'
import {
   SIMPLE_RECIPE_PRODUCT_OPTIONS,
   SACHET_ITEMS,
   BULK_ITEMS,
   SUPPLIER_ITEMS,
   INVENTORY_PRODUCT_OPTIONS,
} from '../../../../../../graphql'
import { ModifiersContext } from '../../../../../../context/product/modifiers'

const ModifierOptionsTunnel = ({ close }) => {
   const { modifiersState, modifiersDispatch } = React.useContext(
      ModifiersContext
   )
   const [search, setSearch] = React.useState('')
   const [options, setOptions] = React.useState([])
   const [list, current, selectOption] = useSingleList(options)

   const SRPType = type => {
      return type === 'mealKit' ? 'Meal Kit' : 'Ready to Eat'
   }

   // Queries
   const [
      inventoryProductsOptions,
      { loading: inventoryProductsLoading },
   ] = useLazyQuery(INVENTORY_PRODUCT_OPTIONS, {
      variables: {
         where: { inventoryProduct: { isPublished: { _eq: true } } },
      },
      onCompleted: data => {
         const updatedOptions = data.inventoryProductOptions.map(item => ({
            ...item,
            title: `${item.inventoryProduct.name} - ${item.label}`,
         }))
         setOptions([...updatedOptions])
      },
      onError: error => {
         console.log('Error in fetching Inventory Products: ', error)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [
      simpleRecipeProductsOptions,
      { loading: simpleRecipeProductsLoading },
   ] = useLazyQuery(SIMPLE_RECIPE_PRODUCT_OPTIONS, {
      variables: {
         where: { simpleRecipeProduct: { isPublished: { _eq: true } } },
      },
      onCompleted: data => {
         const updatedOptions = data.simpleRecipeProductOptions.map(item => ({
            ...item,
            title: `${item.simpleRecipeProduct.name} - ${SRPType(item.type)} (${
               item.simpleRecipeYield.yield.serving
            })`,
         }))
         setOptions([...updatedOptions])
      },
      onError: error => {
         console.log('Error in fetching Simple Recipe Products: ', error)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [sachetItems, { loading: sachetItemsLoading }] = useLazyQuery(
      SACHET_ITEMS,
      {
         onCompleted: data => {
            const updatedOptions = data.sachetItems.map(item => ({
               ...item,
               title: `${item.bulkItem.supplierItem.name} - ${item.bulkItem.processingName}`,
               unit: `${item.unitSize} ${item.unit}`,
            }))
            setOptions([...updatedOptions])
         },
         onError: error => {
            console.log('Error in fetching Sachet Items: ', error)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   const [bulkItems, { loading: bulkItemsLoading }] = useLazyQuery(BULK_ITEMS, {
      onCompleted: data => {
         const updatedOptions = data.bulkItems.map(item => ({
            ...item,
            title: `${item.supplierItem.name} - ${item.processingName}`,
         }))
         setOptions([...updatedOptions])
      },
      onError: error => {
         console.log('Error in fetching Bulk Items: ', error)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [supplierItems, { loading: supplierItemsLoading }] = useLazyQuery(
      SUPPLIER_ITEMS,
      {
         onCompleted: data => {
            const updatedOptions = data.supplierItems.map(item => ({
               ...item,
               unit: `${item.unitSize} ${item.unit}`,
            }))
            setOptions([...updatedOptions])
         },
         onError: error => {
            console.log('Error in fetching Supplier Items: ', error)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   React.useEffect(() => {
      if (
         modifiersState.meta.modifierProductType === 'inventoryProductOption'
      ) {
         inventoryProductsOptions()
      } else if (
         modifiersState.meta.modifierProductType === 'simpleRecipeProductOption'
      ) {
         simpleRecipeProductsOptions()
      } else if (modifiersState.meta.modifierProductType === 'sachetItem') {
         sachetItems()
      } else if (modifiersState.meta.modifierProductType === 'bulkItem') {
         bulkItems()
      } else {
         supplierItems()
      }
   }, [])

   const select = option => {
      selectOption('id', option.id)
      modifiersDispatch({
         type: 'ADD_CATEGORY_OPTION',
         payload: {
            option: {
               productId: option.id,
               productType: modifiersState.meta.modifierProductType,
               name: option.title,
               image:
                  option.inventoryProduct?.assets?.images[0] ||
                  option.simpleRecipeProduct?.assets?.images[0] ||
                  '',
               isActive: true,
               isVisible: true,
               productQuantity: 1,
               price: option.price[0]?.value || 1,
               discount: 0,
               isAlwaysCharged: false,
               unit: option.unit || null,
            },
         },
      })
      close(4)
      close(3)
   }

   return (
      <>
         <TunnelHeader title="Choose Option" close={() => close(4)} />
         <TunnelBody>
            {[
               inventoryProductsLoading,
               simpleRecipeProductsLoading,
               sachetItemsLoading,
               bulkItemsLoading,
               supplierItemsLoading,
            ].some(loading => loading) ? (
               <Loader />
            ) : (
               <List>
                  {Object.keys(current).length > 0 ? (
                     <ListItem type="SSL1" title={current.title} />
                  ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder="type what you’re looking for..."
                     />
                  )}
                  <ListOptions>
                     {list
                        .filter(option =>
                           option.title.toLowerCase().includes(search)
                        )
                        .map(option => (
                           <ListItem
                              type="SSL1"
                              key={option.id}
                              title={option.title}
                              isActive={option.id === current.id}
                              onClick={() => select(option)}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </TunnelBody>
      </>
   )
}

export default ModifierOptionsTunnel
