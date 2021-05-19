import React from 'react'
import styled, { css } from 'styled-components'

import { Aside, Main, Footer } from './sections'
import { ManualProvider, useManual } from './state'
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
   const { state } = useManual()
   return (
      <Styles.Layout mode={state.mode}>
         <Main />
         <Aside />
         <Footer />
      </Styles.Layout>
   )
}

const Styles = {
   Layout: styled.div(
      ({ mode }) => css`
         height: 100%;
         display: grid;
         grid-template-columns: 1fr 460px;
         grid-template-areas: 'main aside' 'footer aside';
         grid-template-rows: 1fr ${mode === 'ondemand' ? '40px' : '80px'};
      `
   ),
}
