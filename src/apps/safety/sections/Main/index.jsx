import React from 'react'

// State
import { Context } from '../../context/tabs'

// Views
import { Home, SafetyChecksListing, SafetyForm } from '../../views'

const renderComponent = (type, view) => {
   // Listings
   if (type === 'listings' && view === 'checks') return <SafetyChecksListing />
   // Forms
   if (type === 'forms' && view === 'check') return <SafetyForm />
}

const Main = () => {
   const { state } = React.useContext(Context)
   if (state.listings.length === 0 && state.forms.length === 0) return <Home />
   return <main>{renderComponent(state.current.type, state.current.view)}</main>
}

export default Main
