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

import { useTranslation } from 'react-i18next'

const address = 'apps.recipe.views.forms.ingredientform.'

const IngredientForm = () => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(Context)
   const [ingredient, setIngredient] = React.useState({
      id: '',
      name: '',
      image: '',
   })
   const { } = useQuery(INGREDIENT, {
      variables: { ID: +state.current.ID },
      onCompleted: data => {
         console.log(data)
         setIngredient(data.ingredient)
      },
   })
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
      onCompleted: data => {
         if (data.updateIngredient.returning?.length) {
            setIngredient({
               ...ingredient,
               ...data.updateIngredient.returning[0],
            })
            if (
               state.current.title !== data.updateIngredient.returning[0].name
            ) {
               dispatch({
                  type: 'SET_TITLE',
                  payload: {
                     title: data.updateIngredient.returning[0].name,
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
                     placeholder={t(address.concat("untitled ingredient"))}
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
                     <CodeIcon /> {t(address.concat('open in editor'))}
                  </ComboButton>
                  <TextButton type="solid">{t(address.concat('publish'))}</TextButton>
               </ActionsWrapper>
            </StyledHeader>
         </StyledWrapper>
         <StyledMain>
            <Container>
               <StyledTop>
                  <StyledStatsContainer>
                     <StyledStat>
                        <h2>{0}</h2>
                        <p>{t(address.concat('processings'))}</p>
                     </StyledStat>
                     <StyledStat>
                        <h2>{0}</h2>
                        <p> {t(address.concat('sachets'))} </p>
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
                              text={t(address.concat("add photo to your ingredient"))}
                              helper={t(address.concat("upto 1MB - only JPG, PNG, PDF allowed"))}
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
                                 {t(address.concat('select photo for ingredient'))}: {ingredient.name}
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
                              {t(address.concat('add dummy photo'))}
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
