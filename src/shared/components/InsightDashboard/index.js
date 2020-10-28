import React from 'react'
import { INSIGHT } from './query'
import { useQuery } from '@apollo/react-hooks'
import Insight from '../Insight'

export default function InsightDashboard({ appTitle, moduleTitle, variables }) {
   const { data: { insights_insights: insights = [] } = {} } = useQuery(
      INSIGHT,
      {
         variables: {
            options: {
               isActive: { _eq: true },
               apps_modules: {
                  appTitle: { _eq: appTitle },
                  moduleTitle: { _eq: moduleTitle },
               },
            },
         },
         onError: error => {
            console.log(error)
         },
      }
   )
   return (
      <div>
         {insights.map(insight => {
            return (
               <Insight
                  key={insight.identifier}
                  identifier={insight.identifier}
                  variables={variables}
               />
            )
         })}
      </div>
   )
}
