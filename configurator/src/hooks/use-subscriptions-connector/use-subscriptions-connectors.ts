import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchSubscriptionQuery from './fetch-subscription.ctp.graphql';
import CreateSubscriptionMutation from './create-subscription.ctp.graphql';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  TCreateSubscriptionMutationVariables,
  TSubscriptionMessageDraft,
  TSubscriptionReturn,
} from './types';
import { TUseSubscriptionFetcher, TSubscriptionResult } from './types';
import { extractErrorFromGraphQlResponse } from '../../helpers';

export const useSubscriptionFetch: TUseSubscriptionFetcher = () => {
  // @ts-ignore
  const { subscriptionKey } = useApplicationContext(
    (context) => context.environment
  );

  const { data, error, loading } = useMcQuery<TSubscriptionResult>(
    FetchSubscriptionQuery,
    {
      variables: {
        key: subscriptionKey,
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );

  const subscription: TSubscriptionReturn = {
    subscription: {
      destination: data?.subscription?.destination,
      messages: data?.subscription?.messages
        ?.map((item) => item.types)
        .reduce((acc, val) => [...acc, ...val], []),
    },
  };

  return {
    subscription,
    error,
    loading,
  };
};

export const useSubscriptionCreator = () => {

  // @ts-ignore
  const { projectkey, topic, subscriptionKey } = useApplicationContext(
    (context) => context.environment
  );  const [updateProduct, { loading }] = useMcMutation<
    TSubscriptionResult,
    TCreateSubscriptionMutationVariables
  >(CreateSubscriptionMutation);

  const execute = async ({
    messages
  }: {
    messages: TSubscriptionMessageDraft[]
  }) => {
    try {
      return await updateProduct({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          key: subscriptionKey,
          projectID: projectkey,
          topic,
          messages,
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};
