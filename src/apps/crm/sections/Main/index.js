import React from 'react'

import styled from 'styled-components'

// State
import { Context } from '../../context/tabs'

// Views
import { Home, CustomerListing } from '../../views'

const renderComponent = (type, view) => {
   // Listings
   if (type === 'listings' && view === 'customer') return <CustomerListing />
   // Forms
   // if (type === 'forms' && view === 'customer') return <CustomerForm />
}

const MainWrapper = styled.main`
   overflow-x: auto;
`

const Main = () => {
   const { state } = React.useContext(Context)
   if (state.listings.length === 0 && state.forms.length === 0) return <Home />
   return (
      <MainWrapper>
         {renderComponent(state.current.type, state.current.view)}
      </MainWrapper>
   )
}

export default Main
