import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

// Components
import { IconButton, Loader, TextButton } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { randomSuffix } from '../../../../../shared/utils'
// Icons
import { AddIcon, DeleteIcon } from '../../../assets/icons'
// State
import { useTabs } from '../../../context'
import {
   S_COLLECTIONS,
   CREATE_COLLECTION,
   DELETE_COLLECTION,
} from '../../../graphql'
// Styled
import { StyledHeader, StyledWrapper, Flexible } from '../styled'
import tableOptions from '../tableOption'

const address = 'apps.online_store.views.listings.collectionslisting.'

const CollectionsListing = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const tableRef = React.useRef()

   // Queries
   const { data: { collections = [] } = {}, loading } = useSubscription(
      S_COLLECTIONS,
      {
         onError: error => {
            console.log(error)
         },
      }
   )

   // Mutation
   const [createCollection] = useMutation(CREATE_COLLECTION, {
      variables: {
         object: {
            name: `collection-${randomSuffix()}`,
         },
      },
      onCompleted: data => {
         addTab(
            data.createCollection.name,
            `/online-store/collections/${data.createCollection.id}`
         )
         toast.success('Collection created!')
      },
      onError: error => {
         console.log(error)
         toast.error('Some error occurred!')
      },
   })

   const [deleteCollection] = useMutation(DELETE_COLLECTION, {
      onCompleted: () => {
         toast.success('Collection deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Handler
   const deleteHandler = (e, collection) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete collection - ${collection.name}?`
         )
      ) {
         deleteCollection({
            variables: {
               id: collection.id,
            },
         })
      }
   }

   const columns = [
      {
         title: t(address.concat('collection name')),
         field: 'name',
         headerFilter: true,
         hozAlign: 'left',
         headerHozAlign: 'left',
      },
      {
         title: t(address.concat('categories')),
         field: 'categoriesCount',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: t(address.concat('products')),
         field: 'productsCount',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: t(address.concat('availability')),
         field: 'rrule',
         hozAlign: 'left',
         headerHozAlign: 'left',
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIngredient />),
         headerHozAlign: 'center',
         width: 100,
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/online-store/collections/${id}`)
   }

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('collections'))}</h1>
            <Flexible style={{ alingItems: 'center' }}>
               <TextButton
                  type="outline"
                  onClick={() => tableRef.current.table.clearHeaderFilter()}
               >
                  Clear Filters
               </TextButton>
               <span style={{ width: '10px' }} />
               <IconButton type="solid" onClick={createCollection}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </Flexible>
         </StyledHeader>
         <div>
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={collections}
               rowClick={rowClick}
               options={tableOptions}
            />
         </div>
      </StyledWrapper>
   )
}

function DeleteIngredient() {
   return <DeleteIcon color="#FF5A52" />
}

export default CollectionsListing
