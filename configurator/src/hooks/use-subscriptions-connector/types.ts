import { ApolloError } from '@apollo/client';

export type TSubscriptionReturn = {
  subscription?: {
    destination?: {
      type: string;
      projectId?: string;
      topic?: string;
    };
    messages?: string[];
  };
};
type TSubscriptionMessageItem = {
  resourceTypeId: string;
  types: string[];
};
export type TSubscriptionResult = {
  subscription?: {
    destination?: {
      type: string;
      projectId?: string;
      topic?: string;
    };
    messages?: TSubscriptionMessageItem[];
  };
};
export type TUseSubscriptionFetcher = () => {
  subscription?: TSubscriptionReturn;
  error?: ApolloError;
  loading: boolean;
};

export type TSubscriptionMessageDraft = {
    resourceTypeId: string;
    types: string[];
};

export type TCreateSubscriptionMutationVariables = {
  key: string;
  projectID: string;
  topic: string;
  messages: TSubscriptionMessageDraft[];
};
