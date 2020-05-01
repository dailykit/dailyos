import React, { useContext, useState, useReducer } from 'react'

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

import { FormHeading, ContactCard, AddressCard } from '../../../components'
import AddressTunnel from './Tunnels/AddressTunnel'
import PersonContactTunnel from './Tunnels/PersonContactTunnel'
import { FormActions, StyledWrapper, FlexContainer } from '../styled'
import { Container } from './styled'
import EditIcon from '../../../assets/icons/Edit'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.supplier.'

export default function SupplierForm() {
   const { t } = useTranslation()
   const [name, setName] = useState('')
   const [paymentTerms, setPaymentTerms] = useState('')
   const [shippingTerms, setShippingTerms] = useState('')

   const { state, dispatch } = useContext(Context)
   const [supplierState, supplierDispatch] = useReducer(reducers, initialState)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

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
                        label={t(address.concat("untitled supplier"))}
                        type="text"
                        name="supplierName"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={() => handleTabNameChange(name)}
                     />
                  </div>

                  <FormActions>
                     <TextButton
                        onClick={() => { }}
                        type="ghost"
                        style={{ margin: '0px 10px' }}
                     >
                        {t(address.concat('save'))}
                     </TextButton>

                     <TextButton
                        onClick={() => { }}
                        type="solid"
                        style={{ margin: '0px 10px' }}
                     >
                        {t(address.concat('submit'))}
                     </TextButton>
                  </FormActions>
               </FormHeading>
               <Container>
                  <ButtonTile
                     onClick={() => { }}
                     type="primary"
                     size="lg"
                     text={t(address.concat("add logo of the supplier"))}
                     helper={(t(address.concat("upto 1MB - only JPGs, PNGs, and PDFs are allowed")))}
                  />

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">{t(address.concat("address"))}</Text>
                     <hr
                        style={{
                           border: '1px solid #D8D8D8',
                           width: '100%',
                           marginLeft: '5px',
                        }}
                     />
                     {supplierState.address.location ||
                        supplierState.address.address1 ? (
                           <IconButton onClick={() => openTunnel(1)} type="ghost">
                              <EditIcon />
                           </IconButton>
                        ) : null}
                  </FlexContainer>

                  {supplierState.address.location ||
                     supplierState.address.city ? (
                        <AddressCard
                           address={
                              supplierState.address.location ||
                              `${supplierState.address.address1}, ${supplierState.address.address2}`
                           }
                           zip={supplierState.address.zip}
                           city={supplierState.address.city}
                           image="https://via.placeholder.com/80x50"
                        />
                     ) : (
                        <ButtonTile
                           type="secondary"
                           text={t(address.concat("add address"))}
                           onClick={() => openTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">{t(address.concat('person of contact'))}</Text>
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
                           text={t(address.concat("add person of contact"))}
                           onClick={() => openTunnel(2)}
                           style={{ margin: '20px 0' }}
                        />
                     )}

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">{t(address.concat('terms and conditions'))}</Text>
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
                     placeholder={t(address.concat("payment terms"))}
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
                     placeholder={t(address.concat("shipping terms"))}
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
