import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   useMultiList,
   TunnelHeader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CREATE_PROCESSINGS } from '../../../../../graphql'
import { TunnelBody } from '../styled'

const ProcessingsTunnel = ({ state, closeTunnel, processings }) => {
   const [busy, setBusy] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(processings)

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
