import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Input,
   Loader,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Avatar,
} from '@dailykit/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import AddIcon from '../../../../../shared/assets/icons/Add'
import DeleteIcon from '../../../../../shared/assets/icons/Delete'
import EditIcon from '../../../../recipe/assets/icons/Edit'
import { ClockIcon, ItemIcon } from '../../../assets/icons'
import {
   ItemContext,
   reducer,
   state as initialState,
} from '../../../context/item'
import { Context } from '../../../context/tabs'
import {
   DELETE_BULK_ITEM,
   SUPPLIER_ITEM_SUBSCRIPTION,
   UPDATE_SUPPLIER_ITEM,
} from '../../../graphql'
import { FlexContainer, Flexible, StyledWrapper } from '../styled'
import ProcessingView from './ProcessingView'
import {
   ProcessingButton,
   StyledGrid,
   StyledHeader,
   StyledInfo,
   StyledMain,
   StyledSupplier,
   TransparentIconButton,
} from './styled'
import {
   ConfigTunnel,
   ConfigureDerivedProcessingTunnel,
   ConfigureSachetTunnel,
   InfoTunnel,
   ProcessingTunnel,
   SelectDerivedProcessingTunnel,
   SuppliersTunnel,
} from './tunnels'

const address = 'apps.inventory.views.forms.item.'

export default function ItemForm() {
   const { t } = useTranslation()
   const { state: tabState, dispatch: tabDispatch } = useContext(Context)
   const [state, dispatch] = React.useReducer(reducer, initialState)
   const [active, setActive] = React.useState(false)
   const [formState, setFormState] = React.useState({})
   const [itemName, setItemName] = React.useState('')

   const [supplierTunnel, openSupplierTunnel, closeSupplierTunnel] = useTunnel(
      1
   )
   const [infoTunnel, openInfoTunnel, closeInfoTunnel] = useTunnel(1)
   const [
      processingTunnel,
      openProcessingTunnel,
      closeProcessingTunnel,
   ] = useTunnel(1)

   const [
      derivedProcessingsTunnel,
      openDerivedProcessingTunnel,
      closeDerivedProcessingTunnel,
   ] = useTunnel(1)

   const [
      configureSachetTunnel,
      openConfigureSachetTunnel,
      closeConfigureSachetTunnel,
   ] = useTunnel(1)

   const { loading: itemDetailLoading } = useSubscription(
      SUPPLIER_ITEM_SUBSCRIPTION,
      {
         variables: { id: tabState.current.id },
         onSubscriptionData: input => {
            const data = input.subscriptionData.data.supplierItem

            setItemName(data.name)
            setFormState(data)
         },
      }
   )

   const [deleteBulkItem, { loading: bulkItemDeleteLoading }] = useMutation(
      DELETE_BULK_ITEM,
      {
         onCompleted: () => {
            toast.info('Bulk Item deleted successfully.')
         },
         onError: error => {
            console.log(error)
            toast.error('Error! cannot delete the bulk item. Please try again.')
         },
      }
   )

   const [updateSupplierItem] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again.')
      },
      onCompleted: () => {
         toast.info('Item name updated successfully')
         tabDispatch({
            type: 'SET_TITLE',
            payload: { title: itemName, oldTitle: tabState.current.title },
         })
      },
   })

   const handleBulkItemDelete = id => {
      deleteBulkItem({ variables: { id } })
   }

   if (itemDetailLoading || bulkItemDeleteLoading) return <Loader />

   return (
      <ItemContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={supplierTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SuppliersTunnel
                  close={closeSupplierTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={infoTunnel}>
            <Tunnel layer={1}>
               <InfoTunnel
                  close={() => closeInfoTunnel(1)}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={processingTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <ProcessingTunnel
                  close={closeProcessingTunnel}
                  open={openProcessingTunnel}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} layer={2} size="lg">
               <ConfigTunnel
                  close={closeProcessingTunnel}
                  open={openProcessingTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={derivedProcessingsTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectDerivedProcessingTunnel
                  next={() => openDerivedProcessingTunnel(2)}
                  close={() => closeDerivedProcessingTunnel(1)}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} size="lg" layer={2}>
               <ConfigureDerivedProcessingTunnel
                  open={openDerivedProcessingTunnel}
                  close={closeDerivedProcessingTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={configureSachetTunnel}>
            <Tunnel layer={1}>
               <ConfigureSachetTunnel
                  open={openConfigureSachetTunnel}
                  close={closeConfigureSachetTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>

         <StyledWrapper>
            <StyledHeader>
               {formState.name && (
                  <>
                     <StyledInfo>
                        <div style={{ marginRight: '10px' }}>
                           <Input
                              style={{ margin: '10px 0 5px' }}
                              type="text"
                              name="itemName"
                              value={itemName}
                              label="Item Name"
                              onChange={e => setItemName(e.target.value)}
                              onBlur={() => {
                                 if (!itemName.length) {
                                    toast.error("Name can't be empty")
                                    return setItemName(formState.name)
                                 }

                                 if (itemName !== formState.name)
                                    updateSupplierItem({
                                       variables: {
                                          id: formState.id,
                                          object: { name: itemName },
                                       },
                                    })
                              }}
                           />
                           <span>sku: {formState.sku || 'N/A'}</span>
                        </div>
                     </StyledInfo>
                     <StyledSupplier>
                        <ContactPerson
                           formState={formState}
                           open={openSupplierTunnel}
                        />
                     </StyledSupplier>
                  </>
               )}
            </StyledHeader>
         </StyledWrapper>
         <StyledMain>
            <>
               <StyledGrid
                  data-testid="basic_info"
                  onClick={() => openInfoTunnel(1)}
               >
                  <div>
                     <div>
                        <ItemIcon />
                     </div>
                     <div>
                        <span>{t(address.concat('unit qty'))}</span>
                        <div>
                           <span>{formState.unitSize + formState.unit}</span>
                           <span>
                              {(formState.prices?.length &&
                                 `$ ${formState.prices[0]?.unitPrice?.value}`) ||
                                 null}
                           </span>
                        </div>
                     </div>
                  </div>
                  {/* <div>
                        <div>
                           <CaseIcon />
                        </div>
                        <div>
                           <span>{t(address.concat('case qty'))}</span>
                           <div>
                              <span>
                                 {state.case_quantity.value +
                                    state.case_quantity.unit || formState?.supplierItem?.unitSize +
                                    supplierItemData?.supplierItem?.unit}
                              </span>
                              <span>
                                 $
                                 {+state.unit_price.value *
                                    +state.case_quantity.value}
                              </span>
                           </div>
                        </div>
                     </div> */}
                  {/* <div>
                        <div>
                           <TruckIcon />
                        </div>
                        <div>
                           <span>{t(address.concat('min order value'))}</span>
                           <div>
                              <span>
                                 {state.min_order_value.value +
                                    state.min_order_value.unit}
                              </span>
                              <span>
                                 $
                                 {+state.unit_price.value *
                                    +state.min_order_value.value}
                              </span>
                           </div>
                        </div>
                     </div> */}
                  <div>
                     <div>
                        <ClockIcon />
                     </div>
                     <div>
                        <span>{t(address.concat('lead time'))}</span>
                        <div>
                           {formState.leadTime?.value ? (
                              <span>
                                 {`${formState.leadTime?.value} ${formState.leadTime?.unit}`}
                              </span>
                           ) : (
                              'N/A'
                           )}
                        </div>
                     </div>
                  </div>
               </StyledGrid>

               <FlexContainer
                  style={{
                     marginTop: '30px',
                     padding: '0 30px',
                     backgroundColor: '#f3f3f3',
                  }}
               >
                  <Flexible width="1">
                     <FlexContainer
                        style={{
                           justifyContent: 'space-between',
                           alignItems: 'center',
                        }}
                     >
                        <Text as="title">
                           {t(address.concat('processings'))}
                        </Text>
                        <TransparentIconButton
                           data-testid="add_processing"
                           onClick={() => {
                              if (!formState.supplier)
                                 return toast.error('Select a supplier first!')

                              dispatch({
                                 type: 'CLEAR_STATE',
                              })

                              if (formState.bulkItemAsShippedId) {
                                 openDerivedProcessingTunnel(1)
                              } else {
                                 openProcessingTunnel(1)
                              }
                           }}
                           type="outline"
                        >
                           <AddIcon size="18" strokeWidth="3" color="#555B6E" />
                        </TransparentIconButton>
                     </FlexContainer>

                     {formState.bulkItemAsShipped?.name && (
                        <>
                           <br />
                           <Text as="subtitle">
                              {t(address.concat('as recieved from supplier'))}.
                           </Text>

                           <ProcessingButton
                              active={active}
                              onClick={() => {
                                 setActive(true)
                                 dispatch({
                                    type: 'SET_ACTIVE_PROCESSING',
                                    payload: formState.bulkItemAsShipped,
                                 })
                              }}
                              style={{ justifyContent: 'space-between' }}
                           >
                              <div style={{ textAlign: 'left' }}>
                                 <h3 style={{ marginBottom: '5px' }}>
                                    {formState.bulkItemAsShipped.name}
                                 </h3>
                                 <Text as="subtitle">
                                    {t(address.concat('on hand'))}:{' '}
                                    {formState.bulkItemAsShipped.onHand}{' '}
                                    {formState.bulkItemAsShipped?.unit || ''}
                                 </Text>
                                 <Text as="subtitle">
                                    {t(address.concat('shelf life'))}:{' '}
                                    {formState.bulkItemAsShipped.shelfLife
                                       ?.value || 'N/A'}{' '}
                                    {formState.bulkItemAsShipped.shelfLife
                                       ?.value
                                       ? formState.bulkItemAsShipped.shelfLife
                                            ?.unit
                                       : ''}
                                 </Text>
                              </div>
                              <FlexContainer>
                                 <TransparentIconButton
                                    onClick={() => openProcessingTunnel(2)}
                                    type="button"
                                 >
                                    <EditIcon />
                                 </TransparentIconButton>
                              </FlexContainer>
                           </ProcessingButton>
                        </>
                     )}

                     {formState.bulkItems?.length ? (
                        <>
                           <br />
                           <Text as="subtitle">
                              {t(
                                 address.concat(
                                    'derived from recieved processing'
                                 )
                              )}
                           </Text>

                           {formState.bulkItems?.map(procs => {
                              if (procs.id === formState.bulkItemAsShippedId)
                                 return null
                              return (
                                 <ProcessingButton
                                    key={procs.id}
                                    active={
                                       state.activeProcessing.id === procs.id
                                    }
                                    onClick={() => {
                                       setActive(false)
                                       dispatch({
                                          type: 'SET_ACTIVE_PROCESSING',
                                          payload: {
                                             ...procs,
                                          },
                                       })
                                    }}
                                    style={{
                                       justifyContent: 'space-between',
                                    }}
                                 >
                                    <div style={{ textAlign: 'left' }}>
                                       <h3 style={{ marginBottom: '5px' }}>
                                          {procs.name}
                                       </h3>
                                       <Text as="subtitle">
                                          {t(address.concat('on hand'))}:{' '}
                                          {procs.onHand} {procs.unit}
                                       </Text>
                                       <Text as="subtitle">
                                          {t(address.concat('shelf life'))}:{' '}
                                          {procs?.shelfLife?.value || 'N/A'}{' '}
                                          {procs?.shelfLife?.value
                                             ? procs?.shelfLife?.unit
                                             : ''}
                                       </Text>
                                    </div>
                                    {state.activeProcessing.id === procs.id && (
                                       <>
                                          <FlexContainer>
                                             <TransparentIconButton
                                                onClick={() => {
                                                   dispatch({
                                                      type: 'SET_DER_ACTION',
                                                      payload: 'UPDATE',
                                                   })
                                                   openDerivedProcessingTunnel(
                                                      2
                                                   )
                                                }}
                                                type="button"
                                             >
                                                <EditIcon />
                                             </TransparentIconButton>
                                             <span style={{ width: '5px' }} />
                                             <TransparentIconButton
                                                onClick={() =>
                                                   handleBulkItemDelete(
                                                      procs.id
                                                   )
                                                }
                                                type="button"
                                             >
                                                <DeleteIcon />
                                             </TransparentIconButton>
                                          </FlexContainer>
                                       </>
                                    )}
                                 </ProcessingButton>
                              )
                           })}
                        </>
                     ) : null}
                  </Flexible>
                  <Flexible style={{ marginTop: '14vh' }} width="4">
                     <div
                        style={{
                           padding: '15px',
                           backgroundColor: '#fff',
                           minHeight: '500px',
                        }}
                     >
                        {formState.bulkItems?.length &&
                        state.activeProcessing?.name ? (
                           <ProcessingView
                              open={openConfigureSachetTunnel}
                              formState={formState}
                           />
                        ) : (
                           <Text as="title">
                              {t(
                                 address.concat(
                                    'select any processing from left menu to get started!'
                                 )
                              )}
                           </Text>
                        )}
                     </div>
                  </Flexible>
               </FlexContainer>
            </>
         </StyledMain>
      </ItemContext.Provider>
   )
}

function ContactPerson({ formState, open }) {
   if (!formState.supplier)
      return (
         <TextButton
            data-testid="add_supplier"
            type="outline"
            onClick={() => open(1)}
         >
            Add Supplier
         </TextButton>
      )

   return (
      <>
         <span>{formState.supplier.name}</span>
         {formState.supplier.contactPerson &&
         formState.supplier.contactPerson.firstName ? (
            <Avatar
               withName
               title={`${formState.supplier?.contactPerson?.firstName} ${
                  formState.supplier?.contactPerson?.lastName || ''
               }`}
            />
         ) : <Avatar
         withName
         title="N/A"
      />}
         <TransparentIconButton type="outline" onClick={() => open(1)}>
            <EditIcon size="18" color="#555B6E" />
         </TransparentIconButton>
      </>
   )
}
