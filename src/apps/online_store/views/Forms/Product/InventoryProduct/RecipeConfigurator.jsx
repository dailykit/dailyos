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

import { InventoryProductContext } from '../../../../context/product/inventoryProduct'

import { Message } from '../../styled'
import {
   TabContainer,
   ItemTab,
   Content,
   Flexible,
   RecipeButton,
} from '../styled'
import EditIcon from '../../../../assets/icons/Edit'
import AddIcon from '../../../../assets/icons/Add'

export default function RecipeConfigurator({ open }) {
   const [view, setView] = React.useState('pricing')
   const [isMealKit, setIsMealKit] = React.useState(false)
   const [isReadyToEat, setIsReadyToEat] = React.useState(false)

   const {
      inventoryProductState: { currentInventoryItem, itemView },
      inventoryProductDispatch,
   } = React.useContext(InventoryProductContext)

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
         {itemView.inventoryItems?.length === 0 && (
            <Message>Please add recipes to this product.</Message>
         )}
         {!currentInventoryItem.id && itemView.inventoryItems?.length > 0 && (
            <Message>
               Please select a recipe from the left menu to configure.
            </Message>
         )}

         {currentInventoryItem.id && (
            <>
               <Text as="h2">{currentInventoryItem.title}</Text>
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
                                 <TableCell>Variant</TableCell>
                                 <TableCell>Add Quantity</TableCell>
                                 <TableCell>Set Pricing</TableCell>
                                 <TableCell>Discounted Price</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {currentInventoryItem?.variants?.map(
                                 (variant, index) => (
                                    <TableRow key={index}>
                                       <TableCell>
                                          <Input
                                             type="text"
                                             name="name"
                                             placeholder="enter variant name"
                                             value={variant.name}
                                             onChange={e => {
                                                inventoryProductDispatch({
                                                   type: 'SET_VARIANT',
                                                   payload: {
                                                      index,
                                                      field: e.target.name,
                                                      value: e.target.value,
                                                   },
                                                })
                                             }}
                                          />
                                       </TableCell>
                                       <TableCell>
                                          <Input
                                             type="text"
                                             name="quantity"
                                             placeholder="Quantity"
                                             value={variant.quantity}
                                             onChange={e => {
                                                if (
                                                   parseInt(e.target.value) ||
                                                   e.target.value.length === 0
                                                ) {
                                                   inventoryProductDispatch({
                                                      type: 'SET_VARIANT',
                                                      payload: {
                                                         index,
                                                         field: e.target.name,
                                                         value: parseInt(
                                                            e.target.value
                                                         ),
                                                      },
                                                   })
                                                }
                                             }}
                                          />
                                       </TableCell>
                                       <TableCell>
                                          <Input
                                             type="text"
                                             name="price"
                                             placeholder="Set Pricing"
                                             value={variant.price}
                                             onChange={e => {
                                                if (
                                                   parseInt(e.target.value) ||
                                                   e.target.value.length === 0
                                                ) {
                                                   inventoryProductDispatch({
                                                      type: 'SET_VARIANT',
                                                      payload: {
                                                         index,
                                                         field: e.target.name,
                                                         value: parseInt(
                                                            e.target.value
                                                         ),
                                                      },
                                                   })
                                                }
                                             }}
                                          />
                                       </TableCell>
                                       <TableCell>
                                          <Input
                                             type="text"
                                             name="discount"
                                             placeholder="Set Pricing"
                                             value={variant.discount}
                                             onChange={e => {
                                                if (
                                                   parseInt(e.target.value) ||
                                                   e.target.value.length === 0
                                                ) {
                                                   inventoryProductDispatch({
                                                      type: 'SET_VARIANT',
                                                      payload: {
                                                         index,
                                                         field: e.target.name,
                                                         value: parseInt(
                                                            e.target.value
                                                         ),
                                                      },
                                                   })
                                                }
                                             }}
                                          />
                                       </TableCell>
                                    </TableRow>
                                 )
                              )}

                              {/* <TableRow>
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
                                 <TableCell align='right'>
                                    <IconButton
                                       type='solid'
                                       onClick={() => {
                                          inventoryProductDispatch({
                                             type: 'SET_MEALKIT',
                                             payload: 'READY_TO_EAT'
                                          })

                                          open(4)
                                       }}
                                    >
                                       <EditIcon />
                                    </IconButton>
                                 </TableCell>
                              </TableRow> */}
                           </TableBody>
                        </Table>
                        <ComboButton
                           style={{ fontSize: '12px' }}
                           type="ghost"
                           onClick={() =>
                              inventoryProductDispatch({
                                 type: 'ADD_PRODUCT_VARIANT',
                              })
                           }
                        >
                           <AddIcon />
                           Add another variant
                        </ComboButton>
                     </div>
                  </>
               )}

               {view === 'accompaniments' && (
                  <>
                     <div style={{ marginTop: '20px' }}>
                        {itemView.accompaniments.length === 0 && (
                           <ButtonTile
                              noIcon
                              type="secondary"
                              text="Select Accompaniment Types"
                              onClick={() => open(6)}
                              style={{ margin: '20px 0' }}
                           />
                        )}
                        {itemView.accompaniments.length > 0 && (
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
      productState: { currentInventoryItem },
      inventoryProductDispatch,
   } = React.useContext(InventoryProductContext)

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
            <TableCell>{currentInventoryItem.mealKit[0].size}</TableCell>
            <TableCell>$ {currentInventoryItem.mealKit[0].price}</TableCell>
            <TableCell>$ {currentInventoryItem.mealKit[0].discount}</TableCell>
            <TableCell align="right">
               <IconButton
                  type="solid"
                  onClick={() => {
                     inventoryProductDispatch({
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

         {currentInventoryItem.mealKit.map((kit, index) => {
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
      productState: { currentInventoryItem },
      inventoryProductDispatch,
   } = React.useContext(InventoryProductContext)

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
            <TableCell>{currentInventoryItem.readyToEat[0].size}</TableCell>
            <TableCell>$ {currentInventoryItem.readyToEat[0].price}</TableCell>
            <TableCell>
               $ {currentInventoryItem.readyToEat[0].discount}
            </TableCell>
            <TableCell align="right">
               <IconButton
                  type="solid"
                  onClick={() => {
                     inventoryProductDispatch({
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
         {currentInventoryItem.readyToEat.map((kit, index) => {
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
   const { productState, inventoryProductDispatch } = React.useContext(
      InventoryProductContext
   )

   React.useEffect(() => {
      inventoryProductDispatch({
         type: 'SET_ACCOMP_TYPE_VIEW',
         payload: productState.itemView.accompaniments[0],
      })
   }, [])

   return (
      <>
         <TabContainer>
            {productState.itemView.accompaniments.map(accomp => {
               return (
                  <ItemTab
                     key={accomp.id}
                     active={productState.activeAccomp?.id === accomp.id}
                     onClick={() => {
                        inventoryProductDispatch({
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
      inventoryProductDispatch,
   } = React.useContext(InventoryProductContext)

   return (
      <Content>
         <Flexible width="1">
            {activeAccomp.products?.map(product => (
               <React.Fragment key={product.id}>
                  <RecipeButton
                     active={product.id === activeProduct?.id}
                     onClick={() =>
                        inventoryProductDispatch({
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
   const [discount, setDiscount] = React.useState('')
   const {
      productState: { activeProduct },
      inventoryProductDispatch,
   } = React.useContext(InventoryProductContext)

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
               value={discount}
               onChange={e => {
                  const value = parseInt(parseInt(e.target.value))
                  if (parseInt(e.target.value) === '') setDiscount('')
                  if (value) setDiscount(value)
               }}
               onBlur={e =>
                  inventoryProductDispatch({
                     type: 'SET_ACCOMPANIMENT_DISCOUNT',
                     payload: discount,
                  })
               }
            />{' '}
            %
         </div>

         <Text as="title">Items</Text>
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
