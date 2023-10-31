# Send notification to Twilio
This app is designed to subscribe to events from commercetools and send a notification to the end user via Twilio

## Getting started

What you'll need to get started:

- A Twilio access token generator
- API crendentials to a [commercetools instance](https://docs.commercetools.com/getting-started/create-api-client)
- A customer username/password to send notifications on behalf of BE

### Twilio access token generator
Deploy and run [twilio-access-token-generator](../access-token/README.md) to GCP and store function's URL to `ACCESS_TOKEN_SERVICE_URL` in .env.yaml file

### API crendentials
Store your API credentials in the .env file

### Notifier username/password
Store customer's username and password in `CTP_NOTIFIER_USERNAME` and `CTP_NOTIFIER_PASSWORD`

## Configure the app to send notifications
Populate the constant `SUPPORTED_MESSAGE_TYPES` in index.js. The schema for this constant is 
```js
SUPPORTED_MESSAGE_TYPES = {
  ['message-type-name']: {
    identityExtractor: () => string,
    getNotificationBody: () => string,
    getNotificationSubject: () => string,
    predicate?: () => boolean
  },
  ...
}
```
- message-type-name is drived from the [commercetools docs](https://docs.commercetools.com/api/projects/messages)
- identityExtractor is a method to extract identity (email address) of the recipient.
- getNotificationBody is a method to build the notification message
- predicate is a method to check if the process should continue or not based on the predicate

## Setup

### Install dependencies:
Run `yarn`
### Deploy
Run `yarn deploy`