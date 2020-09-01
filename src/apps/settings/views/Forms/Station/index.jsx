import React from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'

// Components
import { TextButton, Input, Loader } from '@dailykit/ui'

import { STATION, UPSERT_STATION } from '../../../graphql'

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
import { Scales } from './sections/Scales'
import { KotPrinters } from './sections/KotPrinters'
import { LabelPrinters } from './sections/LabelPrinters'

const StationForm = () => {
   const params = useParams()
   const { tab, addTab, setTabTitle } = useTabs()
   const [update] = useMutation(UPSERT_STATION)
   const { loading, data: { station = {} } = {} } = useSubscription(STATION, {
      variables: { id: params.id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         const { station } = data
         setForm({ ...form, name: station.name })
         setTabTitle(station.name)
      },
   })

   const [form, setForm] = React.useState({
      name: '',
   })

   React.useEffect(() => {
      if (!tab) {
         addTab(station?.name, `/settings/stations/${params.id}`)
      }
   }, [tab, params.id])

   const handleChange = e => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }

   const handleSubmit = () => {
      update({
         variables: {
            object: {
               id: params.id,
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
               value={form.name}
               style={{ width: '320px' }}
               onChange={e => handleChange(e)}
               placeholder="Enter the station name"
            />
            <TextButton type="solid" onClick={() => handleSubmit()}>
               Publish
            </TextButton>
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
                     <StyledTab>
                        KOT Printers ({station.kotPrinter.aggregate.count})
                     </StyledTab>
                     <StyledTab>
                        Scales ({station.scale.aggregate.count})
                     </StyledTab>
                  </StyledTabList>
                  <StyledTabPanels>
                     <StyledTabPanel>
                        <Users station={station} />
                     </StyledTabPanel>
                     <StyledTabPanel>
                        <LabelPrinters station={station} />
                     </StyledTabPanel>
                     <StyledTabPanel>
                        <KotPrinters station={station} />
                     </StyledTabPanel>
                     <StyledTabPanel>
                        <Scales station={station} />
                     </StyledTabPanel>
                  </StyledTabPanels>
               </StyledTabs>
            </StyledMain>
         )}
      </StyledWrapper>
   )
}

export default StationForm
