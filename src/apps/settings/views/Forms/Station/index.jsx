import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'

// Components
import { Input, Loader } from '@dailykit/ui'

import { STATIONS } from '../../../graphql'

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
   const [title, setTitle] = React.useState('')
   const { tab, addTab, setTabTitle } = useTabs()
   const [update] = useMutation(STATIONS.UPDATE, {
      onCompleted: () => toast.success('Successfully updated station name!'),
      onError: () => toast.error('Failed to update the station name!'),
   })
   const { loading, data: { station = {} } = {} } = useSubscription(
      STATIONS.STATION,
      {
         variables: { id: params.id },
         onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
            const { station } = data
            setTitle(station.name)
            setTabTitle(station.name)
         },
      }
   )

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(station)) {
         addTab(station?.name, `/settings/stations/${params.id}`)
      }
   }, [tab, loading, params.id, addTab, station])

   const handleSubmit = value => {
      update({
         variables: {
            _set: { name: value },
            pk_columns: { id: params.id },
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
               value={title}
               style={{ width: '320px' }}
               placeholder="Enter the station name"
               onChange={e => setTitle(e.target.value)}
               onBlur={e => handleSubmit(e.target.value)}
            />
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
