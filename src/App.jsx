import React from 'react'
import gql from 'graphql-tag'
import Loadable from 'react-loadable'
import { Loader } from '@dailykit/ui'
import styled from 'styled-components'
import { useSubscription } from '@apollo/react-hooks'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { isKeycloakSupported } from './shared/utils'
import { Lang, RedirectBanner } from './shared/components'

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

const App = () => {
   const { loading, data: { apps = [] } = {} } = useSubscription(APPS)
   if (loading) return <Loader />
   return (
      <>
         <Router basename={process.env.PUBLIC_URL}>
            <Switch>
               <Route path="/" exact>
                  <AppList>
                     {apps.map(app => (
                        <AppItem>
                           <Link key={app.id} to={app.route}>
                              {app.icon && (
                                 <img src={app.icon} alt={app.title} />
                              )}
                              <span>{app.title}</span>
                           </Link>
                        </AppItem>
                     ))}
                  </AppList>
               </Route>
               {apps.map(app => (
                  <Route
                     key={app.id}
                     path={app.route}
                     component={Loadable({
                        loading: Loader,
                        loader: () => import(`./apps${app.route}`),
                     })}
                  />
               ))}
            </Switch>
         </Router>
         {!isKeycloakSupported() && <RedirectBanner />}
         <Lang />
      </>
   )
}

export default App

const AppList = styled.ul`
   display: grid;
   margin: 0 auto;
   grid-gap: 16px;
   max-width: 1180px;
   padding-top: 16px;
   width: calc(100vw - 40px);
   grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`

const AppItem = styled.li`
   height: 48px;
   list-style: none;
   a {
      width: 100%;
      color: #2f256f;
      height: 100%;
      display: flex;
      padding: 0 14px;
      border-radius: 2px;
      align-items: center;
      border: 1px solid #e0e0e0;
      text-decoration: none;
      transition: 0.4s ease-in-out;
      :hover {
         background: #f8f8f8;
      }
      img {
         height: 32px;
         width: 32px;
         margin-right: 14px;
         display: inline-block;
      }
   }
`
