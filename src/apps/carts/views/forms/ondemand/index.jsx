import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'

import { ManualProvider } from './state'
import { Aside, Main, Footer } from './sections'
import { useTabs } from '../../../../../shared/providers'

export const OnDemand = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab(params.id, `/carts/ondemand/${params.id}`)
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
      grid-template-rows: 1fr 40px;
      grid-template-columns: repeat(2, 1fr);
      grid-template-areas: 'main aside' 'footer aside';
   `,
}
