import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Components
import {
   TextButton,
   IconButton,
   Text,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   ClearIcon,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   useMultiList,
   Avatar,
   Input,
} from '@dailykit/ui'

import { useTabs } from '../../../context'

import {
   SectionTabs,
   SectionTabList,
   SectionTab,
   SectionTabPanels,
   SectionTabPanel,
} from '../../../components'

// Styled
import {
   StyledWrapper,
   StyledHeader,
   StyledSection,
   StyledTunnelHeader,
   StyledTunnelMain,
} from '../styled'
import { StyledSelectedUsers, StyledPanelHeader } from './styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.views.forms.device.'

const DeviceForm = () => {
   const { t } = useTranslation()
   const params = useParams()
   const history = useHistory()
   const { doesTabExists } = useTabs()
   const [usersTunnels, openUsersTunnel, closeUsersTunnel] = useTunnel(1)
   const [search, setSearch] = React.useState('')
   const [form, setForm] = React.useState({
      name: '',
      users: [],
   })

   React.useEffect(() => {
      const tab = doesTabExists(`/settings/devices/${params.name}`)
      if (Object.prototype.hasOwnProperty.call(tab, 'path')) {
         setForm(form => ({ ...form, ...tab }))
      } else {
         history.push('/settings/devices')
      }
   }, [params.name, history])

   const [usersList, selectedUsers, selectUser] = useMultiList([
      { id: 1, title: 'Praveen Bisht', img: '' },
      { id: 2, title: 'Marky Mark', img: '' },
      { id: 3, title: 'Peter Parker', img: '' },
   ])

   const [printers] = React.useState([
      {
         id: 1,
         title: 'HP 133',
         labels: [
            { id: 1, title: 'Label 1' },
            { id: 2, title: 'Label 2' },
         ],
      },
      {
         id: 2,
         title: 'Canon Pixma 10A',
         labels: [
            { id: 1, title: 'Label 1' },
            { id: 2, title: 'Label 2' },
         ],
      },
   ])

   return (
      <StyledWrapper>
         <StyledHeader>
            <Input
               type="text"
               name="name"
               style={{ width: '320px' }}
               value={form.name || ''}
               onChange={e => setForm({ ...form, name: e.target.value })}
               placeholder={t(address.concat("enter the device name"))}
            />
            <TextButton type="solid">{t(address.concat('launch'))}</TextButton>
         </StyledHeader>
         <StyledSection w="480px" m="32px 20px">
            <Text as="title">{t(address.concat('users'))}</Text>
            {form.users?.length > 0 && (
               <StyledSelectedUsers>
                  {form.users.map(user => (
                     <Avatar
                        withName
                        key={user.id}
                        url={user.img}
                        title={user.title}
                     />
                  ))}
               </StyledSelectedUsers>
            )}
            <ButtonTile
               noIcon
               size="sm"
               type="secondary"
               text={t(address.concat("select and assign users"))}
               onClick={() => openUsersTunnel(1)}
            />
            <Tunnels tunnels={usersTunnels}>
               <Tunnel layer={1}>
                  <StyledTunnelHeader>
                     <div>
                        <IconButton
                           type="ghost"
                           onClick={() => closeUsersTunnel(1)}
                        >
                           <ClearIcon size={20} />
                        </IconButton>
                        <Text as="h2">{t(address.concat('configure apps'))}</Text>
                     </div>
                     <TextButton
                        type="solid"
                        onClick={() => {
                           closeUsersTunnel(1)
                           setForm({ ...form, users: selectedUsers })
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
                           {usersList
                              .filter(option =>
                                 option.title.toLowerCase().includes(search)
                              )
                              .map(option => (
                                 <ListItem
                                    type="MSL111"
                                    key={option.id}
                                    content={{
                                       img: option.img,
                                       title: option.title,
                                       roles: [],
                                    }}
                                    onClick={() => selectUser('id', option.id)}
                                    isActive={selectedUsers.find(
                                       item => item.id === option.id
                                    )}
                                 />
                              ))}
                        </ListOptions>
                     </List>
                  </StyledTunnelMain>
               </Tunnel>
            </Tunnels>
         </StyledSection>
         <StyledSection bg="#F3F3F3" m="20px 0 0 0" p="20px">
            <SectionTabs>
               <SectionTabList>
                  {printers.map(printer => (
                     <SectionTab key={printer.id} title={printer.title} />
                  ))}
               </SectionTabList>
               <SectionTabPanels>
                  {printers.map(printer => (
                     <SectionTabPanel key={printer.id}>
                        <StyledPanelHeader>
                           <h2>{printer.title}</h2>
                           <SectionTabs>
                              <SectionTabList>
                                 {printer.labels.map(label => (
                                    <SectionTab
                                       key={label.id}
                                       title={label.title}
                                    />
                                 ))}
                              </SectionTabList>
                              <SectionTabPanels nopadding="true">
                                 {printer.labels.map(label => (
                                    <SectionTabPanel key={label.id}>
                                       <StyledPanelHeader>
                                          <h2>{label.title}</h2>
                                       </StyledPanelHeader>
                                    </SectionTabPanel>
                                 ))}
                              </SectionTabPanels>
                           </SectionTabs>
                        </StyledPanelHeader>
                     </SectionTabPanel>
                  ))}
               </SectionTabPanels>
            </SectionTabs>
         </StyledSection>
      </StyledWrapper>
   )
}

export default DeviceForm
