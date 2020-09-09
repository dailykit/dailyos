import React from 'react'
import styled from 'styled-components'
import { TextButton, TunnelHeader } from '@dailykit/ui'

import Condition from './Condition'
import { useConditions } from './context'

const MainTunnel = ({ id, onSave, openTunnel, closeTunnel }) => {
   const { state, dispatch } = useConditions()

   const save = () => {
      //mutation: onSave
   }

   const fetchData = () => {
      // query: id
      dispatch({
         type: 'DATA',
         payload: {
            data: {
               id: 909090,
               all: [],
            },
         },
      })
   }

   React.useEffect(() => {
      fetchData()
   }, [])

   return (
      <>
         <TunnelHeader
            title="Add Conditions"
            right={{ action: save, title: 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            <Info> Whether All or Any Condition should be matched </Info>
            {state.data ? (
               <Condition
                  data={state.data}
                  nodeId={state.data.id}
                  openTunnel={openTunnel}
               />
            ) : (
               <TextButton
                  type="ghost"
                  onClick={() =>
                     dispatch({
                        type: 'DATA',
                        payload: {
                           data: {
                              id: 121313131,
                              all: [],
                           },
                        },
                     })
                  }
               >
                  Add Condition
               </TextButton>
            )}
         </TunnelBody>
      </>
   )
}

export default MainTunnel

const Info = styled.p`
   font-family: Roboto;
   font-style: italic;
   font-weight: normal;
   font-size: 12px;
   line-height: 14px;
   color: #888d9d;
`

const TunnelBody = styled.div`
   padding: 16px;
`
