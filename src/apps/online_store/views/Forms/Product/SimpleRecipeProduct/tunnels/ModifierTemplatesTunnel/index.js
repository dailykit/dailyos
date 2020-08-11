import React from 'react'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   TunnelHeader,
   useSingleList,
   Loader,
   List,
   ListItem,
   ListSearch,
   ListOptions,
} from '@dailykit/ui'
import { TunnelBody } from '../styled'
import {
   MODIFIERS,
   UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
} from '../../../../../../graphql'
import { ModifiersContext } from '../../../../../../context/product/modifiers'

const ModifierTemplatesTunnel = ({ close }) => {
   const {
      modifiersState: { meta },
   } = React.useContext(ModifiersContext)

   const [saving, setSaving] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [listing, setListing] = React.useState([])
   const [list, current, selectOption] = useSingleList(listing)

   // Subscription
   const { loading, error } = useSubscription(MODIFIERS, {
      onSubscriptionData: data => {
         setListing([...data.subscriptionData.data.modifiers])
      },
   })

   // Mutation
   const [updateSimpleRecipeProductOption] = useMutation(
      UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
      {
         onCompleted: () => {
            toast.success('Modifier added to option!')
            close(6)
            close(1)
         },
         onError: error => {
            toast.error('Error')
            console.log(error)
         },
      }
   )

   const save = () => {
      try {
         if (saving) return
         setSaving(true)
         updateSimpleRecipeProductOption({
            variables: {
               id: meta.optionId,
               set: {
                  modifierId: current.id,
               },
            },
         })
      } catch (error) {
         console.log(error)
      } finally {
         setSaving(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Choose Option"
            close={() => close(6)}
            right={{ action: save, title: saving ? 'Saving...' : 'Save' }}
         />
         <TunnelBody>
            {[loading, error].some(loading => loading) ? (
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
                              onClick={() => selectOption('id', option.id)}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </TunnelBody>
      </>
   )
}

export default ModifierTemplatesTunnel
