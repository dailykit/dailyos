import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Flex, Form, Text, TunnelHeader, Dropdown, Spacer } from '@dailykit/ui'

import { useConfig } from '../../context'
import { Main, Sidebar, Content } from './styled'
import { logger } from '../../../../shared/utils'
import { DEVICES, UPDATE_SETTING } from '../../graphql'
import { InlineLoader, Tooltip } from '../../../../shared/components'

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
            tooltip={<Tooltip identifier="app_order_tunnel_config_heading" />}
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
   const [update] = useMutation(UPDATE_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated the setting!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the setting!')
      },
   })

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
         <Form.Toggle
            name="weight_simulation"
            value={state.scale.weight_simulation.value.isActive}
            onChange={() =>
               handleChange(!state.scale.weight_simulation.value.isActive)
            }
         >
            <Flex container alignItems="center">
               Weight Simulation
               <Tooltip identifier="app_order_tunnel_field_weight_simulation" />
            </Flex>
         </Form.Toggle>
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
   const [update] = useMutation(UPDATE_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated the setting!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the setting!')
      },
   })

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
         <Form.Toggle
            name="print_simulation"
            value={state.print.print_simulation.value.isActive}
            onChange={() =>
               handleChange(!state.print.print_simulation.value.isActive)
            }
         >
            <Flex container alignItems="center">
               Print Simulation
               <Tooltip identifier="app_order_tunnel_field_print_simulation" />
            </Flex>
         </Form.Toggle>
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
   const [update] = useMutation(UPDATE_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated the setting!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the setting!')
      },
   })

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
         <Form.Toggle
            name="group_by_stations"
            value={state.kot.group_by_station.value.isActive}
            onChange={() =>
               handleChange(!state.kot.group_by_station.value.isActive)
            }
         >
            <Flex container alignItems="center">
               Group by stations
               <Tooltip identifier="app_order_tunnel_field_group_by_station" />
            </Flex>
         </Form.Toggle>
      </div>
   )
}

const GroupByProductType = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated the setting!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the setting!')
      },
   })

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
         <Form.Toggle
            name="group_by_product_type"
            value={state.kot.group_by_product_type.value.isActive}
            onChange={() =>
               handleChange(!state.kot.group_by_product_type.value.isActive)
            }
         >
            <Flex container alignItems="center">
               Group by product type
               <Tooltip identifier="app_order_tunnel_field_group_by_product_type" />
            </Flex>
         </Form.Toggle>
      </div>
   )
}

const PrintAuto = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated the setting!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the setting!')
      },
   })

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
         <Form.Toggle
            name="print_automatically"
            value={state.kot.print_automatically.value.isActive}
            onChange={() =>
               handleChange(!state.kot.print_automatically.value.isActive)
            }
         >
            <Flex container alignItems="center">
               Print automatically
               <Tooltip identifier="app_order_tunnel_field_print_automatically" />
            </Flex>
         </Form.Toggle>
      </div>
   )
}

const DefaultKOTPrinter = () => {
   const { state } = useConfig()
   const [update] = useMutation(UPDATE_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated the setting!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the setting!')
      },
   })
   const [printers, setPrinters] = React.useState([])
   const [isLoading, setIsLoading] = React.useState(true)
   const [defaultIndex, setDefaultIndex] = React.useState(null)
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
            <Flex container alignItems="center">
               <Text as="p">Default KOT Printer</Text>
               <Tooltip identifier="app_order_tunnel_field_print_automatically" />
            </Flex>
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
