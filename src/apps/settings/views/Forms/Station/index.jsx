import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Components
import {
   TextButton,
   IconButton,
   ClearIcon,
   Input,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   useMultiList,
   Text,
   RadioGroup,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

// Styled
import {
   StyledWrapper,
   StyledHeader,
   StyledForm,
   StyledSection,
   StyledTunnelHeader,
   StyledTunnelMain,
} from '../styled'
import { StyledDevicesList } from './styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.views.forms.station.'

const StationForm = () => {
   const { t } = useTranslation()
   const params = useParams()
   const history = useHistory()
   const { doesTabExists } = useTabs()
   const [devicesTunnels, openDevicesTunnel, closeDevicesTunnel] = useTunnel(1)
   const [form, setForm] = React.useState({
      name: '',
      devices: [],
      type: {},
   })
   const [devicesSearch, setDevicesSearch] = React.useState('')

   React.useEffect(() => {
      const tab = doesTabExists(`/settings/stations/${params.name}`)
      if (Object.prototype.hasOwnProperty.call(tab, 'path')) {
         setForm(form => ({ ...form, ...tab }))
      } else {
         history.push('/settings/stations')
      }
   }, [params.name, history])

   const [devicesList, selectedDevices, selectDevice] = useMultiList([
      {
         id: 1,
         title: 'Weighing Scale',
         description: 'WST-001',
      },
      {
         id: 2,
         title: 'Terminal',
         description: 'T-002',
      },
      {
         id: 3,
         title: 'Label Printer',
         description: 'LP-001',
      },
   ])

   const handleChange = e => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }
   return (
      <StyledWrapper>
         <StyledHeader>
            <Input
               type="text"
               name="name"
               style={{ width: '320px' }}
               value={form.name || ''}
               onChange={e => handleChange(e)}
               placeholder={t(address.concat("enter the station name"))}
            />
            <TextButton type="solid">{t(address.concat('publish'))}</TextButton>
         </StyledHeader>
         <StyledForm>
            <Text as="title">{t(address.concat('select station type'))}</Text>
            <RadioGroup
               options={[
                  { id: 1, title: 'Packaging' },
                  { id: 2, title: 'Assembly' },
               ]}
               active={1}
               onChange={option => setForm({ ...form, type: option })}
            />
            <StyledSection>
               <Text as="title">{t(address.concat('devices'))}</Text>
               {form.devices.length > 0 && (
                  <StyledDevicesList>
                     {form.devices.map(device => (
                        <li key={device.id}>
                           <Text as="title">{device.title}</Text>
                           <Text as="subtitle">{device.description}</Text>
                        </li>
                     ))}
                  </StyledDevicesList>
               )}
               <ButtonTile
                  noIcon
                  size="sm"
                  type="secondary"
                  text={t(address.concat("select devices"))}
                  onClick={() => openDevicesTunnel(1)}
               />
            </StyledSection>
            <Tunnels tunnels={devicesTunnels}>
               <Tunnel layer={1}>
                  <StyledTunnelHeader>
                     <div>
                        <IconButton
                           type="ghost"
                           onClick={() => closeDevicesTunnel(1)}
                        >
                           <ClearIcon size={20} />
                        </IconButton>
                        <Text as="h2">{t(address.concat('select devices for the user'))}</Text>
                     </div>
                     <TextButton
                        type="solid"
                        onClick={() => {
                           closeDevicesTunnel(1)
                           setForm({ ...form, devices: [...selectedDevices] })
                        }}
                     >
                        {t(address.concat('add'))}
                     </TextButton>
                  </StyledTunnelHeader>
                  <StyledTunnelMain>
                     <List>
                        <ListSearch
                           onChange={value => setDevicesSearch(value)}
                           placeholder={t(address.concat("type what you're looking for")).concat('...')}
                        />
                        <ListOptions>
                           {devicesList
                              .filter(option =>
                                 option.title
                                    .toLowerCase()
                                    .includes(devicesSearch)
                              )
                              .map(option => (
                                 <ListItem
                                    type="MSL2"
                                    key={option.id}
                                    content={{
                                       title: option.title,
                                       description: option.description,
                                    }}
                                    onClick={() =>
                                       selectDevice('id', option.id)
                                    }
                                    isActive={selectedDevices.find(
                                       item => item.id === option.id
                                    )}
                                 />
                              ))}
                        </ListOptions>
                     </List>
                  </StyledTunnelMain>
               </Tunnel>
            </Tunnels>
         </StyledForm>
      </StyledWrapper>
   )
}

export default StationForm
