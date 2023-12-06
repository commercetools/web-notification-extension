import { useMemo, type ReactNode, useState } from 'react';
import { useRouteMatch, Link as RouterLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Grid from '@commercetools-uikit/grid';
import { AngleRightIcon, PlusThinIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import styles from './welcome.module.css';
import { useCustomObjectFetch } from '../../hooks/use-custom-object-connector';
import {
  useSubscriptionFetch,
  useSubscriptionCreator,
} from '../../hooks/use-subscriptions-connector';
import { verifySync } from '../../utils/verifySync';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import ConfigurationTable from '../configuration-table';
import { useDataTableSortingState } from '@commercetools-uikit/hooks';
import { TFetchConfigurationItem } from '../../hooks/use-custom-object-connector/use-custom-object-connectors';
import { mergeConfigurationAndSubscriptions } from '../../utils/mergeConfigurationAndSubscriptions';

type TWrapWithProps = {
  children: ReactNode;
  condition: boolean;
  wrapper: (children: ReactNode) => ReactNode;
};
const WrapWith = (props: TWrapWithProps) => (
  <>{props.condition ? props.wrapper(props.children) : props.children}</>
);
WrapWith.displayName = 'WrapWith';

type TInfoCardProps = {
  title: string;
  content: string;
  linkTo: string;
  isExternal?: boolean;
};

const InfoCard = (props: TInfoCardProps) => (
  <Grid.Item>
    <div className={styles.infoCard}>
      <Spacings.Stack scale="m">
        <Text.Headline as="h3">
          <WrapWith
            condition={true}
            wrapper={(children) =>
              props.isExternal ? (
                <a
                  className={styles.infoCardLink}
                  href={props.linkTo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ) : (
                <RouterLink className={styles.infoCardLink} to={props.linkTo}>
                  {children}
                </RouterLink>
              )
            }
          >
            <Spacings.Inline scale="s" alignItems="center">
              <span>{props.title}</span>
              <AngleRightIcon size="big" color="primary" />
            </Spacings.Inline>
          </WrapWith>
        </Text.Headline>
        <Text.Body>{props.content}</Text.Body>
      </Spacings.Stack>
    </div>
  </Grid.Item>
);
InfoCard.displayName = 'InfoCard';

const Welcome = () => {
  const match = useRouteMatch();
  const intl = useIntl();
  const tableSorting = useDataTableSortingState({ key: 'id', order: 'asc' });
  const [selectedProducts, setSelectedProducts] = useState<
    (TFetchConfigurationItem & { [key: string]: boolean })[]
  >([]);

  const { configurations } = useCustomObjectFetch();
  const { subscription } = useSubscriptionFetch();

  const twilioConfigurationItems = useMemo(() => {
    return mergeConfigurationAndSubscriptions(configurations, subscription);
  }, [configurations, subscription]);

  return (
    <Grid>
      <Spacings.Stack scale="xl">
        <Text.Headline as="h1" intlMessage={messages.title} />
        <Spacings.Inline scale="xl" justifyContent="space-between">
          <Text.Headline as="h2" intlMessage={messages.subtitle} />
          <PrimaryButton
            iconLeft={<PlusThinIcon />}
            label={intl.formatMessage(messages.buttonLabel)}
            onClick={() => alert('Button clicked')}
            isDisabled={false}
          />
        </Spacings.Inline>
        {!!twilioConfigurationItems?.length ? (
          <Spacings.Stack scale="s" alignItems="stretch">
            <ConfigurationTable
              items={twilioConfigurationItems}
              tableSorting={tableSorting}
              onSelectedRowsChange={setSelectedProducts}
            />
          </Spacings.Stack>
        ) : (
          <ContentNotification type="warning">
            {intl.formatMessage(messages.noResults)}
          </ContentNotification>
        )}
      </Spacings.Stack>
    </Grid>
  );
};
Welcome.displayName = 'Welcome';

export default Welcome;
