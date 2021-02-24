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
         }
      }
   `,
}
