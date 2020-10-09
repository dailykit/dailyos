import React from 'react'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

// Components
import { IconButton, Text, Loader } from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

import { STATIONS, DELETE_STATION, UPSERT_STATION } from '../../../graphql'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon, DeleteIcon } from '../../../../../shared/assets/icons'
import tableOptions from '../tableOption'

const StationsListing = () => {
   const history = useHistory()
   const { tab, addTab } = useTabs()
   const tableRef = React.useRef()
   const { error, loading, data: { stations } = {} } = useSubscription(STATIONS)
   const [create] = useMutation(UPSERT_STATION, {
      onCompleted: ({ insertStation = {} }) => {
         addTab(insertStation.name, `/settings/stations/${insertStation.id}`)
      },
   })
   const [remove] = useMutation(DELETE_STATION, {
      onCompleted: () => {
         toast.success('Successfully deleted the station!')
      },
      onError: () => {
         toast.success('Failed to delete the station!')
      },
   })

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/settings/stations/${id}`)
   }

   const columns = [
      { title: 'Station Name', field: 'name', headerFilter: true },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cssClass: 'center-text',
         cellClick: (e, cell) => {
            e.stopPropagation()
            const { id } = cell._cell.row.data
            remove({ variables: { id } })
         },
         formatter: reactFormatter(<DeleteIcon color="#FF5A52" />),
         width: 150,
      },
   ]

   React.useEffect(() => {
      if (!tab) {
         addTab('Stations', `/settings/stations`)
      }
   }, [history, tab, addTab])

   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">Stations</Text>
            <IconButton
               type="solid"
               onClick={() =>
                  create({
                     variables: {
                        object: {
                           name: `stations${uuid().split('-')[0]}`,
                        },
                     },
                  })
               }
            >
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         {loading && <Loader />}
         {error && <div>{error.message}</div>}
         {stations?.length === 0 && <div>No stations yet!</div>}
         {stations?.length && (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={stations}
               rowClick={rowClick}
               options={tableOptions}
            />
         )}
      </StyledWrapper>
   )
}

export default StationsListing
