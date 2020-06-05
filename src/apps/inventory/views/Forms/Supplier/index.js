import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   Input,
   Loader,
   Text,
   Toggle,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui/'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import EditIcon from '../../../assets/icons/Edit'
import { AddressCard, ContactCard, FormHeading } from '../../../components'
import { Context } from '../../../context/tabs'
import { SUPPLIER_SUBSCRIPTION, UPDATE_SUPPLIER } from '../../../graphql'
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

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   const { loading: supplierLoading } = useSubscription(SUPPLIER_SUBSCRIPTION, {
      variables: {
         id: state.current.id,
      },
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.supplier
         setName(data.name)
         setFormState(data)

         setShippingTerms(data.shippingTerms || '')
         setPaymentTerms(data.paymentTerms || '')
      },
   })
   const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info('Information updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
      },
   })

   const handleUpdateSupplier = () => {
      dispatch({
         type: 'SET_TITLE',
         payload: { title: name, oldTitle: state.current.title },
      })
      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               name,
               paymentTerms,
               shippingTerms,
            },
         },
      })
   }

   if (supplierLoading) return <Loader />

   return (
      <>
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
                     onBlur={handleUpdateSupplier}
                  />
               </div>

               <FormActions style={{ width: '25%' }}>
                  <FlexContainer>
                     <>
                        <ShowAvailability formState={formState} />
                        <span style={{ width: '20px' }} />
                     </>
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
                  {formState.address?.location ||
                  formState.address?.address1 ||
                  formState.address?.address2 ? (
                     <IconButton onClick={() => openTunnel(1)} type="ghost">
                        <EditIcon />
                     </IconButton>
                  ) : null}
               </FlexContainer>

               {formState.address?.location ||
               (formState.address?.city &&
                  formState.address?.address1 &&
                  formState.address?.address2) ? (
                  <AddressCard
                     address={
                        formState.address.location ||
                        `${formState.address.address1}, ${formState.address.address2}`
                     }
                     zip={formState.address?.zip}
                     city={formState.address?.city}
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

                  {formState.contactPerson?.email ||
                  formState.contactPerson?.firstName ? (
                     <IconButton onClick={() => openTunnel(2)} type="ghost">
                        <EditIcon />
                     </IconButton>
                  ) : null}
               </FlexContainer>

               {formState.contactPerson?.firstName &&
               formState.contactPerson?.email ? (
                  <ContactCard
                     name={`${formState.contactPerson?.firstName} ${formState.contactPerson?.lastName}`}
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
                  onBlur={handleUpdateSupplier}
               />
               <br />

               <Input
                  type="textarea"
                  placeholder={t(address.concat('shipping terms'))}
                  name="shippingTerms"
                  rows="4"
                  value={shippingTerms}
                  onChange={e => setShippingTerms(e.target.value)}
                  onBlur={handleUpdateSupplier}
               />
            </Container>
         </StyledWrapper>
      </>
   )
}

function ShowAvailability({ formState }) {
   const [updateSupplier, { loading }] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.success('Updated availability!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
      },
   })

   if (loading) return <Loader />

   return (
      <Toggle
         checked={formState.available}
         label={formState.available ? 'Available' : 'Unavailable'}
         setChecked={() => {
            updateSupplier({
               variables: {
                  id: formState.id,
                  object: { available: !formState.available },
               },
            })
         }}
      />
   )
}
