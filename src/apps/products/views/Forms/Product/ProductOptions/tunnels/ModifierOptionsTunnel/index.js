import React from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import {
   Filler,
   List,
   ListHeader,
   ListItem,
   ListOptions,
   ListSearch,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import {
   InlineLoader,
   Tooltip,
} from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import {
   BULK_ITEMS,
   INVENTORY_PRODUCT_OPTIONS,
   PRODUCT_OPTION,
   SACHET_ITEMS,
   SIMPLE_RECIPE_PRODUCT_OPTIONS,
   SUPPLIER_ITEMS,
} from '../../../../../../graphql'
import { TunnelBody } from '../../../tunnels/styled'

const ModifierOptionsTunnel = ({ close }) => {
   const { modifiersState, modifiersDispatch } = React.useContext(
      ModifiersContext
   )
   const [search, setSearch] = React.useState('')
   const [options, setOptions] = React.useState([])
   const [list, current, selectOption] = useSingleList(options)

   // Queries
   // TODO: switch queries with subscription
   const [productsOptions, { loading: productsLoading }] = useLazyQuery(
      PRODUCT_OPTION.LIST_QUERY,
      {
         variables: {
            where: {
               isArchived: { _eq: false },
            },
         },
         onCompleted: data => {
            const updatedOptions = data.productOptions.map(item => ({
               ...item,
               title: `${item.product.name} - ${item.label}`,
            }))
            setOptions([...updatedOptions])
         },
         onError: error => {
            toast.error('Failed to fetch Product Options!')
            logger(error)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

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
            toast.error('Failed to fetch Sachet Items!')
            logger(error)
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
         toast.error('Failed to fetch Bulk Items!')
         logger(error)
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
            toast.error('Failed to fetch Supplier Items!')
            logger(error)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   React.useEffect(() => {
      if (modifiersState.meta.modifierProductType === 'simpleProductOption') {
         productsOptions()
      } else if (modifiersState.meta.modifierProductType === 'sachetItem') {
         sachetItems()
      } else if (modifiersState.meta.modifierProductType === 'bulkItem') {
         bulkItems()
      } else {
         supplierItems()
      }
   }, [])

   const select = option => {
      console.log(option)
      selectOption('id', option.id)
      const object = {
         productId: option.id,
         productType: modifiersState.meta.modifierProductType,
         name: {
            value: option.title,
            meta: { isValid: true, isTouched: false, errors: [] },
         },
         originalName: option.title,
         image: {
            value: option.Product?.assets?.images[0] || '',
         },
         isActive: { value: true },
         isVisible: { value: true },
         productQuantity: {
            value: 1,
            meta: { isValid: true, isTouched: false, errors: [] },
         },
         discount: {
            value: 10,
            meta: { isValid: true, isTouched: false, errors: [] },
         },
         isAlwaysCharged: { value: false },
         unit: option.unit || null,
         operationConfig: { value: null },
      }
      switch (modifiersState.meta.modifierProductType) {
         case 'simpleProductOption':
            object.price = {
               value: option.price,
               meta: { isValid: true, isTouched: false, errors: [] },
            }
            break
         case 'sachetItem':
            object.price = {
               value:
                  option.bulkItem?.supplierItem?.prices[0]?.unitPrice?.value,
               meta: { isValid: true, isTouched: false, errors: [] },
            }
            break
         case 'bulkItem':
            object.price = {
               value: option?.supplierItem?.prices[0]?.unitPrice?.value,
               meta: {
                  isValid: true,
                  isTouched: false,
                  errors: [],
               },
            }
            break
         case 'supplierItem':
            object.price = {
               value: option?.prices[0]?.unitPrice?.value,
               meta: {
                  isValid: true,
                  isTouched: false,
                  errors: [],
               },
            }
            break
         default:
            object.price = {
               value: 1,
               meta: {
                  isValid: true,
                  isTouched: false,
                  errors: [],
               },
            }
      }
      modifiersDispatch({
         type: 'ADD_CATEGORY_OPTION',
         payload: {
            option: object,
         },
      })
      close(4)
      close(3)
   }

   return (
      <>
         <TunnelHeader
            title="Choose Option"
            close={() => close(4)}
            tooltip={<Tooltip identifier="modifiers_options_tunnel" />}
         />
         <TunnelBody>
            {[
               productsLoading,
               sachetItemsLoading,
               bulkItemsLoading,
               supplierItemsLoading,
            ].some(loading => loading) ? (
               <InlineLoader />
            ) : (
               <>
                  {list.length ? (
                     <List>
                        {Object.keys(current).length > 0 ? (
                           <ListItem type="SSL1" title={current.title} />
                        ) : (
                           <ListSearch
                              onChange={value => setSearch(value)}
                              placeholder="type what you’re looking for..."
                           />
                        )}
                        <ListHeader
                           type="SSL1"
                           label="Products Options/Items"
                        />
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
                  ) : (
                     <Filler
                        message="No products/items found! To start, please add some."
                        height="500px"
                     />
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default ModifierOptionsTunnel
