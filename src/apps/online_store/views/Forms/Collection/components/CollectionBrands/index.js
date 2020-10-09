import React from 'react'
import { Text, Toggle, Loader } from '@dailykit/ui'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   BRAND_COLLECTIONS,
   UPSERT_BRAND_COLLECTION,
} from '../../../../../graphql'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'

const CollectionBrands = ({ state }) => {
   const tableRef = React.useRef()

   const {
      error,
      loading,
      data: { brandCollections = [] } = {},
   } = useSubscription(BRAND_COLLECTIONS)

   const [upsertBrandCollection] = useMutation(UPSERT_BRAND_COLLECTION, {
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
         title: 'Collection Available',
         formatter: reactFormatter(
            <ToggleCollection
               collectionId={state.id}
               onChange={object =>
                  upsertBrandCollection({ variables: { object } })
               }
            />
         ),
         width: 200,
      },
   ]

   const options = {
      cellVertAlign: 'middle',
      layout: 'fitColumns',
      autoResize: true,
      maxHeight: 420,
      resizableColumns: false,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
      pagination: 'local',
      paginationSize: 10,
   }

   if (loading) return <Loader />

   return (
      <>
         <Text as="h2"> Brands </Text>
         {error ? (
            <Text as="p">Could not load brands!</Text>
         ) : (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={brandCollections}
               options={options}
            />
         )}
      </>
   )
}

export default CollectionBrands

const ToggleCollection = ({ cell, collectionId, onChange }) => {
   const brand = React.useRef(cell.getData())
   const [active, setActive] = React.useState(false)

   const toggleHandler = value => {
      console.log(value)
      onChange({
         collectionId,
         brandId: brand.current.id,
         isActive: value,
      })
   }

   React.useEffect(() => {
      const isActive = brand.current.collections.some(
         collection =>
            collection.collectionId === collectionId && collection.isActive
      )
      setActive(isActive)
   }, [brand.current])

   return <Toggle checked={active} setChecked={val => toggleHandler(val)} />
}
