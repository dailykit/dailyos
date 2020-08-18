import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { NOTIFICATION_TYPES } from '../../../graphql/subscriptions/index'
import { useSubscription } from '@apollo/react-hooks'
import { useTabs } from '../../../context'
import { Loader, Table, TableHead, TableCell, TableRow } from '@dailykit/ui'
import { StyledLayout, Container, Grid, Link } from './styled'

const Layout = props => {
   let tables = () => {
      props.list.map(item => {
         return <h1>{item.app}</h1>
      })
   }
   return (
      <>
         <h1>{props.title + ' App'}</h1>
         {tables}
      </>
   )
}

const Notifications = () => {
   const history = useHistory()
   const { tabs, addTab } = useTabs()

   React.useEffect(() => {
      const tabIndex =
         tabs.findIndex(item => item.path === `/settings/notifications`) || {}
      if (tabIndex === -1) {
         addTab('Notifications', '/settings/notifications')
      }
   }, [history, tabs])

   const { loading, error, data } = useSubscription(NOTIFICATION_TYPES)
   if (loading) {
      return <Loader />
   }
   if (error) {
      return console.log(error)
   }

   if (data) {
      const notifications = data.notificationTypes

      let apps = new Set()
      notifications.map(notification => {
         apps.add(notification.app)
      })
      apps = [...apps]
      let sideItems = apps.map(app => {
         return (
            <Grid cols="1" key={app}>
               <Link href="#order">{app}</Link>
            </Grid>
         )
      })

      return (
         <>
            <StyledLayout>
               <Container height="100" color="#F3F3F3">
                  <Container top="30">{sideItems}</Container>
               </Container>

               <div>
                  <div id="Order"></div>
                  <div id="Recipe"></div>
                  <div id="Settings"></div>
               </div>
            </StyledLayout>
         </>
      )
   }
}
export default Notifications
