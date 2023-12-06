import { TFetchConfigurationItem } from "../hooks/use-custom-object-connector/use-custom-object-connectors";
import { TSubscriptionItem } from "../hooks/use-subscriptions-connector/use-subscriptions-connectors";

export const verifySync = (configuration?: TFetchConfigurationItem[], subscriptions?: TSubscriptionItem[]): boolean => {
    if ((!configuration?.length && subscriptions?.length) || (configuration?.length && !subscriptions?.length) ||  configuration?.length !== subscriptions?.length) {
        return false
    }
    return configuration?.map(conf => conf.type.toLowerCase()).sort().join() === subscriptions?.map(sub => sub.type.toLowerCase()).sort().join()
}