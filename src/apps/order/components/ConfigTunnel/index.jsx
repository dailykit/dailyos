import React from 'react'
import { useLocation } from 'react-router-dom'
import { Text, Toggle, TunnelHeader } from '@dailykit/ui'

import { useConfig } from '../../context'
import { Main, Sidebar, Content } from './styled'
import { useMutation } from '@apollo/react-hooks'
import { UPSERT_SETTING } from '../../graphql'

export const ConfigTunnel = () => {
   const { dispatch } = useConfig()

   const clostTunnel = () =>
      dispatch({
         type: 'TOGGLE_TUNNEL',
         payload: { tunnel: false },
      })

   return (
      <>
         <TunnelHeader
            title="Advanced Filters"
            close={() => clostTunnel()}
            right={{
               title: 'Close',
               action: () => clostTunnel(),
            }}
         />
         <Main>
            <Sidebar>
               <Navbar />
            </Sidebar>
            <Content>
               <ScaleSection />
            </Content>
         </Main>
      </>
   )
}

const Navbar = () => {
   const location = useLocation()
   const [active, setActive] = React.useState('#scale')
   const [links] = React.useState([{ to: '#scale', title: 'Scale' }])

   React.useEffect(() => {
      setActive(location.hash)
   }, [location.hash])

   return (
      <ul>
         {links.map(link => (
            <li key={link}>
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
   const [upsert] = useMutation(UPSERT_SETTING)

   const handleChange = value => {
      upsert({
         variables: {
            object: {
               ...state.scale.weight_simulation,
               value: { value },
            },
         },
      })
   }

   return (
      <div>
         <Toggle
            label="Weight Simulation"
            setChecked={value => handleChange(value)}
            checked={state.scale.weight_simulation.value.value}
         />
      </div>
   )
}
