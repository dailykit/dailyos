import React from 'react'
import { TextButton, Text, Input, RadioGroup, HelperText } from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { RecipeContext } from '../../../../../context/recipee'
import { TunnelHeader, TunnelBody, Container, Grid } from '../styled'

const InformationTunnel = ({ closeTunnel }) => {
   const { state, dispatch } = React.useContext(RecipeContext)

   // State
   const [_state, _setState] = React.useState({
      type: state.type || 'Vegetarian',
      cuisine: state.cuisine,
      cookingTime: state.cookingTime,
      author: state.author,
      utensils: state.utensils.join(','),
      description: state.description,
   })

   const options = [
      { id: 'Non-vegetarian', title: 'Non-vegetarian' },
      { id: 'Vegetarian', title: 'Vegetarian' },
      { id: 'Vegan', title: 'Vegan' },
   ]

   //Handlers
   const save = () => {
      // Fire mutation here
      console.log('Local:', _state)
      dispatch({
         type: 'BASIC',
         payload: {
            type: _state.type,
            cuisine: _state.cuisine,
            cookingTime: _state.cookingTime,
            author: _state.author,
            utensils: _state.utensils.split(','),
            description: _state.description,
         },
      })
      closeTunnel(1)
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
                  Save
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
                  <Input
                     type="text"
                     label="Cuisine"
                     name="cuisine"
                     value={_state.cuisine}
                     onChange={e =>
                        _setState({ ..._state, cuisine: e.target.value })
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
