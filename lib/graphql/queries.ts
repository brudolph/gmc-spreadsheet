import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($skip: Int!, $take: Int!) {
    products(skip: $skip, take: $take, orderBy: [{ name: asc }]) {
      id
      name
      priceMin
      priceMax
      strain
      category
      imageUrl
      inventory
      inStock
    }
    productsCount
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(where: { id: $id }) {
      id
      name
      potency
      environment
      priceMin
      priceMax
      inventory
      strain
      category
      useByDate
      imageUrl
      description
      inStock
    }
  }
`;

export const SUBMIT_ORDER = gql`
  mutation SubmitOrder(
    $customerName: String!
    $customerEmail: String!
    $items: [OrderItemInput!]!
  ) {
    submitOrder(
      customerName: $customerName
      customerEmail: $customerEmail
      items: $items
    ) {
      success
      orderId
      message
    }
  }
`;
