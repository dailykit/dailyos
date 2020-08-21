import React from 'react'
import moment from 'moment'
import DateTime from 'react-datetime'
import { ClearIcon } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

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
            <legend>Ready By</legend>
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
            <button onClick={() => dispatch({ type: 'CLEAR_READY_BY_FILTER' })}>
               <ClearIcon />
            </button>
         </Fieldset>
         <Fieldset>
            <legend>Fulfillment Time</legend>
            <section>
               <DateTime
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
            <button
               onClick={() => dispatch({ type: 'CLEAR_FULFILLMENT_FILTER' })}
            >
               <ClearIcon />
            </button>
         </Fieldset>
      </Wrapper>
   )
}
