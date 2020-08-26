import React from 'react'
import moment from 'moment'
import DateTime from 'react-datetime'
import styled from 'styled-components'
import { useSubscription } from '@apollo/react-hooks'
import { TunnelHeader, Input, ClearIcon, RadioGroup } from '@dailykit/ui'

import { useOrder } from '../../context'
import { STATIONS } from '../../graphql'
import 'react-datetime/css/react-datetime.css'
import { Flex } from '../../../../shared/components'

export const FilterTunnel = () => {
   const { state, dispatch } = useOrder()
   const { data: { stations = [] } = {} } = useSubscription(STATIONS)
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
               <select
                  id="fulfillment"
                  name="fulfillment"
                  value={
                     state.orders.where?.fulfillmentType?._eq ||
                     'PREORDER_DELIVERY'
                  }
                  onChange={e =>
                     dispatch({
                        type: 'SET_FILTER',
                        payload: { fulfillmentType: { _eq: e.target.value } },
                     })
                  }
               >
                  <option name="PREORDER_DELIVERY" value="PREORDER_DELIVERY">
                     Preorder Delivery
                  </option>
                  <option name="ONDEMAND_DELIVERY" value="ONDEMAND_DELIVERY">
                     Ondemand Delivery
                  </option>
                  <option name="PREORDER_PICKUP" value="PREORDER_PICKUP">
                     Preorder Pickup
                  </option>
                  <option name="ONDEMAND_PICKUP" value="ONDEMAND_PICKUP">
                     Ondemand Pickup
                  </option>
               </select>
            </Fieldset>
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
            <Fieldset>
               <legend>
                  Station
                  <button
                     onClick={() => dispatch({ type: 'CLEAR_STATION_FILTER' })}
                  >
                     <ClearIcon />
                  </button>
               </legend>
               <select
                  id="station"
                  name="station"
                  value={
                     state.orders.where?._or?.length > 0
                        ? state.orders.where?._or[0]?.orderInventoryProducts
                             ?.assemblyStationId?._eq
                        : ''
                  }
                  onChange={e =>
                     dispatch({
                        type: 'SET_FILTER',
                        payload: {
                           _or: [
                              {
                                 orderInventoryProducts: {
                                    assemblyStationId: {
                                       _eq: Number(e.target.value),
                                    },
                                 },
                              },
                              {
                                 orderReadyToEatProducts: {
                                    assemblyStationId: {
                                       _eq: Number(e.target.value),
                                    },
                                 },
                              },
                           ],
                        },
                     })
                  }
               >
                  {stations.length > 0 &&
                     stations.map(station => (
                        <option
                           key={station.id}
                           value={station.id}
                           name={station.title}
                        >
                           {station.title}
                        </option>
                     ))}
               </select>
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
   input[type='text'] {
      width: 100%;
      height: 32px;
      border: none;
      border-bottom: 1px solid #d8d8d8;
      :focus {
         outline: none;
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
`
