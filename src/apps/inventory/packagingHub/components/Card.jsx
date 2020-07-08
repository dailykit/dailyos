import React, { useContext } from 'react'
import styled from 'styled-components'

import { Context } from '../../context/tabs'

export default function Card({ category }) {
   const { dispatch } = useContext(Context)

   const openProductsView = () => {
      dispatch({
         type: 'ADD_TAB',
         payload: {
            type: 'forms',
            title: category.name,
            view: 'packagingHubProducts',
            id: category.id,
         },
      })
   }

   return (
      <StyledCard onClick={openProductsView}>
         <h4>{category.name}</h4>
         <button onClick={openProductsView} type="button">
            {'>>'}
         </button>
      </StyledCard>
   )
}

const StyledCard = styled.div`
   flex: 1;
   height: 250px;
   padding: 40px;

   display: flex;
   flex-direction: column;
   justify-content: flex-end;

   cursor: pointer;

   position: relative;

   background: ${({ assets }) =>
      (Array.isArray(assets) && `url(${assets[0]?.url}) no-repeat`) || ''};
   background-size: cover;

   &:hover {
      filter: brightness(0.9);
   }

   h3 {
      font-weight: 500;
      font-size: 28px;
      line-height: 27px;

      color: #ffffff;
   }

   button {
      position: absolute;
      color: #fff;
      background-color: transparent;
      border: 0;

      bottom: 2rem;
      right: 2rem;
   }
`
