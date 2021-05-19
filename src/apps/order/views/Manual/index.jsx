import React from 'react'
import styled from 'styled-components'

import { ManualProvider } from './state'
import { Aside, Main, Footer } from './sections'
import { useTabs } from '../../../../shared/providers'

export const Manual = () => {
   const { tab, addTab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab('Manual', '/order/manual')
      }
   }, [tab, addTab])
   return (
      <ManualProvider>
         <ManualContent />
      </ManualProvider>
   )
}

const ManualContent = () => {
   return (
      <Styles.Layout>
         <Main />
         <Aside />
         <Footer />
      </Styles.Layout>
   )
}

const Styles = {
   Layout: styled.div`
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 460px;
      grid-template-rows: 1fr 80px;
      grid-template-areas: 'main aside' 'footer aside';
   `,
}
