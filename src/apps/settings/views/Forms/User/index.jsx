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
   Avatar,
   Text,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

// Styled
import {
   StyledWrapper,
   StyledHeader,
   StyledForm,
   StyledRow,
   StyledSection,
   StyledTunnelHeader,
   StyledTunnelMain,
} from '../styled'
import { StyledSelect, StyledAppItem, StyledDevicesList } from './styled'

const UserForm = () => {
   const params = useParams()
   const history = useHistory()
   const { doesTabExists } = useTabs()
   const [selectedApp, setSelectedApp] = React.useState({})
   const [appsTunnels, openAppsTunnel, closeAppsTunnel] = useTunnel(1)
   const [rolesTunnels, openRolesTunnel, closeRolesTunnel] = useTunnel(1)
   const [devicesTunnels, openDevicesTunnel, closeDevicesTunnel] = useTunnel(1)
   const [form, setForm] = React.useState({
      firstname: '',
      lastname: '',
      email: '',
      phoneCode: '',
      phoneNo: '',
      apps: [],
      devices: [],
   })
   const [search, setSearch] = React.useState('')
   const [deviceSearch, setDeviceSearch] = React.useState('')

   React.useEffect(() => {
      const tab = doesTabExists(`/settings/users/${params.name}`)
      if (Object.prototype.hasOwnProperty.call(tab, 'path')) {
         setForm(form => ({ ...form, ...tab }))
      } else {
         history.push('/settings/users')
      }
   }, [params.name, history])

   const [list, selected, selectOption] = useMultiList([
      {
         id: 1,
         title: 'Ingredient App',
         icon: '',
      },
      {
         id: 2,
         title: 'Recipe App',
         icon: '',
      },
      {
         id: 3,
         title: 'Inventory App',
         icon: '',
      },
      {
         id: 4,
         title: 'Settings App',
         icon: '',
      },
   ])
   const [devicesList, selectedDevices, selectDevice] = useMultiList([
      {
         id: 1,
         title: 'Weighing Scale Terminal',
         description: 'WST-001',
      },
      {
         id: 2,
         title: 'Packaging Machine',
         description: 'PM-02',
      },
   ])

   const handleChange = e => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">New User</Text>
            <TextButton type="solid">Publish</TextButton>
         </StyledHeader>
         <StyledForm>
            <StyledRow>
               <Input
                  type="text"
                  name="firstname"
                  label="First Name"
                  value={form.firstname || ''}
                  onChange={e => handleChange(e)}
               />
               <Input
                  type="text"
                  name="lastname"
                  label="Last Name"
                  value={form.lastname || ''}
                  onChange={e => handleChange(e)}
               />
            </StyledRow>
            <StyledRow>
               <Input
                  type="text"
                  name="email"
                  label="Email"
                  value={form.email || ''}
                  onChange={e => handleChange(e)}
               />
            </StyledRow>
            <StyledRow>
               <StyledSelect
                  name="phoneCode"
                  value={form.phoneCode}
                  onChange={e => handleChange(e)}
               >
                  <option value="91">+91</option>
                  <option value="102">+102</option>
                  <option value="68">+68</option>
                  <option value="72">+72</option>
               </StyledSelect>
               <Input
                  type="text"
                  name="phoneNo"
                  label="Phone Number"
                  value={form.phoneNo || ''}
                  onChange={e => handleChange(e)}
               />
            </StyledRow>
            <StyledSection>
               <Text as="title">Apps</Text>
               {form.apps.length > 0 &&
                  form.apps.map(option => (
                     <StyledAppItem key={option.id}>
                        <div>
                           <div>
                              <Avatar
                                 withName
                                 type="round"
                                 url={option.icon}
                                 title={option.title}
                              />
                           </div>
                           <TextButton
                              type="ghost"
                              onClick={() => {
                                 setSelectedApp(option)
                                 openRolesTunnel(1)
                              }}
                           >
                              Configure
                           </TextButton>
                        </div>
                     </StyledAppItem>
                  ))}
               <ButtonTile
                  noIcon
                  size="sm"
                  type="secondary"
                  text="Select Apps"
                  onClick={() => openAppsTunnel(1)}
               />
            </StyledSection>
            <StyledSection>
               <Text as="title">Devices</Text>
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
                  text="Select Devices"
                  onClick={() => openDevicesTunnel(1)}
               />
            </StyledSection>
            <Tunnels tunnels={appsTunnels}>
               <Tunnel layer={1}>
                  <StyledTunnelHeader>
                     <div>
                        <IconButton
                           type="ghost"
                           onClick={() => closeAppsTunnel(1)}
                        >
                           <ClearIcon size={20} />
                        </IconButton>
                        <Text as="h2">Configure Apps</Text>
                     </div>
                     <TextButton
                        type="solid"
                        onClick={() => {
                           closeAppsTunnel(1)
                           setForm({ ...form, apps: [...selected] })
                        }}
                     >
                        Add
                     </TextButton>
                  </StyledTunnelHeader>
                  <StyledTunnelMain>
                     <List>
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder="type what you’re looking for..."
                        />
                        <ListOptions>
                           {list
                              .filter(option =>
                                 option.title.toLowerCase().includes(search)
                              )
                              .map(option => (
                                 <ListItem
                                    type="MSL1101"
                                    key={option.id}
                                    content={{
                                       icon: option.icon,
                                       title: option.title,
                                    }}
                                    onClick={() =>
                                       selectOption('id', option.id)
                                    }
                                    isActive={selected.find(
                                       item => item.id === option.id
                                    )}
                                 />
                              ))}
                        </ListOptions>
                     </List>
                  </StyledTunnelMain>
               </Tunnel>
            </Tunnels>
            <Tunnels tunnels={rolesTunnels}>
               <Tunnel layer={1}>
                  <StyledTunnelHeader>
                     <div>
                        <IconButton
                           type="ghost"
                           onClick={() => closeRolesTunnel(1)}
                        >
                           <ClearIcon size={20} />
                        </IconButton>
                        <Text as="h2">{selectedApp.title}</Text>
                     </div>
                     <TextButton
                        type="solid"
                        onClick={() => {
                           closeRolesTunnel(1)
                        }}
                     >
                        Save
                     </TextButton>
                  </StyledTunnelHeader>
                  <StyledTunnelMain>
                     <Text as="title">
                        Roles for role: {form.roleName || 'Untitled'}
                     </Text>
                  </StyledTunnelMain>
               </Tunnel>
            </Tunnels>
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
                        <Text as="h2">Select devices for the user</Text>
                     </div>
                     <TextButton
                        type="solid"
                        onClick={() => {
                           closeDevicesTunnel(1)
                           setForm({ ...form, devices: [...selectedDevices] })
                        }}
                     >
                        Add
                     </TextButton>
                  </StyledTunnelHeader>
                  <StyledTunnelMain>
                     <List>
                        <ListSearch
                           onChange={value => setDeviceSearch(value)}
                           placeholder="type what you’re looking for..."
                        />
                        <ListOptions>
                           {devicesList
                              .filter(option =>
                                 option.title
                                    .toLowerCase()
                                    .includes(deviceSearch)
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

export default UserForm
