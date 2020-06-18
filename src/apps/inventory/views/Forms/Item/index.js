import { useSubscription, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   ButtonTile,
   IconButton,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
   TextButton,
   Input,
} from '@dailykit/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import AddIcon from '../../../../../shared/assets/icons/Add'
import { DataCard } from '../../../components'
import { ClockIcon, ItemIcon } from '../../../assets/icons'
import {
   ItemContext,
   reducer,
   state as initialState,
} from '../../../context/item'
import { Context } from '../../../context/tabs'
import {
   MASTER_ALLERGENS_SUBSCRIPTION,
   MASTER_PROCESSINGS_SUBSCRIPTION,
   SUPPLIERS_SUBSCRIPTION,
   SUPPLIER_ITEM_SUBSCRIPTION,
   UNITS_SUBSCRIPTION,
   DELETE_BULK_ITEM,
   UPDATE_SUPPLIER_ITEM,
} from '../../../graphql'
// Styled
import { FlexContainer, Flexible, StyledWrapper } from '../styled'
import {
   ItemTab,
   ProcessingButton,
   StyledGrid,
   StyledHeader,
   StyledInfo,
   StyledMain,
   StyledSupplier,
   TabContainer,
   TransparentIconButton,
} from './styled'
import EditIcon from '../../../../recipe/assets/icons/Edit'
import DeleteIcon from '../../../../../shared/assets/icons/Delete'
// Tunnels
import {
   AllergensTunnel,
   AllergensTunnelForDerivedProcessing,
   ConfigTunnel,
   ConfigureDerivedProcessingTunnel,
   ConfigureSachetTunnel,
   InfoTunnel,
   NutritionTunnel,
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
   const [units, setUnits] = React.useState([])
   const [itemName, setItemName] = React.useState('')

   const [tunnels, openTunnel, closeTunnel] = useTunnel(10)

   const { loading: itemDetailLoading } = useSubscription(
      SUPPLIER_ITEM_SUBSCRIPTION,
      {
         variables: { id: tabState.current.id },
         onSubscriptionData: input => {
            const data = input.subscriptionData.data.supplierItem
            const bulkItemAsShipped = data.bulkItems?.find(
               item => item.id === data.bulkItemAsShippedId
            )
            const normalisedData = {
               ...data,
               bulkItemAsShipped: {
                  ...bulkItemAsShipped,
                  name: bulkItemAsShipped?.processingName,
               },
            }
            setItemName(normalisedData.name)
            setFormState(normalisedData)
         },
      }
   )

   const { loading: supplierLoading, data: supplierData } = useSubscription(
      SUPPLIERS_SUBSCRIPTION
   )
   const { loading: unitsLoading } = useSubscription(UNITS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.units
         setUnits(data)
      },
   })

   const {
      loading: processingsLoading,
      data: processingData,
   } = useSubscription(MASTER_PROCESSINGS_SUBSCRIPTION)

   const { loading: allergensLoading, data: allergensData } = useSubscription(
      MASTER_ALLERGENS_SUBSCRIPTION
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

   if (
      supplierLoading ||
      processingsLoading ||
      allergensLoading ||
      itemDetailLoading ||
      unitsLoading ||
      bulkItemDeleteLoading
   )
      return <Loader />
   return (
      <ItemContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SuppliersTunnel
                  close={closeTunnel}
                  suppliers={supplierData?.suppliers?.map(supplier => ({
                     id: supplier.id,
                     title: supplier.name,
                     description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.countryCode} ${supplier.contactPerson?.phoneNumber})`,
                  }))}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <InfoTunnel
                  units={units}
                  close={() => closeTunnel(2)}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel layer={3} style={{ overflowY: 'auto' }}>
               <ProcessingTunnel
                  close={closeTunnel}
                  open={openTunnel}
                  processings={processingData?.masterProcessings?.map(
                     processing => {
                        return {
                           id: processing.id,
                           title: processing.name,
                        }
                     }
                  )}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} layer={4} size="lg">
               <ConfigTunnel
                  units={units}
                  close={closeTunnel}
                  open={openTunnel}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel layer={5} style={{ overflowY: 'auto' }}>
               <AllergensTunnel
                  close={() => closeTunnel(5)}
                  allergens={allergensData?.masterAllergens?.map(allergen => ({
                     id: allergen.id,
                     title: allergen.name,
                  }))}
               />
            </Tunnel>
            <Tunnel layer={6} style={{ overflowY: 'auto' }}>
               <SelectDerivedProcessingTunnel
                  next={openTunnel}
                  close={closeTunnel}
                  processings={processingData?.masterProcessings?.map(
                     processing => {
                        return {
                           id: processing.id,
                           title: processing.name,
                        }
                     }
                  )}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} size="lg" layer={7}>
               <ConfigureDerivedProcessingTunnel
                  units={units}
                  open={openTunnel}
                  close={closeTunnel}
                  formState={formState}
               />
            </Tunnel>

            <Tunnel layer={8}>
               <AllergensTunnelForDerivedProcessing
                  open={openTunnel}
                  close={closeTunnel}
                  allergens={allergensData?.masterAllergens?.map(allergen => ({
                     id: allergen.id,
                     title: allergen.name,
                  }))}
               />
            </Tunnel>
            <Tunnel layer={9}>
               <ConfigureSachetTunnel
                  open={openTunnel}
                  close={closeTunnel}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} layer={10}>
               <NutritionTunnel open={openTunnel} close={closeTunnel} />
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
                           open={openTunnel}
                        />
                     </StyledSupplier>
                  </>
               )}
            </StyledHeader>
         </StyledWrapper>
         <StyledMain>
            <>
               <StyledGrid onClick={() => openTunnel(2)}>
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
                                 {formState.leadTime?.value +
                                    formState.leadTime?.unit}
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
                           onClick={() => {
                              if (!formState.supplier)
                                 return toast.error('Select a supplier first!')

                              dispatch({
                                 type: 'CLEAR_STATE',
                              })

                              if (formState.bulkItems.length) {
                                 openTunnel(6)
                              } else {
                                 openTunnel(3)
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
                                    onClick={() => openTunnel(4)}
                                    type="button"
                                 >
                                    <EditIcon />
                                 </TransparentIconButton>
                              </FlexContainer>
                           </ProcessingButton>
                        </>
                     )}

                     {formState.bulkItems?.length && (
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
                                             name: procs.processingName,
                                          },
                                       })
                                    }}
                                    style={{
                                       justifyContent: 'space-between',
                                    }}
                                 >
                                    <div style={{ textAlign: 'left' }}>
                                       <h3 style={{ marginBottom: '5px' }}>
                                          {procs.processingName}
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
                                                   openTunnel(7)
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
                     )}
                  </Flexible>
                  <Flexible style={{ marginTop: '14vh' }} width="4">
                     <div
                        style={{
                           padding: '15px',
                           backgroundColor: '#fff',
                           minHeight: '500px',
                        }}
                     >
                        {formState.bulkItems.length &&
                        state.activeProcessing?.name ? (
                           <ProcessingView
                              open={openTunnel}
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

function ProcessingView({ open, formState }) {
   const { t } = useTranslation()
   const [activeView, setActiveView] = React.useState('realtime') // realtime | plannedLot

   return (
      <>
         <TabContainer>
            <ItemTab
               active={activeView === 'realtime'}
               onClick={() => setActiveView('realtime')}
            >
               <Text as="title">{t(address.concat('real-time'))}</Text>
            </ItemTab>
            <ItemTab
               active={activeView === 'plannedLot'}
               onClick={() => setActiveView('plannedLot')}
            >
               <Text as="title">{t(address.concat('planned-lot'))}</Text>
            </ItemTab>
         </TabContainer>

         {activeView === 'realtime' && (
            <>
               <FlexContainer>
                  <Flexible width="4">
                     <RealTimeView formState={formState} />
                  </Flexible>
                  <Flexible width="1" />
               </FlexContainer>
            </>
         )}

         {activeView === 'plannedLot' && (
            <>
               <PlannedLotView open={open} formState={formState} />
            </>
         )}
      </>
   )
}

function RealTimeView({ formState }) {
   const { t } = useTranslation()

   const {
      state: { activeProcessing },
   } = useContext(ItemContext)
   const active = formState.bulkItems.find(
      item => item.id === activeProcessing.id
   )

   if (!active) return null

   return (
      <FlexContainer style={{ flexWrap: 'wrap' }}>
         <DataCard
            title={t(address.concat('awaiting'))}
            quantity={`${active.awaiting} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('commited'))}
            quantity={`${active.committed} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('consumed'))}
            quantity={`${active.consumed} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('on hand'))}
            quantity={`${active.onHand} ${active.unit}`}
         />
      </FlexContainer>
   )
}

function PlannedLotView({ open, formState }) {
   const { t } = useTranslation()
   const {
      state: { activeProcessing },
      state,
      dispatch,
   } = useContext(ItemContext)

   const active = formState.bulkItems.find(
      item => item.id === activeProcessing.id
   )

   if (!active) return null

   const activeSachet = active.sachetItems.find(
      item => item.id === state.activeSachet.id
   )

   return (
      <>
         <FlexContainer>
            <Flexible width="1">
               <Text as="h2">{t(address.concat('sachets'))}</Text>

               {active.sachetItems.map(sachet => {
                  return (
                     <ProcessingButton
                        active={sachet.id === state.activeSachet.id}
                        onClick={() =>
                           dispatch({
                              type: 'SET_ACTIVE_SACHET',
                              payload: sachet,
                           })
                        }
                     >
                        <div style={{ textAlign: 'left' }}>
                           <h3>
                              {sachet.unitSize} {sachet.unit}
                           </h3>

                           <Text as="subtitle">
                              {t(address.concat('par'))}: {sachet.parLevel}{' '}
                              {sachet.unit}
                           </Text>
                        </div>
                     </ProcessingButton>
                  )
               })}

               <div style={{ width: '90%', marginTop: '10px' }}>
                  <ButtonTile
                     type="primary"
                     size="lg"
                     text={t(address.concat('add sachets'))}
                     onClick={() => {
                        dispatch({
                           type: 'SET_UNIT_QUANTITY',
                           payload: { unit: active.unit },
                        })
                        open(9)
                     }}
                  />
               </div>
            </Flexible>
            <Flexible width="4">
               {(activeSachet?.id || state.activeSachet?.quantity) && (
                  <FlexContainer style={{ flexWrap: 'wrap' }}>
                     <DataCard
                        title={t(address.concat('awaiting'))}
                        quantity={`${activeSachet.awaiting || 0} pkt`}
                     />
                     <DataCard
                        title={t(address.concat('commited'))}
                        quantity={`${activeSachet.committed || 0} pkt`}
                     />
                     <DataCard
                        title={t(address.concat('consumed'))}
                        quantity={`${activeSachet.consumed || 0} pkt`}
                     />
                  </FlexContainer>
               )}
            </Flexible>
         </FlexContainer>
      </>
   )
}

function ContactPerson({ formState, open }) {
   if (!formState.supplier)
      return (
         <TextButton type="outline" onClick={() => open(1)}>
            Add Supplier
         </TextButton>
      )

   const contatctPerson =
      formState.supplier?.contactPerson?.firstName &&
      formState.supplier?.contactPerson?.lastName
         ? `${formState.supplier.contactPerson.firstName} ${formState.supplier.contactPerson.lastName} ${formState.supplier.contactPerson?.countryCode} ${formState.supplier.contactPerson.phoneNumber}`
         : 'N/A'

   return (
      <>
         <span>{formState.supplier.name}</span>
         <span>{contatctPerson}</span>
         <TransparentIconButton type="outline" onClick={() => open(1)}>
            <EditIcon size="18" color="#555B6E" />
         </TransparentIconButton>
      </>
   )
}
