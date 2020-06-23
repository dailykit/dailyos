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

const ProcessingsTunnel = ({ state, closeTunnel }) => {
   const [busy, setBusy] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [processings, setProcessings] = React.useState([])
   const [list, selected, selectOption] = useMultiList(processings)

   // Subscription
   const { loading } = useSubscription(FETCH_PROCESSING_NAMES, {
      onSubscriptionData: data => {
         const temp = data.subscriptionData.data.masterProcessings.map(
            proc => ({ id: proc.id, title: proc.name })
         )
         setProcessings([...temp])
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [createProcessings] = useMutation(CREATE_PROCESSINGS, {
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
         console.log(error)
         setBusy(false)
      },
   })

   // Handlers
   const add = () => {
      if (busy) return
      setBusy(true)
      createProcessings()
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Add Processings"
            right={{ action: add, title: busy ? 'Adding...' : 'Add' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
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
         </TunnelBody>
      </>
   )
}

export default ProcessingsTunnel
