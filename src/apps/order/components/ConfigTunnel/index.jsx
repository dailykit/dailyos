import React from 'react'
import { useLocation } from 'react-router-dom'
import { Text, Toggle, TunnelHeader } from '@dailykit/ui'

import { useConfig } from '../../context'
import { Main, Sidebar, Content } from './styled'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_SETTING } from '../../graphql'

export const ConfigTunnel = () => {
   const { dispatch } = useConfig()

   const closeTunnel = () =>
      dispatch({
         type: 'TOGGLE_TUNNEL',
         payload: { tunnel: false },
      })

   return (
      <>
         <TunnelHeader
            title="Advanced Filters"
            close={() => closeTunnel()}
            right={{
               title: 'Close',
               action: () => closeTunnel(),
            }}
         />
         <Main>
            <Sidebar>
               <Navbar />
            </Sidebar>
            <Content>
               <ScaleSection />
               <PrintSection />
            </Content>
         </Main>
      </>
   )
}

const Navbar = () => {
   const location = useLocation()
   const [active, setActive] = React.useState('#scale')
   const [links] = React.useState([
      { to: '#scale', title: 'Scale' },
      { to: '#print', title: 'Print' },
   ])

   React.useEffect(() => {
      setActive(location.hash)
   }, [location.hash])

   return (
      <ul>
         {links.map((link, index) => (
            <li key={`${link}-${index}`}>
               <a href={link.to} className={active === link.to ? 'active' : ''}>
                  {link.title}
               </a>
            </li>
         ))}
      </ul>
   )
}

const ScaleSection = () => {
   return (
      <section id="scale">
         <Text as="title">Scale</Text>
         <WeightSimulation />
      </section>
   )
}

const WeightSimulation = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING)

   const handleChange = value => {
      update({
         variables: {
            app: { _eq: 'order' },
            identifier: { _eq: 'weight simulation' },
            type: { _eq: 'scale' },
            _set: {
               value: { isActive: value },
            },
         },
      })
   }

   return (
      <div>
         <Toggle
            label="Weight Simulation"
            setChecked={value => handleChange(value)}
            checked={state.scale.weight_simulation.value.isActive}
         />
      </div>
   )
}

const PrintSection = () => {
   return (
      <section id="print">
         <Text as="title">Print</Text>
         <PrintSimulation />
      </section>
   )
}

const PrintSimulation = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING)

   const handleChange = value => {
      update({
         variables: {
            app: { _eq: 'order' },
            identifier: { _eq: 'print simulation' },
            type: { _eq: 'print' },
            _set: {
               value: { isActive: value },
            },
         },
      })
   }

   return (
      <div>
         <Toggle
            label="Print Simulation"
            setChecked={value => handleChange(value)}
            checked={state.print.print_simulation.value.isActive}
         />
      </div>
   )
}
