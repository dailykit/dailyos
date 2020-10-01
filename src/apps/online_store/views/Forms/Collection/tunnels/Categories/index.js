import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   useMultiList,
   TunnelHeader,
   Loader,
} from '@dailykit/ui'

import { TunnelBody } from '../styled'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   CREATE_COLLECTION_PRODUCT_CATEGORIES,
   S_PRODUCT_CATEGORIES,
} from '../../../../../graphql'
import { toast, ToastContainer } from 'react-toastify'

const CategoriesTunnel = ({ closeTunnel, state }) => {
   const [isSaving, setIsSaving] = React.useState(false)

   const [search, setSearch] = React.useState('')
   const [categories, setCategories] = React.useState([])
   const [list, selected, selectOption] = useMultiList(categories)

   const { loading, error } = useSubscription(S_PRODUCT_CATEGORIES, {
      onSubscriptionData: data => {
         setCategories(data.subscriptionData.data.productCategories)
      },
   })

   if (error) {
      toast.error('Error while fetching categories')
      console.log(error)
   }

   const [createCategoriesInCollection] = useMutation(
      CREATE_COLLECTION_PRODUCT_CATEGORIES,
      {
         onCompleted: data => {
            toast.success(
               `Categor${
                  data.createCollectionProductCategories.returning.length > 1
                     ? 'ies'
                     : 'y'
               } added.`
            )
            closeTunnel(1)
         },
         onError: error => {
            toast.error('Error')
            console.log(error)
         },
      }
   )

   const save = () => {
      try {
         if (isSaving || !selected.length) return
         setIsSaving(true)
         const objects = selected.map(category => ({
            collectionId: state.id,
            productCategoryName: category.title,
         }))
         createCategoriesInCollection({
            variables: {
               objects,
            },
         })
      } catch (err) {
         toast.error(err.message)
      } finally {
         setIsSaving(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Add Categories"
            right={{ action: save, title: 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {loading ? (
               <Loader />
            ) : (
               <List>
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={"Type what you're looking for"}
                  />
                  {selected.length > 0 && (
                     <TagGroup style={{ margin: '8px 0' }}>
                        {selected.map(option => (
                           <Tag
                              key={option.id}
                              title={option.title}
                              onClick={() => selectOption('id', option.id)}
                           >
                              {option.title}
                           </Tag>
                        ))}
                     </TagGroup>
                  )}
                  <ListOptions>
                     {list
                        .filter(option =>
                           option.title.toLowerCase().includes(search)
                        )
                        .map(option => (
                           <ListItem
                              type="MSL1"
                              key={option.id}
                              title={option.title}
                              onClick={() => selectOption('id', option.id)}
                              isActive={selected.find(
                                 item => item.id === option.id
                              )}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </TunnelBody>
      </>
   )
}

export default CategoriesTunnel
