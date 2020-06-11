import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'

// Components
import { TextButton, Input, Loader } from '@dailykit/ui'

import { CREATE_STATION, STATION, UPDATE_STATION } from '../../../graphql'

// State
import { useTabs } from '../../../context'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

import {
   StyledMain,
   StyledTabs,
   StyledTabList,
   StyledTab,
   StyledTabPanel,
   StyledTabPanels,
} from './styled'

import { Users } from './sections/Users'
import { Printers } from './sections/Printers'

const StationForm = () => {
   const params = useParams()
   const history = useHistory()
   const { tabs, removeTab, doesTabExists } = useTabs()
   const { loading, data: { station = {} } = {} } = useSubscription(STATION, {
      variables: { id: params.name },
   })

   const [update] = useMutation(UPDATE_STATION)
   const [create] = useMutation(CREATE_STATION, {
      onCompleted: () => {
         const condition = node =>
            node.path === `/settings/stations/${params.name}`
         const index = tabs.findIndex(condition)
         const tab = tabs.find(condition)
         removeTab(null, { tab, index })
      },
   })
   const [form, setForm] = React.useState({
      name: '',
   })

   React.useEffect(() => {
      const tab = doesTabExists(`/settings/stations/${params.name}`)
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         // history.push('/settings/stations')
      }
   }, [params.name, history])

   const handleChange = e => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }

   const handleSubmit = () => {
      create({
         variables: {
            object: {
               name: form.name,
            },
         },
      })
   }

   const handleUpdate = () => {
      update({
         variables: {
            id: params.name,
            _set: {
               name: form.name,
            },
         },
      })
   }

   if (loading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader>
            <Input
               type="text"
               name="name"
               style={{ width: '320px' }}
               onChange={e => handleChange(e)}
               value={form.name || station.name}
               placeholder="Enter the station name"
            />
            {station?.name ? (
               <TextButton type="solid" onClick={() => handleUpdate()}>
                  Update
               </TextButton>
            ) : (
               <TextButton type="solid" onClick={() => handleSubmit()}>
                  Publish
               </TextButton>
            )}
         </StyledHeader>
         {station?.name && (
            <StyledMain>
               <h3>Configure</h3>
               <StyledTabs>
                  <StyledTabList>
                     <StyledTab>
                        Users ({station.user.aggregate.count})
                     </StyledTab>
                     <StyledTab>
                        Labels Printers ({station.labelPrinter.aggregate.count})
                     </StyledTab>
                  </StyledTabList>
                  <StyledTabPanels>
                     <StyledTabPanel>
                        <Users station={station} />
                     </StyledTabPanel>
                     <StyledTabPanel>
                        <Printers station={station} />
                     </StyledTabPanel>
                  </StyledTabPanels>
               </StyledTabs>
            </StyledMain>
         )}
      </StyledWrapper>
   )
}

export default StationForm
