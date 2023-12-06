import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchCustomObjectsQuery from './fetch-custom-objects.ctp.graphql';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

export type TFetchConfigurationItem = {
  id: string;
  type: string;
  subject: string;
  useCustomIdentity?: boolean;
  customIdentity?: string;
  body: string;
  predicate?: string;
};

type TFetchConfigurationResult = {
  customObject?: {
    value?: TFetchConfigurationItem[];
  };
};

type TUseCustomObjectFetcher = () => {
  configurations?: TFetchConfigurationItem[];
  error?: ApolloError;
  loading: boolean;
};

export const useCustomObjectFetch: TUseCustomObjectFetcher = () => {
  // @ts-ignore
  const { customObjectKey, customObjectContainer } = useApplicationContext(
    (context) => context.environment
  );
  const { data, error, loading } = useMcQuery<TFetchConfigurationResult>(
    FetchCustomObjectsQuery,
    {
      variables: {
        container: customObjectContainer,
        key: customObjectKey,
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );

  return {
    configurations: data?.customObject?.value,
    error,
    loading,
  };
};
