import gql from 'graphql-tag'

export const PRODUCTS = {
   CREATE: gql`
      mutation CreateProduct($object: products_product_insert_input!) {
         createProduct(object: $object) {
            id
            name
         }
      }
   `,
   LIST: gql`
      subscription ProductsView($where: products_productView_bool_exp) {
         productsView(where: $where) {
            id
            name
            isPublished
         }
      }
   `,
}

export const PRODUCT = {
   UPDATE: gql`
      mutation UpdateProduct($id: Int!, $_set: products_product_set_input) {
         updateProduct(pk_columns: { id: $id }, _set: $_set) {
            id
         }
      }
   `,
   VIEW: gql`
      subscription Product($id: Int!) {
         product(id: $id) {
            id
            name
            assets
            tags
            additionalText
            description
            basePrice
            isPopupAllowed
            isPublished
            productOptions {
               id
               label
               price
               discount
               quantity
               simpleRecipeYield {
                  id
                  yield
                  simpleRecipe {
                     id
                     name
                  }
               }
               supplierItem {
                  id
                  name
                  unit
                  unitSize
               }
               sachetItem {
                  id
                  bulkItem {
                     processingName
                     supplierItem {
                        name
                     }
                  }
                  unit
                  unitSize
               }
            }
         }
      }
   `,
}

export const PRODUCT_OPTION = {
   CREATE: gql`
      mutation CreateProductOption(
         $object: products_productOption_insert_input!
      ) {
         createProductOption(object: $object) {
            id
         }
      }
   `,
   UPDATE: gql`
      mutation UpdateProductOption(
         $id: Int!
         $_set: products_productOption_set_input
      ) {
         updateProductOption(pk_columns: { id: $id }, _set: $_set) {
            id
         }
      }
   `,
}
