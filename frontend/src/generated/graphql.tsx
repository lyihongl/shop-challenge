import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: UserResponse;
  login: UserResponse;
  uploadImage: UploadFileResponse;
};


export type MutationRegisterUserArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};


export type MutationUploadImageArgs = {
  uploadInput: UploadImgInput;
  file: Scalars['Upload'];
};

export type MyImage = {
  __typename?: 'MyImage';
  id: Scalars['String'];
  userid: User;
  title: Scalars['String'];
  desc: Scalars['String'];
  path: Scalars['String'];
  isPrivate: Scalars['Boolean'];
  createdAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: Scalars['String'];
  getAllImages: Array<MyImage>;
};


export type UploadFileResponse = {
  __typename?: 'UploadFileResponse';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
  url: Scalars['String'];
};

export type UploadImgInput = {
  title: Scalars['String'];
  desc: Scalars['String'];
  private: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )> }
  ) }
);

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field'>
    )>> }
  ) }
);

export type UploadImageMutationVariables = Exact<{
  file: Scalars['Upload'];
  uploadInput: UploadImgInput;
}>;


export type UploadImageMutation = (
  { __typename?: 'Mutation' }
  & { uploadImage: (
    { __typename?: 'UploadFileResponse' }
    & Pick<UploadFileResponse, 'filename'>
  ) }
);

export type GetAllImagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllImagesQuery = (
  { __typename?: 'Query' }
  & { getAllImages: Array<(
    { __typename?: 'MyImage' }
    & Pick<MyImage, 'path' | 'desc' | 'createdAt'>
    & { userid: (
      { __typename?: 'User' }
      & Pick<User, 'username'>
    ) }
  )> }
);


export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  login(options: {username: $username, password: $password}) {
    user {
      id
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterUserDocument = gql`
    mutation registerUser($username: String!, $password: String!) {
  registerUser(options: {username: $username, password: $password}) {
    user {
      id
    }
    errors {
      field
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const UploadImageDocument = gql`
    mutation uploadImage($file: Upload!, $uploadInput: UploadImgInput!) {
  uploadImage(file: $file, uploadInput: $uploadInput) {
    filename
  }
}
    `;
export type UploadImageMutationFn = Apollo.MutationFunction<UploadImageMutation, UploadImageMutationVariables>;

/**
 * __useUploadImageMutation__
 *
 * To run a mutation, you first call `useUploadImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadImageMutation, { data, loading, error }] = useUploadImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *      uploadInput: // value for 'uploadInput'
 *   },
 * });
 */
export function useUploadImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadImageMutation, UploadImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadImageMutation, UploadImageMutationVariables>(UploadImageDocument, options);
      }
export type UploadImageMutationHookResult = ReturnType<typeof useUploadImageMutation>;
export type UploadImageMutationResult = Apollo.MutationResult<UploadImageMutation>;
export type UploadImageMutationOptions = Apollo.BaseMutationOptions<UploadImageMutation, UploadImageMutationVariables>;
export const GetAllImagesDocument = gql`
    query getAllImages {
  getAllImages {
    path
    userid {
      username
    }
    desc
    createdAt
  }
}
    `;

/**
 * __useGetAllImagesQuery__
 *
 * To run a query within a React component, call `useGetAllImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllImagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllImagesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllImagesQuery, GetAllImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllImagesQuery, GetAllImagesQueryVariables>(GetAllImagesDocument, options);
      }
export function useGetAllImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllImagesQuery, GetAllImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllImagesQuery, GetAllImagesQueryVariables>(GetAllImagesDocument, options);
        }
export type GetAllImagesQueryHookResult = ReturnType<typeof useGetAllImagesQuery>;
export type GetAllImagesLazyQueryHookResult = ReturnType<typeof useGetAllImagesLazyQuery>;
export type GetAllImagesQueryResult = Apollo.QueryResult<GetAllImagesQuery, GetAllImagesQueryVariables>;