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
import { useSubscription } from '@apollo/react-hooks'
import { S_PRODUCT_CATEGORIES } from '../../../../../graphql'
import { toast } from 'react-toastify'

const CategoriesTunnel = ({ closeTunnel }) => {
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

   const save = () => {
      console.log(selected)
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
