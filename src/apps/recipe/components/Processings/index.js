import React from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   TextButton,
   List,
   ListOptions,
   ListSearch,
   TagGroup,
   Tag,
   ListItem,
   useMultiList
} from '@dailykit/ui'

import { AddIcon, DeleteIcon, CloseIcon } from '../../assets/icons'
import {
   StyledSection,
   StyledListing,
   StyledListingHeader,
   StyledListingTile,
   StyledDisplay,
   Actions,
   StyledTunnelHeader,
   StyledTunnelMain
} from '../styled'
import {
   PROCESSINGS_OF_INGREDIENT,
   CREATE_PROCESSINGS,
   DELETE_PROCESSING,
   FETCH_PROCESSING_NAMES
} from '../../graphql'
import { Sachets } from '../'

const Processings = ({ ingredientId }) => {
   // States
   const [processings, setProcessings] = React.useState([])
   const [selectedIndex, setSelectedIndex] = React.useState(0)

   // Queries and Mutations
   const _ = useQuery(FETCH_PROCESSING_NAMES, {
      onCompleted: data => {
         processingNamesList.length = 0
         processingNamesList.push(...data.processingNames)
      }
   })
   const __ = useQuery(PROCESSINGS_OF_INGREDIENT, {
      variables: { ingredientId },
      onCompleted: data => {
         setProcessings(data.ingredient.processings)
      }
   })

   const [createProcessings] = useMutation(CREATE_PROCESSINGS, {
      onCompleted: data => {
         setProcessings([...processings, ...data.createProcessings])
      },
      refetchQueries: [
         {
            query: PROCESSINGS_OF_INGREDIENT,
            variables: {
               ingredientId
            }
         }
      ]
      // Can do it manually but returning obj has ids instead of populated fields, that creates problem while rendering
      // update: (cache, { data: { createProcessings } }) => {
      //    const { ingredient: cached_ingredient } = cache.readQuery({
      //       query: PROCESSINGS_OF_INGREDIENT,
      //       variables: { ingredientId }
      //    })
      //    console.log(cached_ingredient)
      //    cache.writeQuery({
      //       query: PROCESSINGS_OF_INGREDIENT,
      //       variables: { ingredientId },
      //       data: {
      //          ingredient: {
      //             ...cached_ingredient,
      //             processings: cached_ingredient.processings.concat([
      //                createProcessings
      //             ])
      //          }
      //       }
      //    })
      // }
   })
   const [deleteProcessing] = useMutation(DELETE_PROCESSING, {
      onCompleted: data => {
         if (data.deleteProcessing.success) {
            const newProcessings = processings.filter(
               processing =>
                  processing.id !== data.deleteProcessing.processing.id
            )
            setProcessings(newProcessings)
         } else {
            // Fire toast
            console.log('Error while deleting!')
         }
      },
      update: (
         cache,
         {
            data: {
               deleteProcessing: { processing }
            }
         }
      ) => {
         const { ingredient: cached_ingredient } = cache.readQuery({
            query: PROCESSINGS_OF_INGREDIENT,
            variables: { ingredientId }
         })
         cache.writeQuery({
            query: PROCESSINGS_OF_INGREDIENT,
            variables: { ingredientId },
            data: {
               ingredient: {
                  ...cached_ingredient,
                  processings: cached_ingredient.processings.filter(
                     proc => proc.id !== processing.id
                  )
               }
            }
         })
      }
   })

   //Lists
   const [
      processingNamesList,
      selectedProcessingNames,
      selectProcessingName
   ] = useMultiList([])

   // Tunnels
   const [
      processingTunnel,
      openProcessingTunnel,
      closeProcessingTunnel
   ] = useTunnel(1)
   const [search, setSearch] = React.useState('')

   // Handlers
   const addProcessingsHandler = () => {
      const names = selectedProcessingNames.map(item => item.id)
      createProcessings({
         variables: { ingredientId, processingNames: names }
      })
      closeProcessingTunnel(1)
   }

   const deleteProcessingHandler = processingId => {
      deleteProcessing({
         variables: {
            input: {
               ingredientId,
               processingId
            }
         }
      })
   }

   return (
      <StyledSection hasElements={processings?.length !== 0}>
         <StyledListing>
            <StyledListingHeader>
               <h3>Processings ({processings?.length})</h3>
               <span onClick={() => openProcessingTunnel(1)}>
                  <AddIcon color='#555B6E' size='18' stroke='2.5' />
               </span>
            </StyledListingHeader>
            {processings?.map((processing, i) => (
               <StyledListingTile
                  key={processing.id}
                  active={i === selectedIndex}
                  onClick={() => setSelectedIndex(i)}
               >
                  <Actions active={i === selectedIndex}>
                     <span
                        onClick={() => deleteProcessingHandler(processing.id)}
                     >
                        <DeleteIcon />
                     </span>
                  </Actions>
                  <h3>{processing.name.title}</h3>
                  <p>Sachets: {processing.sachets.length}</p>
                  <p>Recipes: {processing.recipes.length}</p>
               </StyledListingTile>
            ))}
            <ButtonTile
               type='primary'
               size='lg'
               onClick={() => openProcessingTunnel(1)}
            />
            <Tunnels tunnels={processingTunnel}>
               <Tunnel layer={1}>
                  <StyledTunnelHeader>
                     <div>
                        <CloseIcon
                           size='20px'
                           color='#888D9D'
                           onClick={() => closeProcessingTunnel(1)}
                        />
                        <h1>Select Processings</h1>
                     </div>
                     <TextButton type='solid' onClick={addProcessingsHandler}>
                        Save
                     </TextButton>
                  </StyledTunnelHeader>
                  <StyledTunnelMain>
                     <List>
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder='type what you’re looking for...'
                        />
                        {selectedProcessingNames.length > 0 && (
                           <TagGroup style={{ margin: '8px 0' }}>
                              {selectedProcessingNames.map(option => (
                                 <Tag
                                    key={option.id}
                                    title={option.title}
                                    onClick={() =>
                                       selectProcessingName('id', option.id)
                                    }
                                 >
                                    {option.title}
                                 </Tag>
                              ))}
                           </TagGroup>
                        )}
                        <ListOptions>
                           {processingNamesList
                              .filter(option =>
                                 option.title.toLowerCase().includes(search)
                              )
                              .map(option => (
                                 <ListItem
                                    type='MSL1'
                                    key={option.id}
                                    title={option.title}
                                    onClick={() =>
                                       selectProcessingName('id', option.id)
                                    }
                                    isActive={selectedProcessingNames.find(
                                       item => item.id === option.id
                                    )}
                                 />
                              ))}
                        </ListOptions>
                     </List>
                  </StyledTunnelMain>
               </Tunnel>
            </Tunnels>
         </StyledListing>
         <StyledDisplay hasElements={processings?.length !== 0}>
            <Sachets
               ingredientId={ingredientId}
               processingId={processings[selectedIndex]?.id}
               processingName={processings[selectedIndex]?.name.title}
            />
         </StyledDisplay>
      </StyledSection>
   )
}

export default Processings
