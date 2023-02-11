import { Button, Card, Dialog, Heading, Paragraph, Theme, XStack, YStack } from "@jonline/ui";
import { Permission } from "@jonline/ui/src";
import { Bot, Shield, Trash } from "@tamagui/lucide-icons";
import { store, JonlineAccount, removeAccount, selectAccount, selectServer, useTypedDispatch } from "app/store";
import React from "react";
import { View } from "react-native";

interface Props {
  account: JonlineAccount;
}

const AccountCard: React.FC<Props> = ({ account }) => {
  const dispatch = useTypedDispatch();
  let selected = store.getState().accounts.account?.id == account.id;

  const primaryColorInt = account.server.serverConfiguration?.serverInfo?.colors?.primary;
  const primaryColor = `#${(primaryColorInt)?.toString(16).slice(-6) || '424242'}`;

  function doSelectAccount() {
    if (store.getState().servers.server?.host != account.server.host) {
      dispatch(selectServer(account.server));
    }
    dispatch(selectAccount(account));
  }

  function doLogout() {
    dispatch(selectAccount(undefined));
  }

  return (
    <Theme inverse={selected}>
      <Card theme="dark" elevate size="$4" bordered

        animation="bouncy"
        // w={250}
        // h={50}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        onClick={doSelectAccount}
      >
        <Card.Header>
          <XStack>
            <YStack style={{ flex: 1 }}>
              <Heading size="$1" style={{ marginRight: 'auto' }}>{account.server.host}/</Heading>
              <Heading size="$7" style={{ marginRight: 'auto' }}>{account.user.username}</Heading>
            </YStack>
            {/* {account.server.secure ? <Lock/> : <Unlock/>} */}
            {account.user.permissions.includes(Permission.ADMIN) ? <Shield /> : undefined}
            {account.user.permissions.includes(Permission.RUN_BOTS) ? <Bot /> : undefined}

          </XStack>
        </Card.Header>
        <Card.Footer>
          <XStack width='100%'>
            <YStack>
              <Heading size="$1" alignSelf="center">Account ID</Heading>
              <Paragraph size='$1' alignSelf="center">{account.user.id}</Paragraph>
            </YStack>
            <View style={{ flex: 1 }} />
            {selected ? <Button onClick={(e) => { e.stopPropagation(); doLogout(); }} marginRight='$1'>Logout</Button> : undefined}
            <Dialog>
              <Dialog.Trigger asChild>
                <Button icon={<Trash />} circular onClick={(e) => { e.stopPropagation(); }} color="red" />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay
                  key="overlay"
                  animation="quick"
                  o={0.5}
                  enterStyle={{ o: 0 }}
                  exitStyle={{ o: 0 }}
                />
                <Dialog.Content
                  bordered
                  elevate
                  key="content"
                  animation={[
                    'quick',
                    {
                      opacity: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                  enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                  exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                  x={0}
                  scale={1}
                  opacity={1}
                  y={0}
                >
                  <YStack space>
                    <Dialog.Title>Remove Account</Dialog.Title>
                    <Dialog.Description>
                      Really remove account {account.user.username} on {account.server.host}?
                    </Dialog.Description>

                    <XStack space="$3" jc="flex-end">
                      <Dialog.Close asChild>
                        <Button>Cancel</Button>
                      </Dialog.Close>
                      {/* <Dialog.Action asChild> */}
                      <Button theme="active" onClick={() => dispatch(removeAccount(account.id))}>Remove</Button>
                      {/* </Dialog.Action> */}
                    </XStack>
                  </YStack>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>
          </XStack>
        </Card.Footer>
        <Card.Background>
          <YStack h='100%' w={5} backgroundColor={primaryColor}/>
        </Card.Background>
      </Card>
    </Theme>
    // <a style={Styles.borderlessButton} onClick={() => dispatch(selectServer(server))}>
    // </a>
  );
};

export default AccountCard;
