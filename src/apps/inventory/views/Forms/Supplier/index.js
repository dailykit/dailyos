import React, { useContext, useState, useReducer, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'

import {
   Input,
   TextButton,
   ButtonTile,
   Text,
   Tunnels,
   Tunnel,
   useTunnel,
   IconButton,
} from '@dailykit/ui/'

import { Context } from '../../../context/tabs'
import {
   SupplierContext,
   state as initialState,
   reducers,
} from '../../../context/supplier'

import { CREATE_SUPPLIER, UPDATE_SUPPLIER } from '../../../graphql'

import { FormHeading, ContactCard, AddressCard } from '../../../components'
import AddressTunnel from './Tunnels/AddressTunnel'
import PersonContactTunnel from './Tunnels/PersonContactTunnel'
import { FormActions, StyledWrapper, FlexContainer } from '../styled'
import { Container } from './styled'
import EditIcon from '../../../assets/icons/Edit'

export default function SupplierForm() {
   const [name, setName] = useState('')
   const [paymentTerms, setPaymentTerms] = useState('')
   const [shippingTerms, setShippingTerms] = useState('')

   const { state, dispatch } = useContext(Context)
   const [supplierState, supplierDispatch] = useReducer(reducers, initialState)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   const [createSupplier] = useMutation(CREATE_SUPPLIER)
   const [updateSupplier] = useMutation(UPDATE_SUPPLIER)

   useEffect(() => {
      if (state.supplierId) {
         supplierDispatch({ type: 'SET_ID', payload: state.supplierId })
      }
   }, [])

   const handleSave = async () => {
      const data = {
         name: supplierState.name,
         paymentTerms: supplierState.terms.paymentTerms,
         shippingTerms: supplierState.terms.shippingTerms,
         contactPerson: supplierState.contact,
         address: supplierState.address,
         available: false,
      }

      if (supplierState.id) {
         const res = await updateSupplier({
            variables: { id: supplierState.id, object: data },
         })
         const {
            data: {
               updateSupplier: { returning: result },
            },
         } = res

         if (result[0]?.id) {
            console.log('updated')
            supplierDispatch({ type: 'SET_ID', payload: result[0]?.id })
         }
      } else {
         const res = await createSupplier({ variables: { object: data } })
         const {
            data: {
               createSupplier: { returning: result },
            },
         } = res

         if (result[0]?.id)
            supplierDispatch({ type: 'SET_ID', payload: result[0]?.id })
      }
   }

   const handleTabNameChange = async title => {
      supplierDispatch({ type: 'SET_NAME', payload: title })
      if (title.length > 0) {
         dispatch({
            type: 'SET_TITLE',
            payload: { title, oldTitle: state.current.title },
         })
      } else {
         dispatch({
            type: 'SET_TITLE',
            payload: {
               title: 'Untitled Supplier',
               oldTitle: state.current.title,
            },
         })
      }
   }

   return (
      <>
         <SupplierContext.Provider value={{ supplierState, supplierDispatch }}>
            <Tunnels tunnels={tunnels}>
               <Tunnel size="lg" layer={1}>
                  <AddressTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={2}>
                  <PersonContactTunnel close={closeTunnel} />
               </Tunnel>
            </Tunnels>
            <StyledWrapper>
               <FormHeading>
                  <div>
                     <Input
                        label="Untitled Supplier"
                        type="text"
                        name="supplierName"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={() => handleTabNameChange(name)}
                     />
                  </div>

                  <FormActions>
                     <TextButton
                        onClick={() => handleSave()}
                        type="ghost"
                        style={{ margin: '0px 10px' }}
                     >
                        {supplierState?.id ? 'Update' : 'Save'}
                     </TextButton>

                     <TextButton
                        onClick={() => {}}
                        type="solid"
                        style={{ margin: '0px 10px' }}
                     >
                        Submit
                     </TextButton>
                  </FormActions>
               </FormHeading>
               <Container>
                  <ButtonTile
                     onClick={() => {}}
                     type="primary"
                     size="lg"
                     text="Add logo of the Supplier"
                     helper="upto 1MB &#8226; only JPGs, PNGs, and PDFs are allowed."
                  />

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">Address</Text>
                     <hr
                        style={{
                           border: '1px solid #D8D8D8',
                           width: '100%',
                           marginLeft: '5px',
                        }}
                     />
                     {supplierState.address?.location ||
                     supplierState.address?.address1 ? (
                        <IconButton onClick={() => openTunnel(1)} type="ghost">
                           <EditIcon />
                        </IconButton>
                     ) : null}
                  </FlexContainer>

                  {supplierState.address?.location ||
                  supplierState.address?.city ? (
                     <AddressCard
                        address={
                           supplierState.address?.location ||
                           `${supplierState.address?.address1}, ${supplierState.address?.address2}`
                        }
                        zip={supplierState.address?.zip}
                        city={supplierState.address?.city}
                        image="https://via.placeholder.com/80x50"
                     />
                  ) : (
                     <ButtonTile
                        type="secondary"
                        text="Add Address"
                        onClick={() => openTunnel(1)}
                        style={{ margin: '20px 0' }}
                     />
                  )}

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">Person of Contact</Text>
                     <hr
                        style={{
                           border: '1px solid #D8D8D8',
                           width: '100%',
                           marginLeft: '5px',
                        }}
                     />

                     {supplierState.contact.email ||
                     supplierState.contact.firstName ? (
                        <IconButton onClick={() => openTunnel(2)} type="ghost">
                           <EditIcon />
                        </IconButton>
                     ) : null}
                  </FlexContainer>

                  {supplierState.contact.firstName &&
                  supplierState.contact.email ? (
                     <ContactCard
                        name={`${supplierState.contact.firstName} ${supplierState.contact.lastName}`}
                        image={`https://via.placeholder.com/32`}
                     />
                  ) : (
                     <ButtonTile
                        type="secondary"
                        text="Add Person of Contact"
                        onClick={() => openTunnel(2)}
                        style={{ margin: '20px 0' }}
                     />
                  )}

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">Terms and Conditions</Text>
                     <hr
                        style={{
                           border: '1px solid #D8D8D8',
                           width: '100%',
                           marginLeft: '5px',
                        }}
                     />
                  </FlexContainer>

                  <br />

                  <Input
                     type="textarea"
                     placeholder="Payment Terms"
                     name="paymentTerms"
                     rows="4"
                     value={paymentTerms}
                     onChange={e => setPaymentTerms(e.target.value)}
                     onBlur={() =>
                        supplierDispatch({
                           type: 'SET_PAYMENT_TERMS',
                           payload: paymentTerms,
                        })
                     }
                  />
                  <br />

                  <Input
                     type="textarea"
                     placeholder="Shipping Terms"
                     name="shippingTerms"
                     rows="4"
                     value={shippingTerms}
                     onChange={e => setShippingTerms(e.target.value)}
                     onBlur={() =>
                        supplierDispatch({
                           type: 'SET_SHIPPING_TERMS',
                           payload: shippingTerms,
                        })
                     }
                  />
               </Container>
            </StyledWrapper>
         </SupplierContext.Provider>
      </>
   )
}
