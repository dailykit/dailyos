import React from 'react'
import moment from 'moment'
import DateTime from 'react-datetime'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'
import { ClearIcon, RadioGroup, Input } from '@dailykit/ui'

import 'react-datetime/css/react-datetime.css'

import Loader from '../Loader'
import { useOrder } from '../../context'
import { MetricItem } from '../MetricItem'
import { Wrapper, Fieldset } from './styled'
import { ORDER_BY_STATUS } from '../../graphql'

const address = 'apps.order.components.ordersummary.'
export const OrderSummary = () => {
   const { state, dispatch } = useOrder()
   const { t } = useTranslation()
   const {
      loading,
      error,
      data: { orderByStatus = [] } = {},
   } = useSubscription(ORDER_BY_STATUS)

   if (loading)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error) return <Wrapper>{error.message}</Wrapper>
   return (
      <Wrapper>
         <h2>{t(address.concat('quick info'))}</h2>
         <ul>
            {orderByStatus.map(({ value, orders }) => (
               <MetricItem
                  key={value}
                  currency="usd"
                  variant={value}
                  count={orders.aggregate.count}
                  title={value.split('_').join(' ')}
                  amount={orders.aggregate.sum.amount || 0}
                  average={orders.aggregate.avg.amountPaid || 0}
               />
            ))}
         </ul>
         <h2>Filters</h2>
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
                  onClick={() => dispatch({ type: 'CLEAR_FULFILLMENT_FILTER' })}
               >
                  <ClearIcon />
               </button>
            </legend>
            <section>
               <DateTime
                  value={moment().format('YYYY-MM-DD HH:MM')}
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
                           _eq: option.id === 1 ? 'a-la-carte' : 'subscription',
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
      </Wrapper>
   )
}
