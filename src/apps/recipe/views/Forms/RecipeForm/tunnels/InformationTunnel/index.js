import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { HelperText, Input, RadioGroup, Text, TextButton } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../assets/icons'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Container,
   Grid,
   TunnelBody,
   TunnelHeader,
   StyledSelect,
   Flex,
   StyledLabel,
} from '../styled'

const InformationTunnel = ({ state, closeTunnel, cuisines }) => {
   // State
   const [busy, setBusy] = React.useState(false)
   const [_state, _setState] = React.useState({
      type: state.type || 'Vegetarian',
      cuisine: state.cuisine || cuisines[0]?.name,
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
      onError: error => {
         console.log(error)
         toast.error('Error!')
         setBusy(false)
      },
   })

   //Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      updateRecipe()
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(1)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Basic Information</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
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
                  <Flex direction="row" align="center" justify="flex-start">
                     <StyledLabel>Cuisine</StyledLabel>
                     <StyledSelect
                        value={_state.cuisine}
                        onChange={e =>
                           _setState({ ..._state, cuisine: e.target.value })
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
                        _setState({ ..._state, cookingTime: e.target.value })
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
         </TunnelBody>
      </React.Fragment>
   )
}

export default InformationTunnel
