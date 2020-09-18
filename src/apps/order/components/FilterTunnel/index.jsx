import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import DateTime from 'react-datetime'
import styled from 'styled-components'
import {
   Dropdown,
   TunnelHeader,
   Input,
   ClearIcon,
   RadioGroup,
} from '@dailykit/ui'

import { Spacer } from '../../styled'
import 'react-datetime/css/react-datetime.css'
import { useOrder, useConfig } from '../../context'
import { Flex } from '../../../../shared/components'

export const FilterTunnel = () => {
   const { state: config } = useConfig()
   const { state, dispatch } = useOrder()
   const [activeStation, setActiveStation] = React.useState(null)
   const [fulfillmentTypes] = React.useState([
      { id: 1, title: 'PREORDER_DELIVERY' },
      { id: 2, title: 'ONDEMAND_DELIVERY' },
      { id: 3, title: 'PREORDER_PICKUP' },
      { id: 4, title: 'ONDEMAND_PICKUP' },
   ])

   React.useEffect(() => {
      if (
         _.has(state, 'orders.where._or') &&
         _.isArray(state.orders.where._or) &&
         !_.isEmpty(state.orders.where._or)
      ) {
         const [condition] = state.orders.where._or
         const index = config.stations.findIndex(
            station =>
               station.id ===
               condition.orderInventoryProducts.assemblyStationId._eq
         )
         setActiveStation(index + 1)
      }
   }, [config.stations, state.orders.where])

   const handleStationChange = option => {
      dispatch({
         type: 'SET_FILTER',
         payload: {
            _or: [
               {
                  orderInventoryProducts: {
                     assemblyStationId: {
                        _eq: option.id,
                     },
                  },
               },
               {
                  orderReadyToEatProducts: {
                     assemblyStationId: {
                        _eq: option.id,
                     },
                  },
               },
               {
                  orderMealKitProducts: {
                     _or: [
                        {
                           assemblyStationId: {
                              _eq: option.id,
                           },
                        },
                        {
                           orderSachets: {
                              packingStationId: {
                                 _eq: option.id,
                              },
                           },
                        },
                     ],
                  },
               },
            ],
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Advanced Filters"
            close={() =>
               dispatch({
                  type: 'TOGGLE_FILTER_TUNNEL',
                  payload: { tunnel: false },
               })
            }
            right={{
               action: () =>
                  dispatch({
                     type: 'TOGGLE_FILTER_TUNNEL',
                     payload: { tunnel: false },
                  }),
               title: 'Close',
            }}
         />
         <Flex padding="16px">
            <Fieldset>
               <legend>
                  Ready By
                  <button
                     onClick={() => dispatch({ type: 'CLEAR_READY_BY_FILTER' })}
                  >
                     <ClearIcon />
                  </button>
               </legend>
               <section>
                  <DateTime
                     defaultValue={
                        state.orders.where?.readyByTimestamp?._gte
                           ? moment(
                                state.orders.where?.readyByTimestamp?._gte
                             ).format('YYYY-MM-DD HH:MM')
                           : ''
                     }
                     onBlur={data =>
                        dispatch({
                           type: 'SET_FILTER',
                           payload: {
                              readyByTimestamp: {
                                 ...state.orders.where.readyByTimestamp,
                                 _gte: moment(data).format('YYYY-MM-DD HH:MM'),
                              },
                           },
                        })
                     }
                  />
                  <DateTime
                     defaultValue={
                        state.orders.where?.readyByTimestamp?._lte
                           ? moment(
                                state.orders.where?.readyByTimestamp?._lte
                             ).format('YYYY-MM-DD HH:MM')
                           : ''
                     }
                     onBlur={data =>
                        dispatch({
                           type: 'SET_FILTER',
                           payload: {
                              readyByTimestamp: {
                                 ...state.orders.where.readyByTimestamp,
                                 _lte: moment(data).format('YYYY-MM-DD HH:MM'),
                              },
                           },
                        })
                     }
                  />
               </section>
            </Fieldset>
            <Spacer size="16px" />
            <Fieldset>
               <legend>
                  Fulfillment Time
                  <button
                     onClick={() =>
                        dispatch({ type: 'CLEAR_FULFILLMENT_FILTER' })
                     }
                  >
                     <ClearIcon />
                  </button>
               </legend>
               <section>
                  <DateTime
                     defaultValue={
                        state.orders.where?.fulfillmentTimestamp?._gte
                           ? moment(
                                state.orders.where?.fulfillmentTimestamp?._gte
                             ).format('YYYY-MM-DD HH:MM')
                           : ''
                     }
                     onBlur={data =>
                        dispatch({
                           type: 'SET_FILTER',
                           payload: {
                              fulfillmentTimestamp: {
                                 ...state.orders.where.fulfillmentTimestamp,
                                 _gte: moment(data).format('YYYY-MM-DD HH:MM'),
                              },
                           },
                        })
                     }
                  />
                  <DateTime
                     defaultValue={
                        state.orders.where?.fulfillmentTimestamp?._lte
                           ? moment(
                                state.orders.where?.fulfillmentTimestamp?._lte
                             ).format('YYYY-MM-DD HH:MM')
                           : ''
                     }
                     onBlur={data =>
                        dispatch({
                           type: 'SET_FILTER',
                           payload: {
                              fulfillmentTimestamp: {
                                 ...state.orders.where.fulfillmentTimestamp,
                                 _lte: moment(data).format('YYYY-MM-DD HH:MM'),
                              },
                           },
                        })
                     }
                  />
               </section>
            </Fieldset>
            <Spacer size="16px" />
            <Fieldset>
               <legend>
                  Source
                  <button
                     onClick={() => dispatch({ type: 'CLEAR_SOURCE_FILTER' })}
                  >
                     <ClearIcon />
                  </button>
               </legend>
               <RadioGroup
                  options={[
                     { id: 1, title: 'à la carte' },
                     { id: 2, title: 'Subscription' },
                  ]}
                  onChange={option =>
                     dispatch({
                        type: 'SET_FILTER',
                        payload: {
                           source: {
                              _eq:
                                 option.id === 1
                                    ? 'a-la-carte'
                                    : 'subscription',
                           },
                        },
                     })
                  }
               />
            </Fieldset>
            <Spacer size="16px" />
            <Fieldset>
               <legend>
                  Amount
                  <button
                     onClick={() => dispatch({ type: 'CLEAR_AMOUNT_FILTER' })}
                  >
                     <ClearIcon />
                  </button>
               </legend>
               <section>
                  <Input
                     type="text"
                     label=""
                     name="greater_than"
                     placeholder="greater than"
                     value={state.orders.where?.amountPaid?._gte || ''}
                     onChange={e =>
                        dispatch({
                           type: 'SET_FILTER',
                           payload: {
                              amountPaid: {
                                 ...state.orders.where?.amountPaid,
                                 _gte: Number(e.target.value),
                              },
                           },
                        })
                     }
                  />
                  <Input
                     type="text"
                     label=""
                     name="less_than"
                     placeholder="less than"
                     value={state.orders.where?.amountPaid?._lte || ''}
                     onChange={e =>
                        dispatch({
                           type: 'SET_FILTER',
                           payload: {
                              amountPaid: {
                                 ...state.orders.where?.amountPaid,
                                 _lte: Number(e.target.value),
                              },
                           },
                        })
                     }
                  />
               </section>
            </Fieldset>
            <Spacer size="16px" />
            <Fieldset>
               <legend>
                  Station
                  <button
                     onClick={() => dispatch({ type: 'CLEAR_STATION_FILTER' })}
                  >
                     <ClearIcon />
                  </button>
               </legend>
               {!_.isEmpty(config.stations) && (
                  <div className="station">
                     <Dropdown
                        type="single"
                        searchedOption={() => {}}
                        defaultValue={activeStation}
                        placeholder="search for stations..."
                        selectedOption={option => handleStationChange(option)}
                        options={config.stations.map(station => ({
                           id: station.id,
                           title: station.name,
                        }))}
                     />
                  </div>
               )}
            </Fieldset>
            <Spacer size="16px" />
            <Fieldset>
               <legend>
                  Fulfillment Type
                  <button
                     onClick={() =>
                        dispatch({ type: 'CLEAR_FULFILLMENT_TYPE_FILTER' })
                     }
                  >
                     <ClearIcon />
                  </button>
               </legend>
               <div className="fulfillmentType">
                  <Dropdown
                     type="single"
                     options={fulfillmentTypes}
                     searchedOption={() => {}}
                     defaultValue={
                        state.orders.where?.fulfillmentType?._eq
                           ? fulfillmentTypes.findIndex(
                                type =>
                                   type.title ===
                                   state.orders.where?.fulfillmentType?._eq
                             ) + 1
                           : null
                     }
                     placeholder="search for fulfillment types..."
                     selectedOption={option =>
                        dispatch({
                           type: 'SET_FILTER',
                           payload: { fulfillmentType: { _eq: option.title } },
                        })
                     }
                  />
               </div>
            </Fieldset>
         </Flex>
      </>
   )
}

const Fieldset = styled.section`
   position: relative;
   border-radius: 2px;
   margin-bottom: 16px;
   legend {
      color: rgb(136, 141, 157);
      font-size: 14px;
      display: flex;
      align-items: center;
      ~ div {
         height: 32px;
         margin-top: 8px;
      }
   }
   section {
      display: flex;
      align-items: center;
      > div {
         margin-right: 8px;
      }
   }
   > section {
      input[type='text'] {
         width: 100%;
         height: 32px;
         border: none;
         border-bottom: 1px solid #d8d8d8;
         :focus {
            outline: none;
         }
      }
   }
   select {
      width: 100%;
      height: 32px;
      border: none;
      border-bottom: 1px solid #d8d8d8;
      :focus {
         outline: none;
      }
   }
   button {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-left: 8px;
      background: #fff;
      border-radius: 50%;
      border: 1px solid #a2a0a0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      svg {
         stroke: #000;
      }
   }
   .station {
      > div > div:last-child {
         z-index: 100;
      }
   }
   .fulfillmentType {
      > div > div:last-child {
         z-index: 99;
      }
   }
`
