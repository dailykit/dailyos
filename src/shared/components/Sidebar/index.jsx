import React from 'react'
import gql from 'graphql-tag'
import { Avatar } from '@dailykit/ui'
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

export const Sidebar = ({ open, toggle, links }) => {
   const history = useHistory()
   const { user, logout } = useAuth()
   const [tab, setTab] = React.useState('PAGES')
   const { loading, data: { apps = [] } = {} } = useSubscription(APPS)
   return (
      <Styles.Sidebar visible={open}>
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
            <Styles.Pages onClick={() => toggle(visible => !visible)}>
               {links.map(({ id, title, onClick }) => (
                  <Styles.PageItem key={id} onClick={onClick}>
                     {title}
                  </Styles.PageItem>
               ))}
            </Styles.Pages>
         ) : (
            <Styles.Apps onClick={() => toggle(visible => !visible)}>
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
            {user?.name && <Avatar withName title={user?.name} url="" />}
            <button type="button" onClick={logout}>
               Sign Out
            </button>
         </Styles.Footer>
      </Styles.Sidebar>
   )
}
