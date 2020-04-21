import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
   Input,
   ComboButton,
   TextButton,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'

// Global State
import { Context } from '../../../context/tabs'

// Icons
import {
   CodeIcon,
   CloseIcon,
   EditIcon,
   DeleteIcon,
} from '../../../assets/icons'

// Styled
import { StyledWrapper, StyledTunnelHeader, StyledTunnelMain } from '../styled'
import {
   StyledHeader,
   InputWrapper,
   ActionsWrapper,
   StyledMain,
   Container,
   StyledTop,
   StyledStatsContainer,
   StyledStat,
   PhotoTileWrapper,
   ImageContainer,
} from './styled'
import { Processings } from '../../../components'

import { INGREDIENT, UPDATE_INGREDIENT } from '../../../graphql'

const IngredientForm = () => {
   const { state, dispatch } = React.useContext(Context)
   const [ingredient, setIngredient] = React.useState({
      id: '',
      name: '',
      image: '',
   })
   const {} = useQuery(INGREDIENT, {
      variables: { ID: state.current.ID },
      onCompleted: data => {
         setIngredient(data.ingredient)
      },
   })
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
      onCompleted: data => {
         if (data.updateIngredient.success) {
            setIngredient({
               ...ingredient,
               ...data.updateIngredient.ingredient,
            })
            if (state.current.title !== data.updateIngredient.ingredient.name) {
               dispatch({
                  type: 'SET_TITLE',
                  payload: {
                     title: data.updateIngredient.ingredient.name,
                     oldTitle: state.current.title,
                  },
               })
            }
         } else {
            // Fire toast
            console.log(data)
         }
      },
   })

   const updateIngredientHandler = () => {
      updateIngredient({
         variables: {
            ingredientId: ingredient.id,
            name: ingredient.name,
            image: ingredient.image,
         },
      })
   }

   // Photo Tunnel
   const [photoTunnel, openPhotoTunnel, closePhotoTunnel] = useTunnel(1)
   const addPhotoHandler = image => {
      updateIngredient({
         variables: {
            ingredientId: ingredient.id,
            name: ingredient.name,
            image,
         },
      })
      closePhotoTunnel(1)
   }

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <InputWrapper>
                  <Input
                     type="text"
                     label="Ingredient Name"
                     placeholder="Untitled Ingredient"
                     name="ingredient"
                     value={ingredient.name}
                     onChange={e =>
                        setIngredient({ ...ingredient, name: e.target.value })
                     }
                     onBlur={updateIngredientHandler}
                  />
               </InputWrapper>
               <ActionsWrapper>
                  <ComboButton type="ghost">
                     <CodeIcon /> Open in editor
                  </ComboButton>
                  <TextButton type="solid">Publish</TextButton>
               </ActionsWrapper>
            </StyledHeader>
         </StyledWrapper>
         <StyledMain>
            <Container>
               <StyledTop>
                  <StyledStatsContainer>
                     <StyledStat>
                        <h2>{0}</h2>
                        <p>Processings</p>
                     </StyledStat>
                     <StyledStat>
                        <h2>{0}</h2>
                        <p> Sachets </p>
                     </StyledStat>
                  </StyledStatsContainer>
                  {ingredient.image?.length > 0 ? (
                     <ImageContainer>
                        <div>
                           <span onClick={() => openPhotoTunnel(1)}>
                              <EditIcon />
                           </span>
                           <span onClick={() => addPhotoHandler('')}>
                              <DeleteIcon />
                           </span>
                        </div>
                        <img src={ingredient.image} alt="Ingredient" />
                     </ImageContainer>
                  ) : (
                     <PhotoTileWrapper>
                        <ButtonTile
                           type="primary"
                           size="sm"
                           text="Add photo to your ingredient"
                           helper="upto 1MB - only JPG, PNG, PDF allowed"
                           onClick={() => openPhotoTunnel(1)}
                        />
                     </PhotoTileWrapper>
                  )}
                  <Tunnels tunnels={photoTunnel}>
                     <Tunnel layer={1}>
                        <StyledTunnelHeader>
                           <div>
                              <CloseIcon
                                 size="20px"
                                 color="#888D9D"
                                 onClick={() => closePhotoTunnel(1)}
                              />
                              <h1>
                                 Select Photo for ingredient: {ingredient.name}
                              </h1>
                           </div>
                        </StyledTunnelHeader>
                        <StyledTunnelMain>
                           <TextButton
                              type="solid"
                              onClick={() =>
                                 addPhotoHandler(
                                    'https://source.unsplash.com/800x600/?food'
                                 )
                              }
                           >
                              Add Dummy Photo
                           </TextButton>
                        </StyledTunnelMain>
                     </Tunnel>
                  </Tunnels>
               </StyledTop>
               <Processings ingredientId={ingredient.id} />
            </Container>
         </StyledMain>
      </>
   )
}

export default IngredientForm
