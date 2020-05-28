import { useQuery, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
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
   MASTER_ALLERGENS,
   MASTER_PROCESSINGS,
   SUPPLIERS,
   SUPPLIER_ITEM_SUBSCRIPTION,
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
} from './styled'
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
   const { state: tabState } = useContext(Context)
   const [state, dispatch] = React.useReducer(reducer, initialState)
   const [active, setActive] = React.useState(false)
   const [formState, setFormState] = React.useState({})

   const [tunnels, openTunnel, closeTunnel] = useTunnel(10)

   const { loading: itemDetailLoading } = useSubscription(
      SUPPLIER_ITEM_SUBSCRIPTION,
      {
         variables: { id: state.id || tabState.itemId },
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
            setFormState(normalisedData)
            console.log(normalisedData)
            dispatch({
               type: 'SET_SUB_DATA',
               payload: {
                  title: normalisedData.name,
                  sku: normalisedData.sku,

                  unit: normalisedData.unit,
                  unitSize: normalisedData.unitSize,

                  unit_price: normalisedData.prices[0].unitPrice,
                  leadTime: normalisedData.leadTime,
               },
            })
         },
      }
   )

   const { loading: supplierLoading, data: supplierData } = useQuery(SUPPLIERS)

   const { loading: processingsLoading, data: processingData } = useQuery(
      MASTER_PROCESSINGS
   )

   const { loading: allergensLoading, data: allergensData } = useQuery(
      MASTER_ALLERGENS
   )

   React.useEffect(() => {
      if (tabState.itemId) {
         dispatch({ type: 'ADD_ITEM_ID', payload: tabState.itemId })
      }
   }, [tabState.itemId])

   if (
      supplierLoading ||
      processingsLoading ||
      allergensLoading ||
      itemDetailLoading
   )
      return <Loader />
   return (
      <ItemContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SuppliersTunnel
                  close={closeTunnel}
                  open={openTunnel}
                  suppliers={supplierData?.suppliers?.map(supplier => ({
                     id: supplier.id,
                     title: supplier.name,
                     description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.countryCode} ${supplier.contactPerson?.phoneNumber})`,
                  }))}
                  rawSuppliers={supplierData.suppliers}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <InfoTunnel
                  close={() => closeTunnel(2)}
                  next={() => openTunnel(3)}
               />
            </Tunnel>
            <Tunnel layer={3}>
               <ProcessingTunnel
                  close={closeTunnel}
                  open={openTunnel}
                  processings={processingData?.masterProcessings?.map(
                     processing => ({
                        id: processing.id,
                        title: processing.name,
                     })
                  )}
                  rawProcessings={processingData?.masterProcessings}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} layer={4} size="lg">
               <ConfigTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={5}>
               <AllergensTunnel
                  close={() => closeTunnel(5)}
                  allergens={allergensData?.masterAllergens?.map(allergen => ({
                     id: allergen.id,
                     title: allergen.name,
                  }))}
               />
            </Tunnel>
            <Tunnel layer={6}>
               <SelectDerivedProcessingTunnel
                  next={openTunnel}
                  close={closeTunnel}
                  processings={processingData?.masterProcessings?.map(
                     processing => ({
                        id: processing.id,
                        title: processing.name,
                     })
                  )}
                  rawProcessings={processingData?.masterProcessings}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} size="lg" layer={7}>
               <ConfigureDerivedProcessingTunnel
                  open={openTunnel}
                  close={closeTunnel}
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
               <ConfigureSachetTunnel open={openTunnel} close={closeTunnel} />
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
                        <h1>{state.title || formState.name}</h1>
                        <span> {state.sku} </span>
                     </StyledInfo>
                     <StyledSupplier>
                        <span>{formState.supplier?.name}</span>
                        {formState.supplier?.contatcPerson &&
                           formState.supplier?.contactPerson.lastName &&
                           formState.supplier?.contactPerson.countryCode &&
                           formState.supplier?.contactPerson.phoneNumber && (
                              <span>
                                 {`${formState.supplier.contactPerson.firstName} ${formState.supplier.contactPerson.lastName} (${formState.supplier.contactPerson?.countryCode} ${formState.supplier.contactPerson?.phoneNumber})` ||
                                    ''}
                              </span>
                           )}
                     </StyledSupplier>
                  </>
               )}
            </StyledHeader>
         </StyledWrapper>
         <StyledMain>
            {!formState.id && !state.title ? (
               <StyledWrapper>
                  <ButtonTile
                     type="primary"
                     size="lg"
                     text={t(address.concat('add item information'))}
                     onClick={() => openTunnel(1)}
                  />
               </StyledWrapper>
            ) : (
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
                                 $
                                 {(formState.prices?.length &&
                                    formState.prices[0]?.unitPrice?.value) ||
                                    0}
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
                              <span>
                                 {formState.leadTime?.value +
                                    formState.leadTime?.unit}
                              </span>
                           </div>
                        </div>
                     </div>
                  </StyledGrid>

                  <FlexContainer
                     style={{ marginTop: '30px', padding: '0 30px' }}
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
                           <IconButton
                              onClick={() => openTunnel(6)}
                              type="ghost"
                           >
                              <AddIcon />
                           </IconButton>
                        </FlexContainer>

                        {(state.processing?.name ||
                           formState.bulkItemAsShipped?.name) && (
                           <>
                              <br />
                              <Text as="subtitle">
                                 {t(
                                    address.concat('as received from supplier')
                                 )}
                                 .
                              </Text>

                              <ProcessingButton
                                 active={active}
                                 onClick={() => {
                                    const payload = formState.bulkItemAsShipped
                                       ? formState.bulkItemAsShipped
                                       : state.processing
                                    setActive(true)
                                    dispatch({
                                       type: 'SET_ACTIVE_PROCESSING',
                                       payload,
                                    })
                                 }}
                              >
                                 <h3>{formState.bulkItemAsShipped?.name}</h3>
                                 <Text as="subtitle">
                                    {t(address.concat('on hand'))}:{' '}
                                    {formState.bulkItemAsShipped?.onHand}
                                 </Text>
                                 <Text as="subtitle">
                                    {t(address.concat('shelf life'))}:{' '}
                                    {`${
                                       state.processing?.shelf_life?.value ||
                                       formState.bulkItemAsShipped?.shelfLife
                                          ?.value
                                    } ${
                                       state.processing?.shelf_life?.unit ||
                                       formState.bulkItemAsShipped?.shelfLife
                                          ?.unit
                                    }`}
                                 </Text>
                              </ProcessingButton>
                           </>
                        )}

                        {formState.bulkItems?.length && (
                           <>
                              <br />
                              <Text as="subtitle">
                                 {t(
                                    address.concat(
                                       'derived from received processing'
                                    )
                                 )}
                              </Text>

                              {formState.bulkItems?.length
                                 ? formState.bulkItems?.map(procs => {
                                      if (
                                         procs.id ===
                                         formState.bulkItemAsShippedId
                                      )
                                         return null
                                      return (
                                         <ProcessingButton
                                            key={procs.id}
                                            active={
                                               state.activeProcessing.id ===
                                               procs.id
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
                                         >
                                            <h3>{procs.processingName}</h3>
                                            <Text as="subtitle">
                                               {t(address.concat('on hand'))}:{' '}
                                               {procs.onHand}
                                               {t('units.gm')}
                                            </Text>
                                            <Text as="subtitle">
                                               {t(address.concat('shelf life'))}
                                               :{' '}
                                               {`${procs?.shelfLife?.value} ${procs?.shelfLife?.unit}`}
                                            </Text>
                                         </ProcessingButton>
                                      )
                                   })
                                 : state.derivedProcessings?.map(procs => (
                                      <ProcessingButton
                                         key={procs.id}
                                         active={
                                            state.activeProcessing.id ===
                                            procs.id
                                         }
                                         onClick={() => {
                                            setActive(false)
                                            dispatch({
                                               type: 'SET_ACTIVE_PROCESSING',
                                               payload: {
                                                  ...procs,
                                                  name: procs.title,
                                               },
                                            })
                                         }}
                                      >
                                         <h3>{procs.title}</h3>
                                         <Text as="subtitle">
                                            {t(address.concat('on hand'))}: 0{' '}
                                            {t('units.gm')}
                                         </Text>
                                         <Text as="subtitle">
                                            {t(address.concat('shelf life'))}:{' '}
                                            {`${procs?.shelf_life?.value} ${procs?.shelf_life?.unit}`}
                                         </Text>
                                      </ProcessingButton>
                                   ))}
                           </>
                        )}
                     </Flexible>
                     <Flexible style={{ marginTop: '16vh' }} width="4">
                        <div
                           style={{
                              padding: '15px',
                              backgroundColor: '#fff',
                              minHeight: '500px',
                           }}
                        >
                           {state.activeProcessing?.name ? (
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
            )}
            <br />
            <br />
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

   return (
      <FlexContainer style={{ flexWrap: 'wrap' }}>
         <DataCard
            title={t(address.concat('awaiting'))}
            quantity={`${active.awaiting} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('committed'))}
            quantity={`${active.committed} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('consumed'))}
            quantity={`${active.consumed} ${active.unit}`}
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

   const activeSachet = active.sachetItems.find(
      item => item.id === state.activeSachet.id
   )

   return (
      <>
         <FlexContainer>
            <Flexible width="1">
               <Text as="h2">{t(address.concat('sachets'))}</Text>

               {formState.name
                  ? active.sachetItems.map(sachet => {
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
                             <h3>
                                {sachet.unitSize} {sachet.unit}
                             </h3>

                             <Text as="subtitle">
                                {t(address.concat('par'))}: {sachet.parLevel}{' '}
                                {sachet.unit}
                             </Text>
                          </ProcessingButton>
                       )
                    })
                  : activeProcessing.sachets.map(sachet => (
                       <ProcessingButton
                          active={sachet.id === state.activeSachet.id}
                          onClick={() =>
                             dispatch({
                                type: 'SET_ACTIVE_SACHET',
                                payload: sachet,
                             })
                          }
                       >
                          <h3>
                             {sachet.quantity} {state.unit_quantity.unit}
                          </h3>

                          <Text as="subtitle">
                             {t(address.concat('par'))}: {sachet.parLevel}{' '}
                             {state.unit_quantity.unit}
                          </Text>
                       </ProcessingButton>
                    ))}

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
                        title={t(address.concat('committed'))}
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
