import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import {
   Home,
   AppsListing,
   RolesListing,
   UsersListing,
   DevicesListing,
   UserForm,
   RoleForm,
   DeviceForm,
   MasterListForm,
   StationsListing,
   StationForm,
   MasterList,
} from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/settings" exact>
               <Home />
            </Route>
            <Route path="/settings/apps" exact>
               <AppsListing />
            </Route>
            <Route path="/settings/users" exact>
               <UsersListing />
            </Route>
            <Route path="/settings/users/:name">
               <UserForm />
            </Route>
            <Route path="/settings/roles" exact>
               <RolesListing />
            </Route>
            <Route path="/settings/roles/:name">
               <RoleForm />
            </Route>
            <Route path="/settings/devices" exact>
               <DevicesListing />
            </Route>
            <Route path="/settings/devices/:name">
               <DeviceForm />
            </Route>
            <Route path="/settings/stations" exact>
               <StationsListing />
            </Route>
            <Route path="/settings/stations/:id">
               <StationForm />
            </Route>
            <Route path="/settings/master-lists" exact>
               <MasterList />
            </Route>
            <Route path="/settings/master-lists/:list">
               <MasterListForm />
            </Route>
            {/* <Route path="/settings/store-settings">
               <StoreSettingsForm />
            </Route> */}
         </Switch>
      </main>
   )
}

export default Main
