import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   Input,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
   Toggle,
} from '@dailykit/ui/'
import { toast } from 'react-toastify'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'

import EditIcon from '../../../assets/icons/Edit'
import { AddressCard, ContactCard, FormHeading } from '../../../components'
import {
   reducers,
   state as initialState,
   SupplierContext,
} from '../../../context/supplier'
import { Context } from '../../../context/tabs'
import {
   CREATE_SUPPLIER,
   UPDATE_SUPPLIER,
   SUPPLIER_SUBSCRIPTION,
} from '../../../graphql'
import { FlexContainer, FormActions, StyledWrapper } from '../styled'
import { Container } from './styled'
import AddressTunnel from './Tunnels/AddressTunnel'
import PersonContactTunnel from './Tunnels/PersonContactTunnel'

const address = 'apps.inventory.views.forms.supplier.'

export default function SupplierForm() {
   const { t } = useTranslation()
   const [name, setName] = useState('')
   const [paymentTerms, setPaymentTerms] = useState('')
   const [shippingTerms, setShippingTerms] = useState('')
   const [formState, setFormState] = useState({})

   const { state, dispatch } = useContext(Context)
   const [supplierState, supplierDispatch] = useReducer(reducers, initialState)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   const { loading: supplierLoading } = useSubscription(SUPPLIER_SUBSCRIPTION, {
      variables: {
         id: supplierState.id,
      },
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.supplier
         setName(data.name)
         setFormState(data)
         supplierDispatch({
            type: 'ADD_ADDRESS',
            payload: data.address,
         })
         supplierDispatch({
            type: 'ADD_CONTACT',
            payload: data.contactPerson,
         })
         setShippingTerms(data.shippingTerms)
         setPaymentTerms(data.paymentTerms)
      },
   })

   const [createSupplier] = useMutation(CREATE_SUPPLIER)
   const [updateSupplier] = useMutation(UPDATE_SUPPLIER)

   useEffect(() => {
      if (state.supplierId) {
         supplierDispatch({ type: 'SET_ID', payload: state.supplierId })
      }
   }, [])

   const handleSave = async () => {
      try {
         const data = {
            name,
            paymentTerms,
            shippingTerms,
            contactPerson: supplierState.contact,
            address: supplierState.address,
            available: false,
         }

         if (formState.id) {
            const res = await updateSupplier({
               variables: {
                  id: formState.id,
                  object: { ...data, available: formState.available },
               },
            })
            const {
               data: {
                  updateSupplier: { returning: result },
               },
            } = res

            if (result[0]?.id) {
               toast.info('Information updated!')
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
      } catch (error) {
         console.log(error)
         toast.error('Error, Please try again')
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

   if (supplierLoading) return <Loader />

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
                        label="Supplier Name"
                        type="text"
                        name="supplierName"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={() => handleTabNameChange(name)}
                     />
                  </div>

                  <FormActions style={{ width: '25%' }}>
                     <FlexContainer>
                        {formState.id && (
                           <>
                              <ShowAvailability formState={formState} />
                              <span style={{ width: '20px' }} />
                           </>
                        )}
                        <TextButton
                           onClick={() => handleSave()}
                           type="ghost"
                           style={{ margin: '0px 10px' }}
                        >
                           {supplierState?.id
                              ? t(address.concat('update'))
                              : t(address.concat('save'))}
                        </TextButton>
                     </FlexContainer>
                  </FormActions>
               </FormHeading>
               <Container>
                  <ButtonTile
                     onClick={() => {}}
                     type="primary"
                     size="lg"
                     text={t(address.concat('add logo of the supplier'))}
                     helper={t(
                        address.concat(
                           'upto 1MB - only JPGs, PNGs, and PDFs are allowed'
                        )
                     )}
                  />

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">{t(address.concat('address'))}</Text>
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
                        text={t(address.concat('add address'))}
                        onClick={() => openTunnel(1)}
                        style={{ margin: '20px 0' }}
                     />
                  )}

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">
                        {t(address.concat('person of contact'))}
                     </Text>
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
                        text={t(address.concat('add person of contact'))}
                        onClick={() => openTunnel(2)}
                        style={{ margin: '20px 0' }}
                     />
                  )}

                  <FlexContainer
                     style={{ alignItems: 'center', marginTop: '24px' }}
                  >
                     <Text as="title">
                        {t(address.concat('terms and conditions'))}
                     </Text>
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
                     placeholder={t(address.concat('payment terms'))}
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
                     placeholder={t(address.concat('shipping terms'))}
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

function ShowAvailability({ formState }) {
   const [loading, setLoading] = useState(false)

   const [updateSupplier] = useMutation(UPDATE_SUPPLIER)

   if (loading) return <Loader />

   return (
      <Toggle
         checked={formState.available}
         label={formState.available ? 'Available' : 'Unavailable'}
         setChecked={async () => {
            try {
               setLoading(true)
               const res = await updateSupplier({
                  variables: {
                     id: formState.id,
                     object: { available: !formState.available },
                  },
               })

               if (res?.data?.updateSupplier) {
                  setLoading(false)
                  toast.success('Updated availability!')
               }
            } catch (error) {
               setLoading(false)
               console.log(error)
               toast.error('Error, Please try again')
            }
         }}
      />
   )
}
