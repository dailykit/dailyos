import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Components
import {
   TextButton,
   IconButton,
   Input,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   ClearIcon,
   useMultiList,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   Avatar,
   TickIcon,
   ArrowUpIcon,
   ArrowDownIcon,
   Toggle,
   Text,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

// Styled
import {
   StyledWrapper,
   StyledHeader,
   StyledSection,
   StyledTunnelHeader,
   StyledTunnelMain,
} from '../styled'
import { StyledAppItem, StyledPermissions } from './styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.views.forms.role.'

const RoleForm = () => {
   const { t } = useTranslation()
   const params = useParams()
   const history = useHistory()
   const { doesTabExists } = useTabs()
   const [isOpen, setIsOpen] = React.useState('')
   const [selectedApp, setSelectedApp] = React.useState({})
   const [appsTunnels, openAppsTunnel, closeAppsTunnel] = useTunnel(1)
   const [
      permissionTunnels,
      openPermissionsTunnel,
      closePermissionsTunnel,
   ] = useTunnel(1)
   const [form, setForm] = React.useState({
      roleName: '',
      apps: [],
   })
   const [search, setSearch] = React.useState('')

   React.useEffect(() => {
      const tab = doesTabExists(`/settings/roles/${params.name}`)
      if (Object.prototype.hasOwnProperty.call(tab, 'path')) {
         setForm(form => ({ ...form, ...tab }))
      } else {
         history.push('/settings/roles')
      }
   }, [params.name, history])

   const [list, selected, selectOption] = useMultiList([
      {
         id: 1,
         title: 'Ingredient App',
         icon: '',
         permissions: [
            { title: 'Create', allowed: true },
            { title: 'Read', allowed: false },
            { title: 'Update', allowed: true },
            { title: 'Delete', allowed: false },
         ],
      },
      {
         id: 2,
         title: 'Recipe App',
         icon: '',
         permissions: [
            { title: 'Create', allowed: false },
            { title: 'Read', allowed: true },
            { title: 'Update', allowed: false },
            { title: 'Delete', allowed: true },
         ],
      },
      {
         id: 3,
         title: 'Inventory App',
         icon: '',
         permissions: [
            { title: 'Create', allowed: true },
            { title: 'Read', allowed: false },
            { title: 'Update', allowed: true },
            { title: 'Delete', allowed: true },
         ],
      },
      {
         id: 4,
         title: 'Settings App',
         icon: '',
         permissions: [
            { title: 'Create', allowed: false },
            { title: 'Read', allowed: false },
            { title: 'Update', allowed: true },
            { title: 'Delete', allowed: false },
         ],
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
               name="roleName"
               style={{ width: '320px' }}
               value={form.roleName || ''}
               onChange={e => handleChange(e)}
               placeholder={t(address.concat("enter the role name"))}
            />
            <TextButton type="solid">{t(address.concat('publish'))}</TextButton>
         </StyledHeader>
         <StyledSection>
            <Text as="h2">{t(address.concat('apps'))} ({form.apps.length})</Text>
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
                           <span
                              tabIndex="0"
                              role="button"
                              onClick={() =>
                                 setIsOpen(value =>
                                    value === option.title ? '' : option.title
                                 )
                              }
                              onKeyPress={e =>
                                 e.charCode === 32 &&
                                 setIsOpen(value =>
                                    value === option.title ? '' : option.title
                                 )
                              }
                           >
                              {isOpen === option.title ? (
                                 <ArrowUpIcon color="#555B6E" size={24} />
                              ) : (
                                    <ArrowDownIcon color="#555B6E" size={24} />
                                 )}
                           </span>
                        </div>
                        <TextButton
                           type="ghost"
                           onClick={() => {
                              setSelectedApp(option)
                              openPermissionsTunnel(1)
                           }}
                        >
                           {t(address.concat('configure'))}
                        </TextButton>
                     </div>
                     {isOpen === option.title && (
                        <ul>
                           {option.permissions.map(permission => (
                              <li key={permission.title}>
                                 <span>
                                    {permission.allowed ? (
                                       <TickIcon color="#28C1F7" size={20} />
                                    ) : (
                                          <ClearIcon color="#FF5A52" size={20} />
                                       )}
                                 </span>
                                 <span>{permission.title}</span>
                              </li>
                           ))}
                        </ul>
                     )}
                  </StyledAppItem>
               ))}
            <ButtonTile
               noIcon
               size="sm"
               type="secondary"
               text={t(address.concat("select and configure apps"))}
               onClick={() => openAppsTunnel(1)}
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
                     <Text as="h2">{t(address.concat('configure apps'))}</Text>
                  </div>
                  <TextButton
                     type="solid"
                     onClick={() => {
                        closeAppsTunnel(1)
                        setForm({ ...form, apps: [...selected] })
                     }}
                  >
                     {t(address.concat('add'))}
                  </TextButton>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <List>
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder={t(address.concat("type what you're looking for")).concat('...')}
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
                                 onClick={() => selectOption('id', option.id)}
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
         <Tunnels tunnels={permissionTunnels}>
            <Tunnel layer={1}>
               <StyledTunnelHeader>
                  <div>
                     <IconButton
                        type="ghost"
                        onClick={() => closePermissionsTunnel(1)}
                     >
                        <ClearIcon size={20} />
                     </IconButton>
                     <Text as="h2">{selectedApp.title}</Text>
                  </div>
                  <TextButton
                     type="solid"
                     onClick={() => {
                        closePermissionsTunnel(1)
                     }}
                  >
                     {t(address.concat('save'))}
                  </TextButton>
               </StyledTunnelHeader>
               <StyledTunnelMain>
                  <Text as="title">
                     {t(address.concat('permissions for role'))}: {form.roleName || 'Untitled'}
                  </Text>
                  <StyledPermissions>
                     {Object.keys(selectedApp).length > 0 &&
                        selectedApp.permissions.map(permission => (
                           <Toggle
                              key={permission.title}
                              label={permission.title}
                              checked={permission.allowed}
                              setChecked={() =>
                                 console.log('toggle permission')
                              }
                           />
                        ))}
                  </StyledPermissions>
               </StyledTunnelMain>
            </Tunnel>
         </Tunnels>
      </StyledWrapper>
   )
}

export default RoleForm
