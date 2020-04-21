import React from 'react'
import {
   Text,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   IconButton,
   Checkbox,
   ButtonTile,
   ComboButton,
   Input,
} from '@dailykit/ui'

import { ProductContext } from '../../../context/product/index'

import { Message } from '../styled'
import {
   TabContainer,
   ItemTab,
   Content,
   Flexible,
   RecipeButton,
} from './styled'
import EditIcon from '../../../assets/icons/Edit'
import AddIcon from '../../../assets/icons/Add'

export default function RecipeConfigurator({ open }) {
   const [view, setView] = React.useState('pricing')
   const [isMealKit, setIsMealKit] = React.useState(false)
   const [isReadyToEat, setIsReadyToEat] = React.useState(false)

   const {
      productState: { currentRecipe, itemView },
      productDispatch,
   } = React.useContext(ProductContext)

   return (
      <div
         style={{
            width: '95%',
            margin: '0 auto',
            backgroundColor: '#fff',
            minHeight: '53vh',
            padding: '20px',
         }}
      >
         {itemView.recipes?.length === 0 && (
            <Message>Please add recipes to this product.</Message>
         )}
         {!currentRecipe.recipe && itemView.recipes?.length > 0 && (
            <Message>
               Please select a recipe from the left menu to configure.
            </Message>
         )}

         {currentRecipe.recipe && (
            <>
               <Text as="h2">{currentRecipe.title}</Text>
               <br />
               <TabContainer>
                  <ItemTab
                     active={view === 'pricing'}
                     onClick={() => setView('pricing')}
                  >
                     <Text as="title">Pricing</Text>
                  </ItemTab>
                  <ItemTab
                     active={view === 'accompaniments'}
                     onClick={() => setView('accompaniments')}
                  >
                     <Text as="title">Accompaniments</Text>
                  </ItemTab>
               </TabContainer>

               {view === 'pricing' && (
                  <>
                     <div style={{ marginTop: '20px' }}>
                        <Table>
                           <TableHead>
                              <TableRow>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell>Make Default</TableCell>
                                 <TableCell>Servings</TableCell>
                                 <TableCell>Price</TableCell>
                                 <TableCell>Discunted Price</TableCell>
                                 <TableCell align="right"></TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {currentRecipe.mealKit ? (
                                 <MealKitPricing open={open} />
                              ) : (
                                 <TableRow>
                                    <TableCell>
                                       <Checkbox
                                          checked={isMealKit}
                                          onChange={() => {
                                             setIsMealKit(!isMealKit)
                                          }}
                                       />
                                    </TableCell>
                                    <TableCell>Mealkits</TableCell>
                                    <TableCell>true</TableCell>
                                    <TableCell>...</TableCell>
                                    <TableCell>...</TableCell>
                                    <TableCell>...</TableCell>
                                    <TableCell align="right">
                                       <IconButton
                                          type="solid"
                                          onClick={() => {
                                             productDispatch({
                                                type: 'SET_MEALKIT',
                                                payload: 'MEAL_KIT',
                                             })

                                             open(4)
                                          }}
                                       >
                                          <EditIcon />
                                       </IconButton>
                                    </TableCell>
                                 </TableRow>
                              )}
                              {currentRecipe.readyToEat ? (
                                 <ReadyToEatPricing />
                              ) : (
                                 <TableRow>
                                    <TableCell>
                                       <Checkbox
                                          checked={isReadyToEat}
                                          onChange={() => {
                                             setIsReadyToEat(!isReadyToEat)
                                          }}
                                       />
                                    </TableCell>
                                    <TableCell>Ready To Eat</TableCell>
                                    <TableCell>true</TableCell>
                                    <TableCell>...</TableCell>
                                    <TableCell>...</TableCell>
                                    <TableCell>...</TableCell>
                                    <TableCell align="right">
                                       <IconButton
                                          type="solid"
                                          onClick={() => {
                                             productDispatch({
                                                type: 'SET_MEALKIT',
                                                payload: 'READY_TO_EAT',
                                             })

                                             open(4)
                                          }}
                                       >
                                          <EditIcon />
                                       </IconButton>
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </div>
                  </>
               )}

               {view === 'accompaniments' && (
                  <>
                     <div style={{ marginTop: '20px' }}>
                        {currentRecipe.accompaniments?.length === 0 && (
                           <ButtonTile
                              noIcon
                              type="secondary"
                              text="Select Accompaniment Types"
                              onClick={() => open(6)}
                              style={{ margin: '20px 0' }}
                           />
                        )}
                        {currentRecipe.accompaniments?.length > 0 && (
                           <Types open={open} />
                        )}
                     </div>
                  </>
               )}
            </>
         )}
      </div>
   )
}
function MealKitPricing({ open }) {
   const [isMealKit, setIsMealKit] = React.useState(false)
   const {
      productState: { currentRecipe },
      productDispatch,
   } = React.useContext(ProductContext)

   return (
      <>
         <TableRow>
            <TableCell>
               <Checkbox
                  checked={isMealKit}
                  onChange={() => {
                     setIsMealKit(!isMealKit)
                  }}
               />
            </TableCell>
            <TableCell>Mealkits</TableCell>
            <TableCell>true</TableCell>
            <TableCell>{currentRecipe.mealKit[0].size}</TableCell>
            <TableCell>$ {currentRecipe.mealKit[0].price}</TableCell>
            <TableCell>$ {currentRecipe.mealKit[0].discount}</TableCell>
            <TableCell align="right">
               <IconButton
                  type="solid"
                  onClick={() => {
                     productDispatch({
                        type: 'SET_MEALKIT',
                        payload: 'MEAL_KIT',
                     })

                     open(4)
                  }}
               >
                  <EditIcon />
               </IconButton>
            </TableCell>
         </TableRow>

         {currentRecipe.mealKit.map((kit, index) => {
            if (index !== 0) {
               return (
                  <TableRow>
                     <TableCell></TableCell>
                     <TableCell></TableCell>
                     <TableCell></TableCell>
                     <TableCell>{kit.size}</TableCell>
                     <TableCell>$ {kit.price}</TableCell>
                     <TableCell>$ {kit.discount}</TableCell>
                     <TableCell align="right"></TableCell>
                  </TableRow>
               )
            }
            return null
         })}
      </>
   )
}

function ReadyToEatPricing({ open }) {
   const [isReadyToEat, setIsReadyToEat] = React.useState(false)
   const {
      productState: { currentRecipe },
      productDispatch,
   } = React.useContext(ProductContext)

   return (
      <>
         <TableRow>
            <TableCell>
               <Checkbox
                  checked={isReadyToEat}
                  onChange={() => {
                     setIsReadyToEat(!isReadyToEat)
                  }}
               />
            </TableCell>
            <TableCell>Ready To Eat</TableCell>
            <TableCell>true</TableCell>
            <TableCell>{currentRecipe.readyToEat[0].size}</TableCell>
            <TableCell>$ {currentRecipe.readyToEat[0].price}</TableCell>
            <TableCell>$ {currentRecipe.readyToEat[0].discount}</TableCell>
            <TableCell align="right">
               <IconButton
                  type="solid"
                  onClick={() => {
                     productDispatch({
                        type: 'SET_MEALKIT',
                        payload: 'READY_TO_EAT',
                     })

                     open(4)
                  }}
               >
                  <EditIcon />
               </IconButton>
            </TableCell>
         </TableRow>
         {currentRecipe.readyToEat.map((kit, index) => {
            if (index !== 0) {
               return (
                  <TableRow>
                     <TableCell></TableCell>
                     <TableCell></TableCell>
                     <TableCell></TableCell>
                     <TableCell>{kit.size}</TableCell>
                     <TableCell>$ {kit.price}</TableCell>
                     <TableCell>$ {kit.discount}</TableCell>
                     <TableCell align="right"></TableCell>
                  </TableRow>
               )
            }

            return null
         })}
      </>
   )
}

function Types({ open }) {
   const { productState, productDispatch } = React.useContext(ProductContext)

   React.useEffect(() => {
      productDispatch({
         type: 'SET_ACCOMP_TYPE_VIEW',
         payload: productState.currentRecipe.accompaniments[0],
      })
   }, [])

   return (
      <>
         <TabContainer>
            {productState.currentRecipe.accompaniments.map(accomp => {
               return (
                  <ItemTab
                     key={accomp.id}
                     active={productState.activeAccomp?.id === accomp.id}
                     onClick={() => {
                        productDispatch({
                           type: 'SET_ACCOMP_TYPE_VIEW',
                           payload: accomp,
                        })
                     }}
                  >
                     <Text as="title">{accomp.title}</Text>
                  </ItemTab>
               )
            })}

            <ItemTab onClick={() => open(6)}>
               <IconButton type="ghost">
                  <AddIcon />
               </IconButton>
            </ItemTab>
         </TabContainer>

         <Accompaniment open={open} />
      </>
   )
}

function Accompaniment({ open }) {
   const {
      productState: { activeAccomp, activeProduct },
      productDispatch,
   } = React.useContext(ProductContext)

   return (
      <Content>
         <Flexible width="1">
            {activeAccomp.products?.map(product => (
               <React.Fragment key={product.id}>
                  <RecipeButton
                     active={product.id === activeProduct?.id}
                     onClick={() =>
                        productDispatch({
                           type: 'SET_ACTIVE_PRODUCT',
                           payload: product,
                        })
                     }
                  >
                     <img src={product.img} alt={product.title} />
                     <h4 style={{ marginLeft: '10px' }}>{product.title}</h4>
                  </RecipeButton>
                  <br />
               </React.Fragment>
            ))}
            <br />
            <ComboButton
               style={{ fontSize: '12px' }}
               type="ghost"
               onClick={() => open(7)}
            >
               <AddIcon />
               Add Accompaniments
            </ComboButton>
         </Flexible>
         <Flexible width="3">
            <div style={{ marginLeft: '20px' }}>
               <AccompanimentProducts />
            </div>
         </Flexible>
      </Content>
   )
}

function AccompanimentProducts() {
   const {
      productState: { activeProduct },
      productDispatch,
   } = React.useContext(ProductContext)

   if (!activeProduct.title)
      return (
         <Text as="subtitle">
            Select a Product from the right menu to configure!
         </Text>
      )

   return (
      <>
         <div
            style={{
               width: '40%',
               display: 'flex',
               marginBottom: '20px',
               alignItems: 'flex-end',
            }}
         >
            <Input
               type="text"
               placeholder="Discount as Accompaniment"
               value={activeProduct.discount || ''}
               onChange={e => {
                  const value = parseInt(e.target.value)
                  if (e.target.value === '') {
                     productDispatch({
                        type: 'SET_ACCOMPANIMENT_DISCOUNT',
                        payload: '',
                     })
                  }
                  if (value)
                     productDispatch({
                        type: 'SET_ACCOMPANIMENT_DISCOUNT',
                        payload: e.target.value,
                     })
               }}
            />{' '}
            %
         </div>

         <Text as="title">Items ({activeProduct.items.length})</Text>
         <br />

         <div style={{ display: 'flex' }}>
            {activeProduct?.items?.map((item, i) => (
               <div
                  key={i}
                  id={i}
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     marginLeft: '20px',
                  }}
               >
                  <img
                     src={item.defaultRecipe.img}
                     alt={item.defaultRecipe.title}
                  />
                  <h4 style={{ marginLeft: '10px' }}>
                     {item.defaultRecipe.title}
                  </h4>
               </div>
            ))}
         </div>
      </>
   )
}
