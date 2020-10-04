import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { Loader, Text, Toggle, TunnelHeader } from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import {
   BRAND_RECURRENCES,
   UPSERT_BRAND_RECURRENCE,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const BrandTunnel = ({ closeTunnel }) => {
   const { recurrenceState } = React.useContext(RecurrenceContext)

   const tableRef = React.useRef()

   const {
      loading,
      error,
      data: { brandRecurrences = [] } = {},
   } = useSubscription(BRAND_RECURRENCES)

   const [upsertBrandRecurrence] = useMutation(UPSERT_BRAND_RECURRENCE, {
      onCompleted: data => {
         console.log(data)
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const columns = [
      {
         title: 'Title',
         field: 'title',
         headerFilter: true,
         headerSort: false,
      },
      {
         title: 'Domain',
         field: 'domain',
         headerFilter: true,
      },
      {
         title: 'Recurrence Available',
         formatter: reactFormatter(
            <ToggleRecurrence
               recurrenceId={recurrenceState.recurrenceId}
               onChange={object =>
                  upsertBrandRecurrence({ variables: { object } })
               }
            />
         ),
      },
   ]

   const options = {
      cellVertAlign: 'middle',
      layout: 'fitColumns',
      autoResize: true,
      maxHeight: 420,
      resizableColumns: true,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Link Recurrence with Brands"
            close={() => closeTunnel(5)}
         />
         <TunnelBody>
            {error ? (
               <Text as="p">Could not load brands!</Text>
            ) : (
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={brandRecurrences}
                  options={options}
               />
            )}
         </TunnelBody>
      </>
   )
}

export default BrandTunnel

const ToggleRecurrence = ({ cell, recurrenceId, onChange }) => {
   const brand = React.useRef(cell.getData())
   const [active, setActive] = React.useState(false)

   const toggleHandler = value => {
      console.log(value)
      onChange({
         recurrenceId,
         brandId: brand.current.id,
         isActive: value,
      })
   }

   React.useEffect(() => {
      const isActive = brand.current.recurrences.some(
         recurrence =>
            recurrence.recurrenceId === recurrenceId && recurrence.isActive
      )
      setActive(isActive)
   }, [brand.current])

   return <Toggle checked={active} setChecked={val => toggleHandler(val)} />
}
