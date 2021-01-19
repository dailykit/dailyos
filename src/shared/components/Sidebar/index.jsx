import React from 'react'
import gql from 'graphql-tag'
import { isEmpty } from 'lodash'
import { Flex, Avatar } from '@dailykit/ui'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import Styles from './styled'
import { useAuth } from '../../providers/auth'
import { InlineLoader } from '../InlineLoader'

const APPS = gql`
   subscription apps {
      apps(order_by: { id: asc }) {
         id
         title
         icon
         route
      }
   }
`

const USERS = gql`
   subscription users($where: settings_user_bool_exp!) {
      users: settings_user(where: $where) {
         id
         email
         firstName
         lastName
      }
   }
`

const fullName = (f, l) => {
   let name = ''
   if (f) {
      name += f
   }
   if (l) {
      name += ` ${l}`
   }
   return name
}

export const Sidebar = ({ open, links }) => {
   const history = useHistory()
   const { user, logout } = useAuth()
   const [tab, setTab] = React.useState('PAGES')
   const { loading, data: { apps = [] } = {} } = useSubscription(APPS)
   const { data: { users = [] } = {} } = useSubscription(USERS, {
      skip: !user?.email,
      variables: {
         where: {
            email: { _eq: user?.email },
         },
      },
   })

   return (
      <Styles.Sidebar visible={open}>
         {!isEmpty(users) && (
            <Flex as="header" padding="12px">
               {users[0]?.firstName && (
                  <Avatar
                     url=""
                     withName
                     title={fullName(users[0]?.firstName, users[0]?.lastName)}
                  />
               )}
            </Flex>
         )}
         <Styles.Tabs>
            <Styles.Tab
               onClick={() => setTab('APPS')}
               className={tab === 'APPS' ? 'active' : ''}
            >
               Apps
            </Styles.Tab>
            <Styles.Tab
               onClick={() => setTab('PAGES')}
               className={tab === 'PAGES' ? 'active' : ''}
            >
               Pages
            </Styles.Tab>
         </Styles.Tabs>
         {tab === 'PAGES' ? (
            <Styles.Pages>
               {links.map(({ id, title, onClick }) => (
                  <Styles.PageItem key={id} onClick={onClick}>
                     {title}
                  </Styles.PageItem>
               ))}
            </Styles.Pages>
         ) : (
            <Styles.Apps>
               {loading ? (
                  <InlineLoader />
               ) : (
                  apps.map(app => (
                     <Styles.AppItem
                        key={app.id}
                        onClick={() =>
                           history.push(app.route) || window.location.reload()
                        }
                     >
                        {app.icon && <img src={app.icon} alt={app.title} />}
                        {app.title}
                     </Styles.AppItem>
                  ))
               )}
            </Styles.Apps>
         )}
         <Styles.Footer>
            <button type="button" onClick={logout}>
               Sign Out
            </button>
         </Styles.Footer>
      </Styles.Sidebar>
   )
}
