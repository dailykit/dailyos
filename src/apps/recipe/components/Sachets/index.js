import React from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   TextButton,
   List,
   ListOptions,
   ListSearch,
   ListItem,
   Toggle,
   Checkbox,
   useSingleList,
   Input,
   RadioGroup,
   Tag,
} from '@dailykit/ui'

import { AddIcon, DeleteIcon, CloseIcon } from '../../assets/icons'
import {
   StyledSection,
   StyledListing,
   StyledListingHeader,
   StyledListingTile,
   StyledDisplay,
   Actions,
   StyledTab,
   StyledTabsContainer,
   StyledTunnelHeader,
   StyledTunnelMain,
   StyledTabContent,
   StyledTable,
   StyledSelect,
   StyledTextAndSelect,
   ToggleWrapper,
} from '../styled'
import {
   SACHETS_OF_PROCESSING,
   FETCH_UNITS,
   FETCH_SACHET_ITEMS,
   FETCH_BULK_ITEMS,
   FETCH_STATIONS,
   FETCH_PACKAGINGS,
   FETCH_LABEL_TEMPLATES,
   CREATE_SACHET,
   DELETE_SACHET,
} from '../../graphql'

import { Sachet } from '../'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.components.sachets.'

const Sachets = ({ ingredientId, processingId, processingName }) => {
   const { t } = useTranslation()
   // State
   const [sachets, setSachets] = React.useState([])
   const [selectedIndex, setSelectedIndex] = React.useState(0)
   const [units, setUnits] = React.useState([])
   const [selectedView, setSelectedView] = React.useState('modes')
   const [search, setSearch] = React.useState('')
   const [currentMode, setCurrentMode] = React.useState('')
   const [sachetForm, setSachetForm] = React.useState({
      id: '',
      quantity: '',
      unit: 'gram',
      tracking: true,
      modes: [
         {
            isActive: false,
            type: 'realTime',
            station: '',
            accuracy: 0,
            item: '',
            packaging: '',
            isLabelled: false,
            labelTemplate: '',
         },
         {
            isActive: false,
            type: 'plannedLot',
            station: '',
            accuracy: 0,
            item: '',
            packaging: '',
            isLabelled: false,
            labelTemplate: '',
         },
         // {
         //    isActive: false,
         //    type: 'Co-Packer',
         //    station: '',
         //    accuracy: 0,
         //    item: {
         //       type: '',
         //       id: '',
         //    },
         //    packaging: '',
         //    isLabelled: false,
         //    labelTemplate: '',
         // },
      ],
   })
   const accuracyOptions = [
      {
         id: 1,
         title: 'Above 50%',
         value: 50,
      },
      {
         id: 2,
         title: 'Above 85%',
         value: 85,
      },
      {
         id: 3,
         title: "Don't weigh",
         value: 0,
      },
   ]
   const [modeForm, setModeForm] = React.useState({
      isActive: false,
      type: '',
      station: '',
      supplierItems: [
         {
            item: '',
            accuracy: 0,
            packaging: '',
            isLabelled: false,
            labelTemplate: '',
         },
      ],
   })

   // Queries and Mutations
   const [fetchSachets, {}] = useLazyQuery(SACHETS_OF_PROCESSING, {
      onCompleted: data => {
         setSachets(data.ingredientSachets)
      },
   })
   const [fetchUnits, {}] = useLazyQuery(FETCH_UNITS, {
      fetchPolicy: 'cache-and-network',
      onCompleted: data => {
         const units = data.units.map(el => {
            el.title = el.name
            return el
         })
         setUnits(units)
      },
   })
   const [fetchStations, {}] = useLazyQuery(FETCH_STATIONS, {
      fetchPolicy: 'cache-and-network',
      onCompleted: data => {
         const stations = data.stations.map(el => {
            el.title = el.name
            return el
         })
         stationsList.length = 0
         stationsList.push(...stations)
      },
   })
   const [fetchSachetItems, {}] = useLazyQuery(FETCH_SACHET_ITEMS, {
      fetchPolicy: 'cache-and-network',
      onCompleted: data => {
         const items = data.sachetItems.map(el => {
            el.title = el.unitSize + ''
            return el
         })
         sachetItemsList.length = 0
         sachetItemsList.push(...items)
      },
   })
   const [fetchBulkItems, {}] = useLazyQuery(FETCH_BULK_ITEMS, {
      fetchPolicy: 'cache-and-network',
      onCompleted: data => {
         const items = data.bulkItems.map(el => {
            el.title = el.processingName
            return el
         })
         bulkItemsList.length = 0
         bulkItemsList.push(...items)
      },
   })
   const [fetchPackagings, {}] = useLazyQuery(FETCH_PACKAGINGS, {
      fetchPolicy: 'cache-and-network',
      onCompleted: data => {
         const packagings = data.packaging_packaging.map(el => {
            el.title = el.name
            return el
         })
         packagingList.length = 0
         packagingList.push(...packagings)
      },
   })
   const [fetchLabelTemplates, {}] = useLazyQuery(FETCH_LABEL_TEMPLATES, {
      fetchPolicy: 'cache-and-network',
      onCompleted: data => {
         const temps = data.label_templates.map(el => {
            el.title = el.name
            return el
         })
         labelTemplateList.length = 0
         labelTemplateList.push(...temps)
      },
   })
   const [createSachet] = useMutation(CREATE_SACHET, {
      onCompleted: data => {
         if (data.createIngredientSachet.returning.length) {
            console.log(data.createIngredientSachet.returning)
            setSachets([...sachets, data.createIngredientSachet.returning[0]])
         } else {
            // Fire toast
            console.log('Sachet not created!')
         }
      },
      // refetchQueries: [
      //    {
      //       query: SACHETS_OF_PROCESSING,
      //       variables: { +processingId }
      //    }
      // ]
   })
   const [deleteSachet] = useMutation(DELETE_SACHET, {
      onCompleted: data => {
         if (data.deleteIngredientSachet.returning?.length) {
            const updatedSachets = sachets.filter(
               sachet =>
                  sachet.id !== data.deleteIngredientSachet.returning[0].id
            )
            setSachets(updatedSachets)
            if (updatedSachets.length) setSelectedIndex(selectedIndex - 1)
            else setSelectedIndex(0)
         } else {
            // Fire toast
            console.log('Sachet could not be deleted!')
         }
      },
      update: (
         cache,
         {
            data: {
               deleteIngredientSachet: { returning },
            },
         }
      ) => {
         const { processing: cached_processing } = cache.readQuery({
            query: SACHETS_OF_PROCESSING,
            variables: { processingId: +processingId },
         })
         cache.writeQuery({
            query: SACHETS_OF_PROCESSING,
            variables: { processingId: +processingId },
            data: {
               processing: {
                  ...cached_processing,
                  sachets: cached_processing.sachets.filter(
                     sach => sach.id !== returning[0].id
                  ),
               },
            },
         })
      },
   })

   // Side Effects
   React.useEffect(() => {
      if (processingId) {
         fetchSachets({
            variables: {
               processingId: +processingId,
               ingredientId: +ingredientId,
            },
         })
      }
   }, [processingId])

   //Lists
   const [stationsList, currentStation, selectStation] = useSingleList([])
   const [sachetItemsList, currentSachetItem, selectSahetItem] = useSingleList(
      []
   )
   const [bulkItemsList, currentBulkItem, selectBulkItem] = useSingleList([])
   const [packagingList, currentPackaging, selectPackaging] = useSingleList([])
   const [
      labelTemplateList,
      currentLabelTemplate,
      selectLabelTemplate,
   ] = useSingleList([])

   const deleteSachetHandler = sachetId => {
      deleteSachet({
         variables: {
            ingredientId: +ingredientId,
            processingId: +processingId,
            sachetId: +sachetId,
         },
      })
   }

   // Tunnels
   const [sachetTunnel, openSachetTunnel, closeSachetTunnel] = useTunnel(4)
   const [
      packagingTunnel,
      openPackagingTunnel,
      closePackagingTunnel,
   ] = useTunnel(1)
   const [labelTunnel, openLabelTunnel, closeLabelTunnel] = useTunnel(1)

   // Handlers
   const selectAccuracyHandler = value => {
      let copySachetForm = sachetForm
      const index = copySachetForm.modes.findIndex(
         mode => mode.type === currentMode
      )
      copySachetForm.modes[index].accuracy = value
      setSachetForm({ ...copySachetForm })
      closeLabelTunnel(1)
   }

   const selectPackagingHandler = packaging => {
      selectPackaging('id', packaging.id)
      let copySachetForm = sachetForm
      const index = copySachetForm.modes.findIndex(
         mode => mode.type === currentMode
      )
      copySachetForm.modes[index].packaging = packaging
      setSachetForm({ ...copySachetForm })
      closePackagingTunnel(1)
   }

   const toggleIsLabelled = checked => {
      let copySachetForm = sachetForm
      const index = copySachetForm.modes.findIndex(
         mode => mode.type === currentMode
      )
      copySachetForm.modes[index].isLabelled = checked
      setSachetForm({ ...copySachetForm })
   }
   const selectLabelTemplateHandler = labelTemplate => {
      let copySachetForm = sachetForm
      const index = copySachetForm.modes.findIndex(
         mode => mode.type === currentMode
      )
      copySachetForm.modes[index].labelTemplate = labelTemplate
      setSachetForm({ ...copySachetForm })
      closeLabelTunnel(1)
   }

   const createSachetHandler = async () => {
      let cleanSachet = {
         quantity: sachetForm.quantity,
         unit: sachetForm.unit,
         tracking: sachetForm.tracking,
      }
      let cleanModes = sachetForm.modes
         .filter(mode => {
            // This means mode is configured
            return mode.station !== ''
         })
         .map(mode => {
            return {
               type: mode.type,
               isLive: mode.isActive,
               // station: mode.station.id,
               stationId: mode.station.id,
               priority: 1,
               accuracy: mode.accuracy,
               packagingId: mode.packaging.id,
               isLive: true,
               isPublished: false,
               bulkItemId: mode.type === 'realTime' ? mode.item.id : null,
               sachetItemId: mode.type === 'plannedLot' ? mode.item.id : null,
            }
         })
      console.log(cleanModes)
      createSachet({
         variables: {
            sachet: {
               ingredientId: +ingredientId,
               ingredientProcessingId: +processingId,
               ...cleanSachet,
               modeOfFulfillments: { data: cleanModes },
            },
         },
      })
      closeSachetTunnel(1)
      setSachetForm({
         id: '',
         quantity: '',
         unit: '',
         tracking: true,
         modes: [
            {
               isActive: false,
               type: 'realTime',
               station: '',
               accuracy: 0,
               item: '',
               packaging: '',
               isLabelled: false,
               labelTemplate: '',
            },
            // {
            //    isActive: false,
            //    type: 'Co-Packer',
            //    station: '',
            //    accuracy: 0,
            //    item: {
            //       type: '',
            //       id: '',
            //    },
            //    packaging: '',
            //    isLabelled: false,
            //    labelTemplate: '',
            // },
            {
               isActive: false,
               type: 'plannedLot',
               station: '',
               accuracy: 0,
               item: '',
               packaging: '',
               isLabelled: false,
               labelTemplate: '',
            },
         ],
      })
   }

   // Mode Ops
   const toggleMode = (val, type) => {
      let index = sachetForm.modes.findIndex(mode => mode.type === type)
      const copySachetForm = sachetForm
      copySachetForm.modes[index].isActive = !sachetForm.modes[index].isActive
      setSachetForm({ ...copySachetForm })
      if (!val) {
         return
      } else {
         // check if it is configured
         if (sachetForm.modes[index].station.length > 0) {
            return
         } else {
            // configure it - open tunnel
            setModeForm(sachetForm.modes[index])
            openSachetTunnel(2)
         }
      }
   }
   const selectStationHandler = station => {
      setModeForm({ ...modeForm, station })
      selectStation('id', station.id)
      if (modeForm.type === 'realTime') openSachetTunnel(4)
      else openSachetTunnel(3)
   }
   const selectSachetItemHandler = item => {
      selectSahetItem('id', item.id)
      let copyModeForm = modeForm
      copyModeForm.item = item
      const index = sachetForm.modes.findIndex(
         mode => mode.type === modeForm.type
      )
      const copySachetForm = sachetForm
      copySachetForm.modes[index] = copyModeForm
      console.log(copySachetForm)
      setSachetForm({ ...copySachetForm })
      closeSachetTunnel(3)
      closeSachetTunnel(2)
      setModeForm({
         isActive: false,
         type: '',
         station: '',
         accuracy: 0,
         item: '',
         packaging: '',
         isLabelled: false,
         labelTemplate: '',
      })
   }
   const selectBulkItemHandler = item => {
      selectBulkItem('id', item.id)
      let copyModeForm = modeForm
      copyModeForm.item = item
      console.log(copyModeForm)
      const index = sachetForm.modes.findIndex(
         mode => mode.type === modeForm.type
      )
      const copySachetForm = sachetForm
      copySachetForm.modes[index] = copyModeForm
      setSachetForm({ ...copySachetForm })
      closeSachetTunnel(4)
      closeSachetTunnel(2)
      setModeForm({
         isActive: false,
         type: '',
         station: '',
         accuracy: 0,
         item: '',
         bulkItem: '',
         packaging: '',
         isLabelled: false,
         labelTemplate: '',
      })
   }

   const sachetTunnelHandler = () => {
      fetchUnits()
      fetchStations()
      fetchSachetItems()
      fetchBulkItems()
      fetchPackagings()
      // fetchLabelTemplates()
      openSachetTunnel(1)
   }

   return (
      <StyledSection spacing="md" hasElements={sachets.length !== 0}>
         {sachets.length > 0 ? (
            <>
               <StyledListing>
                  <StyledListingHeader>
                     <h3>
                        {t(address.concat('sachets'))} ({sachets.length})
                     </h3>
                     <span>
                        <AddIcon
                           color="#555B6E"
                           size="18"
                           stroke="2.5"
                           onClick={sachetTunnelHandler}
                        />
                     </span>
                  </StyledListingHeader>
                  {sachets.map((sachet, i) => (
                     <StyledListingTile
                        key={sachet.id}
                        active={i === selectedIndex}
                        onClick={() => setSelectedIndex(i)}
                     >
                        <Actions active={i === selectedIndex}>
                           <span onClick={() => deleteSachetHandler(sachet.id)}>
                              <DeleteIcon />
                           </span>
                        </Actions>
                        <h3>
                           {sachet.quantity} {sachet.unit}
                        </h3>
                        <p>{t(address.concat('active: real-time'))}</p>
                        <p>{t(address.concat('available: 12/40 pkt'))}</p>
                     </StyledListingTile>
                  ))}
                  <ButtonTile
                     type="primary"
                     size="lg"
                     onClick={sachetTunnelHandler}
                  />
               </StyledListing>
               <StyledDisplay contains="sachets" hasElements={true}>
                  <StyledTabsContainer>
                     <StyledTab
                        className={selectedView === 'modes' ? 'active' : ''}
                        onClick={() => setSelectedView('modes')}
                     >
                        {t(address.concat('modes of fulfillment'))}
                     </StyledTab>
                     <StyledTab
                        className={selectedView === 'inventory' ? 'active' : ''}
                        onClick={() => setSelectedView('inventory')}
                     >
                        {t(address.concat('inventory'))}
                     </StyledTab>
                  </StyledTabsContainer>
                  <StyledTabContent
                     className={selectedView === 'modes' ? 'active' : ''}
                  >
                     <Sachet sachet={sachets[selectedIndex]} />
                  </StyledTabContent>
                  <StyledTabContent
                     className={selectedView === 'inventory' ? 'active' : ''}
                  >
                     {t(address.concat('inventory'))}
                     {/* Content for inventory will come here! */}
                  </StyledTabContent>
               </StyledDisplay>
            </>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add sachet'))}
               onClick={sachetTunnelHandler}
            />
         )}
         <Tunnels tunnels={sachetTunnel}>
            <Tunnel layer={1} size="lg">
               <StyledTunnelHeader>
                  <div>
                     <CloseIcon
                        size="20px"
                        color="#888D9D"
                        onClick={() => closeSachetTunnel(1)}
                     />
                     <h1>
                        {t(address.concat('add sachet for processing'))}:{' '}
                        {processingName}
                     </h1>
                  </div>
                  <TextButton type="solid" onClick={createSachetHandler}>
                     {t(address.concat('save'))}
                  </TextButton>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <StyledTextAndSelect>
                     <Input
                        type="text"
                        placeholder={t(address.concat('enter quantity'))}
                        value={sachetForm.quantity}
                        onChange={e =>
                           setSachetForm({
                              ...sachetForm,
                              quantity: e.target.value,
                           })
                        }
                     />
                     <StyledSelect
                        onChange={e =>
                           setSachetForm({
                              ...sachetForm,
                              unit: e.target.value,
                           })
                        }
                     >
                        {units.map(unit => (
                           <option key={unit.id} value={unit.title}>
                              {unit.title}
                           </option>
                        ))}
                     </StyledSelect>
                  </StyledTextAndSelect>
                  <ToggleWrapper>
                     <Toggle
                        checked={sachetForm.tracking}
                        label={t(address.concat('take inventory'))}
                        setChecked={value =>
                           setSachetForm({
                              ...sachetForm,
                              tracking: value,
                           })
                        }
                     />
                  </ToggleWrapper>
                  <StyledTable cellSpacing={0}>
                     <thead>
                        <tr>
                           <th>{t(address.concat('mode of fulfillment'))}</th>
                           <th>{t(address.concat('station'))}</th>
                           <th>{t(address.concat('item'))}</th>
                           <th>{t(address.concat('accuracy'))}</th>
                           <th>{t(address.concat('packaging'))}</th>
                           <th>{t(address.concat('label'))}</th>
                        </tr>
                     </thead>
                     <tbody>
                        {sachetForm.modes.map(mode => (
                           <tr
                              key={mode.type}
                              onClick={() => setCurrentMode(mode.type)}
                           >
                              <td>
                                 <Checkbox
                                    checked={mode.isActive}
                                    onChange={val => toggleMode(val, mode.type)}
                                 />
                                 {mode.type}
                              </td>
                              <td>
                                 {mode.station?.title?.length > 0
                                    ? mode.station.title
                                    : '-'}
                              </td>
                              <td>
                                 {mode.item.title?.length > 0
                                    ? mode.item.title
                                    : '-'}
                              </td>
                              <td>
                                 {mode.item.title?.length > 0 ? (
                                    <RadioGroup
                                       options={accuracyOptions}
                                       active={3}
                                       onChange={option =>
                                          selectAccuracyHandler(option.value)
                                       }
                                    />
                                 ) : (
                                    '-'
                                 )}
                              </td>
                              <td>
                                 {mode.item?.title?.length > 0 ? (
                                    <>
                                       {mode.packaging?.title ? (
                                          <Tag
                                             onClick={() =>
                                                openPackagingTunnel(1)
                                             }
                                          >
                                             {mode.packaging.title}
                                          </Tag>
                                       ) : (
                                          <ButtonTile
                                             type="secondary"
                                             text={t(
                                                address.concat('packaging')
                                             )}
                                             onClick={() =>
                                                openPackagingTunnel(1)
                                             }
                                          />
                                       )}
                                    </>
                                 ) : (
                                    '-'
                                 )}
                              </td>
                              <td>
                                 {mode.item?.title?.length > 0 ? (
                                    <React.Fragment>
                                       <Toggle
                                          checked={mode.isLabelled}
                                          setChecked={val =>
                                             toggleIsLabelled(val)
                                          }
                                       />
                                       {mode.isLabelled && (
                                          <>
                                             {mode.labelTemplate?.title ? (
                                                <Tag
                                                   onClick={() =>
                                                      openLabelTunnel(1)
                                                   }
                                                >
                                                   {mode.labelTemplate.title}
                                                </Tag>
                                             ) : (
                                                <ButtonTile
                                                   noIcon
                                                   type="secondary"
                                                   text={t(
                                                      address.concat(
                                                         'select sub title'
                                                      )
                                                   )}
                                                   onClick={() =>
                                                      openLabelTunnel(1)
                                                   }
                                                />
                                             )}
                                          </>
                                       )}
                                    </React.Fragment>
                                 ) : (
                                    '-'
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </StyledTable>
               </StyledTunnelMain>
            </Tunnel>
            <Tunnel layer={2}>
               <StyledTunnelHeader>
                  <div>
                     <CloseIcon
                        size="20px"
                        color="#888D9D"
                        onClick={() => closeSachetTunnel(2)}
                     />
                     <h1>
                        {t(address.concat('select station for'))}:{' '}
                        {modeForm?.type}
                     </h1>
                  </div>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <List>
                     {Object.keys(currentStation).length > 0 ? (
                        <ListItem type="SSL1" title={currentStation.title} />
                     ) : (
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder={t(
                              address.concat("type what you're looking for")
                           )}
                        />
                     )}
                     <ListOptions>
                        {stationsList
                           .filter(option =>
                              option.title.toLowerCase().includes(search)
                           )
                           .map(option => (
                              <ListItem
                                 type="SSL1"
                                 key={option.id}
                                 title={option.title}
                                 isActive={option.id === currentStation.id}
                                 onClick={() => selectStationHandler(option)}
                              />
                           ))}
                     </ListOptions>
                  </List>
               </StyledTunnelMain>
            </Tunnel>
            <Tunnel layer={3}>
               <StyledTunnelHeader>
                  <div>
                     <CloseIcon
                        size="20px"
                        color="#888D9D"
                        onClick={() => closeSachetTunnel(3)}
                     />
                     <h1>
                        {t(address.concat('select sachet item for'))}:{' '}
                        {modeForm?.station.title}
                     </h1>
                  </div>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <List>
                     {Object.keys(currentSachetItem).length > 0 ? (
                        <ListItem type="SSL1" title={currentSachetItem.title} />
                     ) : (
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder={t(
                              address.concat("type what you're looking for")
                           )}
                        />
                     )}
                     <ListOptions>
                        {sachetItemsList
                           .filter(option =>
                              option.title.toLowerCase().includes(search)
                           )
                           .map(option => (
                              <ListItem
                                 type="SSL1"
                                 key={option.id}
                                 title={option.title}
                                 isActive={option.id === currentSachetItem.id}
                                 onClick={() => selectSachetItemHandler(option)}
                              />
                           ))}
                     </ListOptions>
                  </List>
               </StyledTunnelMain>
            </Tunnel>
            <Tunnel layer={4}>
               <StyledTunnelHeader>
                  <div>
                     <CloseIcon
                        size="20px"
                        color="#888D9D"
                        onClick={() => closeSachetTunnel(4)}
                     />
                     <h1>
                        {t(address.concat('select bulk item for'))}:{' '}
                        {modeForm?.station.title}
                     </h1>
                  </div>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <List>
                     {Object.keys(currentBulkItem).length > 0 ? (
                        <ListItem type="SSL1" title={currentBulkItem.title} />
                     ) : (
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder={t(
                              address.concat('type what you’re looking for')
                           )}
                        />
                     )}
                     <ListOptions>
                        {bulkItemsList
                           .filter(option =>
                              option.title.toLowerCase().includes(search)
                           )
                           .map(option => (
                              <ListItem
                                 type="SSL1"
                                 key={option.id}
                                 title={option.title}
                                 isActive={option.id === currentBulkItem.id}
                                 onClick={() => selectBulkItemHandler(option)}
                              />
                           ))}
                     </ListOptions>
                  </List>
               </StyledTunnelMain>
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={packagingTunnel}>
            <Tunnel layer={1}>
               <StyledTunnelHeader>
                  <div>
                     <CloseIcon
                        size="20px"
                        color="#888D9D"
                        onClick={() => closePackagingTunnel(1)}
                     />
                     <h1>
                        {t(address.concat('add packaging for processing'))}:{' '}
                        {processingName}
                     </h1>
                  </div>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <List>
                     {Object.keys(currentPackaging).length > 0 ? (
                        <ListItem type="SSL1" title={currentPackaging.title} />
                     ) : (
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder={t(
                              address.concat('type what you’re looking for')
                           )}
                        />
                     )}
                     <ListOptions>
                        {packagingList
                           .filter(option =>
                              option.title.toLowerCase().includes(search)
                           )
                           .map(option => (
                              <ListItem
                                 type="SSL1"
                                 key={option.id}
                                 title={option.title}
                                 isActive={option.id === currentPackaging.id}
                                 onClick={() => selectPackagingHandler(option)}
                              />
                           ))}
                     </ListOptions>
                  </List>
               </StyledTunnelMain>
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={labelTunnel}>
            <Tunnel layer={1}>
               <StyledTunnelHeader>
                  <div>
                     <CloseIcon
                        size="20px"
                        color="#888D9D"
                        onClick={() => closeLabelTunnel(1)}
                     />
                     <h1>
                        {t(address.concat('add label template for processing'))}
                        : {processingName}
                     </h1>
                  </div>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <List>
                     {Object.keys(currentLabelTemplate).length > 0 ? (
                        <ListItem
                           type="SSL1"
                           title={currentLabelTemplate.title}
                        />
                     ) : (
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder={t(
                              address.concat('type what you’re looking for')
                           )}
                        />
                     )}
                     <ListOptions>
                        {labelTemplateList
                           .filter(option =>
                              option.title.toLowerCase().includes(search)
                           )
                           .map(option => (
                              <ListItem
                                 type="SSL1"
                                 key={option.id}
                                 title={option.title}
                                 isActive={
                                    option.id === currentLabelTemplate.id
                                 }
                                 onClick={() =>
                                    selectLabelTemplateHandler(option)
                                 }
                              />
                           ))}
                     </ListOptions>
                  </List>
               </StyledTunnelMain>
            </Tunnel>
         </Tunnels>
      </StyledSection>
   )
}

export default Sachets
