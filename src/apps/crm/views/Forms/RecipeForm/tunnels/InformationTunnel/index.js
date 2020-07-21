import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   TunnelHeader,
   HelperText,
   Input,
   RadioGroup,
   Text,
   Loader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { UPDATE_RECIPE, CUISINES } from '../../../../../graphql'
import {
   Container,
   Grid,
   TunnelBody,
   StyledSelect,
   Flex,
   StyledLabel,
} from '../styled'

const InformationTunnel = ({ state, closeTunnel }) => {
   // State
   const [busy, setBusy] = React.useState(false)
   const [cuisines, setCuisines] = React.useState([])
   const [_state, _setState] = React.useState({
      type: state.type || 'Vegetarian',
      cuisine: state.cuisine || cuisines[0]?.name || '',
      cookingTime: state.cookingTime || '',
      author: state.author || '',
      utensils: state.utensils?.join(',') || '',
      description: state.description || '',
   })

   const options = [
      { id: 'Non-vegetarian', title: 'Non-vegetarian' },
      { id: 'Vegetarian', title: 'Vegetarian' },
      { id: 'Vegan', title: 'Vegan' },
   ]

   // Subscription
   const { loading } = useQuery(CUISINES, {
      onCompleted: data => {
         setCuisines(data.cuisineNames)
      },
      onError: error => {
         console.log(error)
         toast.error('Error: Cannot fetch Cuisines!')
      },
      fetchPolicy: 'cache-and-network',
   })

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      variables: {
         id: state.id,
         set: {
            type: _state.type,
            cuisine: _state.cuisine || null,
            cookingTime: _state.cookingTime,
            author: _state.author,
            utensils: _state.utensils
               ? _state.utensils.split(',').map(tag => tag.trim())
               : [],
            description: _state.description,
         },
      },
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

   const save = () => {
      if (busy) return
      setBusy(true)
      updateRecipe()
   }

   React.useEffect(() => {
      if (cuisines.length) {
         _setState({
            ..._state,
            cuisine: cuisines[0]?.name,
         })
      }
   }, [cuisines])

   return (
      <>
         <TunnelHeader
            title="Add Basic Information"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {loading ? (
               <Loader />
            ) : (
               <>
                  <Container bottom="32">
                     <Text as="subtitle">Type</Text>
                     <RadioGroup
                        options={options}
                        active={_state.type}
                        onChange={option =>
                           _setState({ ..._state, type: option.title })
                        }
                     />
                  </Container>
                  <Container bottom="32">
                     <Grid gap="16">
                        <Flex
                           direction="row"
                           align="center"
                           justify="flex-start"
                        >
                           <StyledLabel>Cuisine</StyledLabel>
                           <StyledSelect
                              value={_state.cuisine}
                              onChange={e =>
                                 _setState({
                                    ..._state,
                                    cuisine: e.target.value,
                                 })
                              }
                           >
                              {cuisines.map(cuisine => (
                                 <option key={cuisine.id} value={cuisine.name}>
                                    {cuisine.name}
                                 </option>
                              ))}
                           </StyledSelect>
                        </Flex>
                     </Grid>
                  </Container>
                  <Container bottom="32">
                     <Grid>
                        <Input
                           type="text"
                           label="Author"
                           name="author"
                           value={_state.author}
                           onChange={e =>
                              _setState({ ..._state, author: e.target.value })
                           }
                        />
                        <Input
                           type="text"
                           label="Cooking Time(mins.)"
                           name="time"
                           value={_state.cookingTime}
                           onChange={e =>
                              _setState({
                                 ..._state,
                                 cookingTime: e.target.value,
                              })
                           }
                        />
                     </Grid>
                  </Container>
                  <Container bottom="32">
                     <Input
                        type="text"
                        label="Utensils"
                        name="utensils"
                        value={_state.utensils}
                        onChange={e =>
                           _setState({ ..._state, utensils: e.target.value })
                        }
                     />
                     <HelperText
                        type="hint"
                        message="Enter comma separated values, for example: Pan, Spoon, Bowl"
                     />
                  </Container>
                  <Container bottom="32">
                     <Input
                        type="textarea"
                        label="Description"
                        name="description"
                        rows="5"
                        value={_state.description}
                        onChange={e =>
                           _setState({ ..._state, description: e.target.value })
                        }
                     />
                  </Container>
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default InformationTunnel
