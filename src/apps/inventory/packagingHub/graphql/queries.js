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
         thickness
         LWHUnit

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
            salesPrice
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

export const ORGANIZATION_PURCHASE_ORDER = gql`
   query OrganizationPurchaseOrder {
      organizationPurchaseOrders_purchaseOrder {
         id
         organizationId
         netChargeAmount
      }
   }
`

export const ORGANIZATION_PAYMENT_INFO = gql`
   query OrganizationPaymentInfo {
      organizationPurchaseOrders_purchaseOrder {
         id
         organizationId
         netChargeAmount
         organization {
            id
            stripeAccountId
         }
      }
   }
`

export const CART_ITEMS = gql`
   query CartItems {
      organizationPurchaseOrders_purchaseOrderItem(
         order_by: { id: asc }
         where: { status: { _eq: "PENDING" } }
      ) {
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
