import React from 'react'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { Text, Toggle, TunnelHeader, Dropdown } from '@dailykit/ui'

import { useConfig } from '../../context'
import { Main, Sidebar, Content } from './styled'
import { Spacer } from '../../../../shared/styled'
import { DEVICES, UPDATE_SETTING } from '../../graphql'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Flex, InlineLoader } from '../../../../shared/components'

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
               <KotSection />
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
      { to: '#kot', title: 'KOT' },
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

const KotSection = () => {
   return (
      <section id="kot">
         <Text as="title">KOT</Text>
         <GroupByStation />
         <GroupByProductType />
         <PrintAuto />
         <DefaultKOTPrinter />
      </section>
   )
}

const GroupByStation = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING)

   const handleChange = value => {
      update({
         variables: {
            app: { _eq: 'order' },
            identifier: { _eq: 'group by station' },
            type: { _eq: 'kot' },
            _set: {
               value: { isActive: value },
            },
         },
      })
   }

   return (
      <div>
         <Toggle
            label="Group by stations"
            setChecked={value => handleChange(value)}
            checked={state.kot.group_by_station.value.isActive}
         />
      </div>
   )
}

const GroupByProductType = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING)

   const handleChange = value => {
      update({
         variables: {
            app: { _eq: 'order' },
            identifier: { _eq: 'group by product type' },
            type: { _eq: 'kot' },
            _set: {
               value: { isActive: value },
            },
         },
      })
   }

   return (
      <div>
         <Toggle
            label="Group by product type"
            setChecked={value => handleChange(value)}
            checked={state.kot.group_by_product_type.value.isActive}
         />
      </div>
   )
}

const PrintAuto = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING)

   const handleChange = value => {
      update({
         variables: {
            app: { _eq: 'order' },
            identifier: { _eq: 'print automatically' },
            type: { _eq: 'kot' },
            _set: {
               value: { isActive: value },
            },
         },
      })
   }

   return (
      <div>
         <Toggle
            label="Print automatically"
            setChecked={value => handleChange(value)}
            checked={state.kot.print_automatically.value.isActive}
         />
      </div>
   )
}

const DefaultKOTPrinter = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING)
   const [printers, setPrinters] = React.useState([])
   const [isLoading, setIsLoading] = React.useState(true)
   const [defaultIndex, setDefaultIndex] = React.useState(1)
   useQuery(DEVICES.PRINTERS, {
      variables: {
         type: {
            _eq: 'KOT_PRINTER',
         },
      },
      onCompleted: ({ printers: list = [] }) => {
         if (!isEmpty(list)) {
            setPrinters(
               list.map((node, index) => ({
                  id: index + 1,
                  title: node.name,
                  description: node.printNodeId,
               }))
            )
            if (state.kot.default_kot_printer.value.printNodeId) {
               const index = list.findIndex(
                  node =>
                     node.printNodeId ===
                     state.kot.default_kot_printer.value.printNodeId
               )
               if (index !== -1) {
                  setDefaultIndex(index + 1)
               }
            }
         }
         setIsLoading(false)
      },
   })

   const handleChange = value => {
      update({
         variables: {
            app: { _eq: 'order' },
            identifier: { _eq: 'default kot printer' },
            type: { _eq: 'kot' },
            _set: {
               value: { printNodeId: value.description },
            },
         },
      })
   }

   return (
      <div>
         <Flex container alignItems="center">
            <Title>Default KOT Printer</Title>
            <Spacer size="48px" xAxis />
            {isLoading ? (
               <InlineLoader />
            ) : (
               <Flex flex="1">
                  <Dropdown
                     type="single"
                     options={printers}
                     searchedOption={() => {}}
                     defaultValue={defaultIndex}
                     selectedOption={handleChange}
                     placeholder="type what you're looking for..."
                  />
               </Flex>
            )}
         </Flex>
      </div>
   )
}

const Title = styled.span`
   color: #555b6e;
   cursor: pointer;
   margin-right: 8px;
`
