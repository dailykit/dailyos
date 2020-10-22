import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   useMultiList,
   TunnelHeader,
   Filler,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   UPDATE_INVENTORY_PRODUCT,
   S_ACCOMPANIMENT_TYPES,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'
import { InlineLoader } from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'

const address =
   'apps.menu.views.forms.product.inventoryproduct.tunnels.accompanimenttypetunnel.'

const RecommendationTypeTunnel = ({ state, close }) => {
   const { t } = useTranslation()

   const [search, setSearch] = React.useState('')
   const [accompanimentTypes, setAccompanimentTypes] = React.useState([])
   const [list, selected, selectOption] = useMultiList(accompanimentTypes)

   // Subscription
   const { loading, error } = useSubscription(S_ACCOMPANIMENT_TYPES, {
      onSubscriptionData: data => {
         setAccompanimentTypes([...data.subscriptionData.data.accompaniments])
      },
   })

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

   const [updateProduct, { loading: inFlight }] = useMutation(
      UPDATE_INVENTORY_PRODUCT,
      {
         onCompleted: () => {
            toast.success(t(address.concat('accompaniment types added!')))
            close(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   // Handlers
   const save = () => {
      if (inFlight) return
      const recommendations = selected.map(type => ({
         type: type.title,
         products: [],
      }))
      updateProduct({
         variables: {
            id: state.id,
            set: {
               recommendations,
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Select Recommendation Types"
            right={{
               action: save,
               title: inFlight
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
            ) : (
               <>
                  {list.length ? (
                     <List>
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder={t(
                              address.concat("type what you're looking for")
                           )}
                        />
                        {selected.length > 0 && (
                           <TagGroup style={{ margin: '8px 0' }}>
                              {selected.map(option => (
                                 <Tag
                                    key={option.id}
                                    title={option.title}
                                    onClick={() =>
                                       selectOption('id', option.id)
                                    }
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
                                    onClick={() =>
                                       selectOption('id', option.id)
                                    }
                                    isActive={selected.find(
                                       item => item.id === option.id
                                    )}
                                 />
                              ))}
                        </ListOptions>
                     </List>
                  ) : (
                     <Filler
                        message="No types found! Please add some, to start."
                        height="500px"
                     />
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default RecommendationTypeTunnel
