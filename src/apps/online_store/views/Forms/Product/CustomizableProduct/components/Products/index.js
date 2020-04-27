import React from 'react'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import {
   StyledListing,
   StyledLayout,
   StyledListingTile,
   StyledPanel,
} from './styled'
import { ButtonTile, Input } from '@dailykit/ui'

const Products = ({ openTunnel, view }) => {
   const { state, dispatch } = React.useContext(SimpleProductContext)

   const [_state, _setState] = React.useState({
      products: [],
      currentProduct: '',
      discount: '',
   })

   React.useEffect(() => {
      if (state.meta.accompanimentType) {
         const index = state.accompaniments.findIndex(
            el => el.type === state.meta.accompanimentType
         )
         _setState({
            ..._state,
            products: state.accompaniments[index].products,
         })
      }
   }, [state.meta.accompanimentType])

   React.useEffect(() => {
      if (_state.products.length) {
         _setState({
            ..._state,
            currentProduct: _state.products[0],
         })
      }
   }, [_state.products])

   React.useEffect(() => {
      if (_state.currentProduct) {
         _setState({
            ..._state,
            discount: _state.currentProduct.discount.value,
         })
      }
   }, [_state.currentProduct])

   return (
      <React.Fragment>
         {_state.products.length ? (
            <StyledLayout>
               <StyledListing>
                  {_state.products.map(product => (
                     <StyledListingTile
                        key={product.id}
                        active={_state.currentProduct.id === product.id}
                        onClick={() =>
                           _setState({ ..._state, currentProduct: product })
                        }
                     >
                        {product.title}
                     </StyledListingTile>
                  ))}
               </StyledListing>
               <StyledPanel>
                  <h2>{_state.currentProduct.title}</h2>
                  <Input
                     type="text"
                     label="Discount as Accompaniment"
                     name="discount"
                     value={_state.discount}
                     onChange={e =>
                        _setState({ ..._state, discount: e.target.value })
                     }
                     onBlur={e =>
                        dispatch({
                           type: 'ACCOMPANIMENT_DISCOUNT',
                           payload: {
                              id: _state.currentProduct.id,
                              value: e.target.value,
                           },
                        })
                     }
                  />
               </StyledPanel>
            </StyledLayout>
         ) : (
            <ButtonTile
               type="secondary"
               text="Add Products"
               onClick={() => openTunnel(4)}
            />
         )}
      </React.Fragment>
   )
}

export default Products
