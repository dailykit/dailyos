import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Text,
   useSingleList,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '../../../../../assets/icons'
import { TunnelBody, TunnelHeader } from '../styled'
import { SafetyCheckContext } from '../../../../../context/check'

const UserTunnel = ({ openTunnel, closeTunnel, users }) => {
   const { t } = useTranslation()
   const { checkDispatch } = React.useContext(SafetyCheckContext)

   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(users)

   // Effect
   React.useEffect(() => {
      if (Object.keys(current).length) {
         checkDispatch({
            type: 'USER',
            payload: current,
         })
         openTunnel(2)
      }
   }, [current])

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(1)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">Select User</Text>
            </div>
         </TunnelHeader>
         <TunnelBody>
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
         </TunnelBody>
      </React.Fragment>
   )
}

export default UserTunnel
