import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import Loader from '../Loader'
import { useOrder } from '../../context/order'
import { FETCH_ORDER_MEALKIT } from '../../graphql'
import {
   Wrapper,
   StyledHeader,
   StyledMode,
   StyledMain,
   StyledStatus,
   StyledWeigh,
   StyledPackaging,
} from './styled'

import { WeighIcon } from '../../assets/icons'

export const ProcessOrder = ({ id }) => {
   const {
      state: { current_view },
      switchView,
   } = useOrder()
   const [order, setOrder] = React.useState(null)
   const { loading, error } = useSubscription(FETCH_ORDER_MEALKIT, {
      variables: {
         id,
      },
      onSubscriptionData: async ({
         subscriptionData: { data: { orderMealKitProduct = {} } = {} },
      }) => {
         setOrder(orderMealKitProduct)
      },
   })

   const changeView = view => {
      switchView(view)
   }

   if (!id) {
      return (
         <Wrapper>
            <StyledMode>
               <label htmlFor="mode">Mode</label>
               <select
                  name="mode"
                  value={current_view}
                  onChange={e => changeView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="WEIGHING">Weighing</option>
               </select>
            </StyledMode>
            <span>No product selected!</span>
         </Wrapper>
      )
   }
   if (loading || !order)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error)
      return (
         <Wrapper>
            <StyledMode>
               <label htmlFor="mode">Mode</label>
               <select
                  name="mode"
                  value={current_view}
                  onChange={e => changeView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="WEIGHING">Weighing</option>
               </select>
            </StyledMode>
            <span>{error.message}</span>
         </Wrapper>
      )
   return (
      <Wrapper>
         <StyledMode>
            <label htmlFor="mode">Mode</label>
            <select
               name="mode"
               value={current_view}
               onChange={e => changeView(e.target.value)}
            >
               <option value="SUMMARY">Summary</option>
               <option value="WEIGHING">Weighing</option>
            </select>
         </StyledMode>
         <StyledHeader>
            <h3>{order?.simpleRecipeProduct?.name}</h3>
         </StyledHeader>
         <StyledMain>
            <section>
               <h4>Salt</h4>
               <StyledStatus>Under Processing</StyledStatus>
            </section>
            <section>
               <span>Tata Salt</span>
               <span>Portioned</span>
               <span>25gm</span>
            </section>
            <StyledWeigh>
               <span>
                  <WeighIcon />
               </span>
               <h1>45gm</h1>
               <span>Reduce 20gm</span>
            </StyledWeigh>
         </StyledMain>
         <StyledPackaging>
            <h3>Packaging</h3>
            <span>2x2 ziplock</span>
            <div>
               <img src="#" alt="2x2 ziplock" />
            </div>
         </StyledPackaging>
      </Wrapper>
   )
}
