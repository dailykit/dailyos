import React from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@dailykit/ui'

import {
   Styles,
   StyledCount,
   StyledServings,
   StyledProductItem,
   StyledProductTitle,
} from './styled'
import { UserIcon } from '../../../assets/icons'
import { Spacer } from '../../OrderSummary/styled'

const address = 'apps.order.components.orderlistitem.'

export const Products = ({ order }) => {
   const { t } = useTranslation()
   const {
      orderMealKitProducts: mealkits = [],
      orderInventoryProducts: inventories = [],
      orderReadyToEatProducts: readytoeats = [],
   } = order

   if (order?.thirdPartyOrderId) {
      const { thirdPartyOrder: { products = [] } = {} } = order

      if (isEmpty(products)) {
         return (
            <Flex
               container
               as="section"
               padding="14px 0"
               justifyContent="center"
            >
               <Text as="h3">No products</Text>
            </Flex>
         )
      }
      return (
         <Styles.Products>
            <Styles.Tabs>
               <Styles.TabList>
                  <Styles.Tab>
                     {t(address.concat('all'))}{' '}
                     <StyledCount>
                        {isEmpty(products) ? 0 : products?.length}
                     </StyledCount>
                  </Styles.Tab>
               </Styles.TabList>
               <Styles.TabPanels>
                  <Styles.TabPanel>
                     {products.map((product, index) => (
                        <StyledProductItem key={index}>
                           <section>{product.label}</section>
                           <Flex as="section" container alignItems="center">
                              <span>
                                 <UserIcon size={16} color="#555B6E" />
                              </span>
                              <Spacer size="4px" xAxis />
                              <span>{product.quantity}</span>
                           </Flex>
                        </StyledProductItem>
                     ))}
                  </Styles.TabPanel>
               </Styles.TabPanels>
            </Styles.Tabs>
         </Styles.Products>
      )
   }
   return (
      <Styles.Products>
         <Styles.Tabs>
            <Styles.TabList>
               <Styles.Tab>
                  {t(address.concat('all'))}{' '}
                  <StyledCount>
                     0 /&nbsp;
                     {inventories.length + mealkits.length + readytoeats.length}
                     &nbsp;
                  </StyledCount>
               </Styles.Tab>
               {!isEmpty(mealkits) && (
                  <Styles.Tab>
                     {t(address.concat('meal kits'))}{' '}
                     <StyledCount>{mealkits.length || 0}</StyledCount>
                  </Styles.Tab>
               )}
               {!isEmpty(readytoeats) && (
                  <Styles.Tab>
                     {t(address.concat('ready to eat'))}{' '}
                     <StyledCount>{readytoeats.length}</StyledCount>
                  </Styles.Tab>
               )}
               {!isEmpty(inventories) && (
                  <Styles.Tab>
                     {t(address.concat('inventory'))}{' '}
                     <StyledCount>{inventories.length || 0}</StyledCount>
                  </Styles.Tab>
               )}
            </Styles.TabList>
            <Styles.TabPanels>
               <Styles.TabPanel>
                  {inventories.map(inventory => (
                     <StyledProductItem key={inventory.id}>
                        <div>
                           <ProductTitle data={inventory} type="INVENTORY" />
                        </div>
                        <StyledServings>
                           <span>
                              <UserIcon size={16} color="#555B6E" />
                           </span>
                           <span>
                              {inventory?.inventoryProductOption?.quantity}
                              &nbsp; - &nbsp;
                              {inventory?.inventoryProductOption?.label}
                           </span>
                        </StyledServings>
                        <span>{inventory.isAssembled ? 1 : 0} / 1</span>
                     </StyledProductItem>
                  ))}
                  {mealkits.map(mealkit => (
                     <StyledProductItem key={mealkit.id}>
                        <div>
                           <ProductTitle data={mealkit} type="MEAL_KIT" />
                        </div>
                        <StyledServings>
                           <span>
                              <UserIcon size={16} color="#555B6E" />
                           </span>
                           <span>
                              {
                                 mealkit?.simpleRecipeProductOption
                                    ?.simpleRecipeYield?.yield?.serving
                              }
                              &nbsp; {t(address.concat('servings'))}
                           </span>
                        </StyledServings>
                        <span>
                           {
                              mealkit?.orderSachets.filter(
                                 sachet => sachet.isAssembled
                              ).length
                           }
                           &nbsp;/&nbsp;
                           {
                              mealkit?.orderSachets.filter(
                                 sachet => sachet.status === 'PACKED'
                              ).length
                           }
                           &nbsp; / {mealkit?.orderSachets?.length}
                        </span>
                     </StyledProductItem>
                  ))}
                  {readytoeats.map(readytoeat => (
                     <StyledProductItem key={readytoeat.id}>
                        <div>
                           <ProductTitle
                              data={readytoeat}
                              type="READY_TO_EAT"
                           />
                        </div>
                        <StyledServings>
                           <span>
                              <UserIcon size={16} color="#555B6E" />
                           </span>
                           <span>
                              {
                                 readytoeat?.simpleRecipeProductOption
                                    ?.simpleRecipeYield?.yield?.serving
                              }
                              &nbsp; {t(address.concat('servings'))}
                           </span>
                        </StyledServings>
                        <span>{readytoeat?.isAssembled ? 1 : 0} / 1</span>
                     </StyledProductItem>
                  ))}
               </Styles.TabPanel>
               {!isEmpty(mealkits) && (
                  <Styles.TabPanel>
                     {mealkits.length > 0
                        ? mealkits.map(mealkit => (
                             <StyledProductItem key={mealkit.id}>
                                <div>
                                   <ProductTitle
                                      data={mealkit}
                                      type="MEAL_KIT"
                                   />
                                </div>
                                <StyledServings>
                                   <span>
                                      <UserIcon size={16} color="#555B6E" />
                                   </span>
                                   <span>
                                      {
                                         mealkit?.simpleRecipeProductOption
                                            ?.simpleRecipeYield?.yield?.serving
                                      }
                                      &nbsp; {t(address.concat('servings'))}
                                   </span>
                                </StyledServings>
                                <span>
                                   {
                                      mealkit?.orderSachets.filter(
                                         sachet => sachet.isAssembled
                                      ).length
                                   }
                                   &nbsp;/&nbsp;
                                   {
                                      mealkit?.orderSachets.filter(
                                         sachet => sachet.status === 'PACKED'
                                      ).length
                                   }
                                   &nbsp; / {mealkit?.orderSachets?.length}
                                </span>
                             </StyledProductItem>
                          ))
                        : t(address.concat('no meal kits'))}
                  </Styles.TabPanel>
               )}
               {!isEmpty(readytoeats) && (
                  <Styles.TabPanel>
                     {readytoeats.length > 0
                        ? readytoeats.map(readytoeat => (
                             <StyledProductItem key={readytoeat.id}>
                                <div>
                                   <ProductTitle
                                      data={readytoeat}
                                      type="READY_TO_EAT"
                                   />
                                </div>
                                <StyledServings>
                                   <span>
                                      <UserIcon size={16} color="#555B6E" />
                                   </span>
                                   <span>
                                      {
                                         readytoeat?.simpleRecipeProductOption
                                            ?.simpleRecipeYield?.yield?.serving
                                      }
                                      &nbsp; {t(address.concat('servings'))}
                                   </span>
                                </StyledServings>
                                <span>
                                   {readytoeat?.isAssembled ? 1 : 0} / 1
                                </span>
                             </StyledProductItem>
                          ))
                        : t(address.concat('no ready to eat'))}
                  </Styles.TabPanel>
               )}
               {!isEmpty(inventories) && (
                  <Styles.TabPanel>
                     {inventories.length > 0
                        ? inventories.map(inventory => (
                             <StyledProductItem key={inventory.id}>
                                <div>
                                   <ProductTitle
                                      data={inventory}
                                      type="INVENTORY"
                                   />
                                </div>
                                <StyledServings>
                                   <span>
                                      <UserIcon size={16} color="#555B6E" />
                                   </span>
                                   <span>
                                      {
                                         inventory?.inventoryProductOption
                                            ?.quantity
                                      }
                                      &nbsp; - &nbsp;
                                      {inventory?.inventoryProductOption?.label}
                                   </span>
                                </StyledServings>
                                <span>{inventory.isAssembled ? 1 : 0} / 1</span>
                             </StyledProductItem>
                          ))
                        : t(address.concat('no inventories'))}
                  </Styles.TabPanel>
               )}
            </Styles.TabPanels>
         </Styles.Tabs>
      </Styles.Products>
   )
}

const ProductTitle = ({ data, type }) => {
   return (
      <StyledProductTitle>
         {['READY_TO_EAT', 'MEAL_KIT'].includes(type) &&
            data?.simpleRecipeProduct?.name}
         {type === 'INVENTORY' && data?.inventoryProduct?.name}
         {data?.comboProduct?.name && <span>&nbsp;-&nbsp;</span>}
         {data?.comboProduct?.name}
         {data?.comboProductComponent?.label &&
            `(${data?.comboProductComponent?.label})`}
      </StyledProductTitle>
   )
}
