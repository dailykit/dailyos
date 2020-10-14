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
   Loader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import {
   CREATE_PROCESSINGS,
   FETCH_PROCESSING_NAMES,
} from '../../../../../graphql'
import { TunnelBody } from '../styled'
import { logger } from '../../../../../../../shared/utils'

const ProcessingsTunnel = ({ state, closeTunnel }) => {
   const [search, setSearch] = React.useState('')
   const [processings, setProcessings] = React.useState([])
   const [list, selected, selectOption] = useMultiList([])

   // Subscription
   const { loading, error } = useSubscription(FETCH_PROCESSING_NAMES, {
      onSubscriptionData: data => {
         setProcessings([...data.subscriptionData.data.masterProcessings])
      },
   })

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

   // Mutation
   const [createProcessings, { loading: inFlight }] = useMutation(
      CREATE_PROCESSINGS,
      {
         variables: {
            procs: selected.map(proc => ({
               ingredientId: state.id,
               processingName: proc.title,
            })),
         },
         onCompleted: () => {
            toast.success('Proccesings added!')
            closeTunnel(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   // Handlers
   const add = () => {
      if (inFlight) return
      createProcessings()
   }

   return (
      <>
         <TunnelHeader
            title="Add Processings"
            right={{ action: add, title: inFlight ? 'Adding...' : 'Add' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {loading ? (
               <Loader />
            ) : (
               <>
                  {list.length ? (
                     <List>
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder="type what you’re looking for..."
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
                     <h1>No Data</h1>
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default ProcessingsTunnel
