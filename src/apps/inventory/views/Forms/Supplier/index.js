import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Avatar,
   ButtonTile,
   Flex,
   Form,
   IconButton,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import EditIcon from '../../../assets/icons/Edit'
import { AddressCard } from '../../../components'
import { useTabs } from '../../../context'
import { SUPPLIER_SUBSCRIPTION, UPDATE_SUPPLIER } from '../../../graphql'
import { StyledHeader } from '../../Listings/styled'
import { FlexContainer, StyledWrapper } from '../styled'
import { ImageContainer } from './styled'
import AddressTunnel from './Tunnels/AddressTunnel'
import LogoTunnel from './Tunnels/LogoTunnel'
import PersonContactTunnel from './Tunnels/PersonContactTunnel'

const address = 'apps.inventory.views.forms.supplier.'

export default function SupplierForm() {
   const { t } = useTranslation()
   const [name, setName] = useState('')
   const [paymentTerms, setPaymentTerms] = useState('')
   const [shippingTerms, setShippingTerms] = useState('')
   const [formState, setFormState] = useState({})
   const { id } = useParams()
   const { setTabTitle } = useTabs()

   const [addressTunnel, openAddressTunnel, closeAddressTunnel] = useTunnel(1)
   const [contactTunnel, openContactTunnel, closeContactTunnel] = useTunnel(1)
   const [assetTunnel, openAssetTunnel, closeAssetTunnel] = useTunnel(1)

   const { loading: supplierLoading } = useSubscription(SUPPLIER_SUBSCRIPTION, {
      variables: {
         id,
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
      setTabTitle(name)
      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               name: name.trim(),
               paymentTerms: paymentTerms.trim(),
               shippingTerms: shippingTerms.trim(),
            },
         },
      })
   }

   if (supplierLoading) return <Loader />

   return (
      <>
         <Tunnels tunnels={addressTunnel}>
            <Tunnel size="sm" layer={1}>
               <AddressTunnel
                  close={closeAddressTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={contactTunnel}>
            <Tunnel layer={1}>
               <PersonContactTunnel
                  close={closeContactTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={assetTunnel}>
            <Tunnel layer={1}>
               <LogoTunnel close={closeAssetTunnel} formState={formState} />
            </Tunnel>
         </Tunnels>

         <StyledWrapper>
            <StyledHeader>
               <Form.Group>
                  <Form.Label htmlFor="supplierName" title="Supplier Name">
                     Supplier Name
                  </Form.Label>
                  <Form.Text
                     id="supplierName"
                     name="supplierName"
                     value={name}
                     onChange={e => setName(e.target.value)}
                     onBlur={handleUpdateSupplier}
                  />
               </Form.Group>

               <div style={{ width: '110px' }}>
                  <FlexContainer>
                     <>
                        <ShowAvailability formState={formState} />
                        <span style={{ width: '20px' }} />
                     </>
                  </FlexContainer>
               </div>
            </StyledHeader>
            {formState.logo ? (
               <ImageContainer>
                  <div>
                     <span
                        role="button"
                        tabIndex="0"
                        onClick={() => openAssetTunnel(1)}
                        onKeyDown={e => e.charCode === 13 && openAssetTunnel(1)}
                     >
                        <EditIcon />
                     </span>
                  </div>
                  <img src={formState.logo} alt="supplier logo" />
               </ImageContainer>
            ) : (
               <ButtonTile
                  onClick={() => openAssetTunnel(1)}
                  type="primary"
                  size="lg"
                  text={t(address.concat('add logo of the supplier'))}
                  helper={t(
                     address.concat(
                        'upto 1MB - only JPGs, PNGs, and PDFs are allowed'
                     )
                  )}
               />
            )}

            <AddressView formState={formState} openTunnel={openAddressTunnel} />

            <Flex
               container
               alignItems="center"
               margin="24px 0 0 0"
               justifyContent="space-between"
            >
               <Text as="title">{t(address.concat('person of contact'))}</Text>

               {formState.contactPerson?.email ||
               formState.contactPerson?.firstName ? (
                  <>
                     <IconButton
                        onClick={() => openContactTunnel(1)}
                        type="outline"
                     >
                        <EditIcon color="#555b6e" />
                     </IconButton>
                  </>
               ) : null}
            </Flex>

            {formState.contactPerson?.firstName &&
            formState.contactPerson?.email ? (
               // <ContactCard
               // name={`${formState.contactPerson?.firstName} ${formState.contactPerson?.lastName}`}
               // />
               <Avatar
                  withName
                  title={`${formState.contactPerson?.firstName} ${formState.contactPerson?.lastName}`}
               />
            ) : (
               <ButtonTile
                  type="secondary"
                  text={t(address.concat('add person of contact'))}
                  onClick={() => openContactTunnel(1)}
                  style={{ margin: '20px 0' }}
               />
            )}

            <Flex container alignItems="center" margin="24px 0 0 0">
               <Text as="title">
                  {t(address.concat('terms and conditions'))}
               </Text>
            </Flex>

            <br />

            <Form.Group>
               <Form.Label htmlFor="paymentTerms" title="Payment Terms">
                  {t(address.concat('payment terms'))}
               </Form.Label>
               <Form.TextArea
                  name="paymentTerms"
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value)}
                  onBlur={handleUpdateSupplier}
               />
            </Form.Group>
            <br />

            <Form.Group>
               <Form.Label htmlFor="shippingTerms" title="shippingTerms">
                  {t(address.concat('shipping terms'))}
               </Form.Label>
               <Form.TextArea
                  type="textarea"
                  name="shippingTerms"
                  value={shippingTerms}
                  onChange={e => setShippingTerms(e.target.value)}
                  onBlur={handleUpdateSupplier}
               />
            </Form.Group>
         </StyledWrapper>
      </>
   )
}

function ShowAvailability({ formState }) {
   const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.success('Updated availability!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
      },
   })

   return (
      <Form.Group>
         <Form.Toggle
            value={formState.available}
            onChange={() => {
               updateSupplier({
                  variables: {
                     id: formState.id,
                     object: { available: !formState.available },
                  },
               })
            }}
         >
            {formState.available ? 'Available' : 'Unavailable'}
         </Form.Toggle>
      </Form.Group>
   )
}

function AddressView({ formState, openTunnel }) {
   const { t } = useTranslation()

   const check =
      formState.address?.location ||
      formState.address?.address1 ||
      formState.address?.address2 ||
      formState.address?.city

   return (
      <>
         <Flex
            container
            margin="24px 0 0 0"
            alignItems="center"
            justifyContent="space-between"
         >
            <Text as="title">{t(address.concat('address'))}</Text>
            {check && (
               <>
                  <IconButton onClick={() => openTunnel(1)} type="outline">
                     <EditIcon color="#555b6e" />
                  </IconButton>
               </>
            )}
         </Flex>

         {check ? (
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
      </>
   )
}
