import gql from 'graphql-tag'

export const CATEGORIES = gql`
   query PackagingCompanyBrand {
      packagingHub_packagingType {
         id
         name
         assets
      }
   }
`

export const Category = gql`
   query Category($id: Int!) {
      packagingHub_packagingType_by_pk(id: $id) {
         name
         id
      }
   }
`

export const PACKAGINGS = gql`
   query Packagings($id: Int!) {
      packagingHub_packaging(where: { packagingTypeId: { _eq: $id } }) {
         id
         packagingName
         assets
         height
         length
         width
         packagingType {
            id
            name
         }
         packagingCompanyBrand {
            id
            name
         }
         thickness
         packagingPurchaseOptions(order_by: { quantity: asc }) {
            id
            quantity
            unit
         }
      }
   }
`

export const PACKAGING = gql`
   query Packaging($id: Int!) {
      packagingHub_packaging_by_pk(id: $id) {
         id
         packagingName
         assets

         length
         width
         thickness
         loadCapacity
         gusset
         LWHUnit

         packagingDescription {
            id
            shortDescription
            longDescription
         }
         packagingCompanyBrand {
            id
            name
         }
         packagingPurchaseOptions(order_by: { quantity: asc }) {
            id
            quantity
            unit
            salesPrice
         }
         packagingSpecification {
            id
            fdaCompliant
            compostable
            microwaveable
            recyclable
            outerGreaseResistant
            innerGreaseResistant
            innerWaterResistant
            outerWaterResistant
            opacity
            compressibility

            packagingMaterial {
               id
               materials
            }
         }
      }
   }
`

export const ORGANISATION_PURCHASE_ORDER = gql`
   query OrganisationPurchaseOrder {
      organizationPurchaseOrders_purchaseOrder {
         id
         organizationId
      }
   }
`

export const CART_ITEMS = gql`
   query CartItems {
      organizationPurchaseOrders_purchaseOrderItem(order_by: { id: asc }) {
         id
         packaging {
            id
            packagingName
            packagingCompanyBrand {
               id
               name
            }
            assets
         }

         quantity
         salesPrice
         multiplier
         netChargeAmount
      }
   }
`
