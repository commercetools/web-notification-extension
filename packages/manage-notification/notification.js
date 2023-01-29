const findConversation = async (client, identity) => {
  console.log("getting conv");
  try {
    const conversation = await client.getConversationByUniqueName(identity);
    return conversation;
  } catch {
    return null;
  }
};

const createConversation = async (client, identity) => {
  return client.createConversation({
    attributes: {},
    friendlyName: `Notifications to ${identity}`,
    uniqueName: identity,
  });
};

const sendNotification = async (clientPromise, message, identity) => {
  if (!clientPromise) {
    console.log("No client");
    return;
  }
  const client = await clientPromise;

  let conversation = await findConversation(client, identity);
  if (!conversation) {
    console.log("no conversation found");
    conversation = await createConversation(client, identity);
    // console.log("new conversation", conversation);
    await conversation.add(identity);
    console.log("added customer");
    await conversation.join();
    console.log("joined my self");
  }
  console.log("sending message");
  await conversation.sendMessage(message.body, { subject: message.subject });
};
exports.sendNotification = sendNotification;
