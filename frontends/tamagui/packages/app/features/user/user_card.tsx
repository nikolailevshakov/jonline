import { Button, Card, Dialog, Heading, Theme, XStack, Image, YStack, User, useMedia } from "@jonline/ui";
import { Input, Permission } from "@jonline/ui/src";
import { Bot, Camera, Info, Lock, Shield, Trash, Unlock } from "@tamagui/lucide-icons";
import { store, removeAccount, removeUser, RootState, selectAccount, selectAllAccounts, useTypedDispatch, useTypedSelector, useCredentialDispatch, loadUser } from "app/store";
import React, { useState, useEffect } from "react";
import { useLink } from "solito/link";
import { FadeInView } from "../post/post_card";

interface Props {
  user: User;
  isPreview?: boolean;
}

const UserCard: React.FC<Props> = ({ user, isPreview = false }) => {
  const { dispatch, accountOrServer } = useCredentialDispatch();
  const media = useMedia();

  const isCurrentUser = accountOrServer.account && accountOrServer.account?.user?.id == user.id;
  const server = useTypedSelector((state: RootState) => state.servers.server);
  const primaryColorInt = server?.serverConfiguration?.serverInfo?.colors?.primary;
  const primaryColor = `#${(primaryColorInt)?.toString(16).slice(-6) || '424242'}`;
  const navColorInt = server?.serverConfiguration?.serverInfo?.colors?.navigation;
  const navColor = `#${(navColorInt)?.toString(16).slice(-6) || 'FFFFFF'}`;
  const avatar = useTypedSelector((state: RootState) => state.users.avatars[user.id]);
  const [loadingAvatar, setLoadingAvatar] = React.useState(false);

  useEffect(() => {
    if (!loadingAvatar) {
      if (avatar == undefined) {
        setLoadingAvatar(true);
        setTimeout(() => dispatch(loadUser({ id: user.id, ...accountOrServer })), 1);
      } else if (avatar != undefined) {
        setLoadingAvatar(false);
      }
    }
  });

  return (
    <Theme inverse={isCurrentUser}>
      <Card theme="dark" elevate size="$4" bordered
        animation="bouncy"
        scale={0.9}
        width={isPreview ? 260 : '100%'}
        // width={400}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}>
        <Card.Header>
          <XStack>
            <YStack f={1}>
              <Heading size="$1" style={{ marginRight: 'auto' }}>{server?.host}/</Heading>

              {/* <Heading marginRight='auto' whiteSpace="nowrap" opacity={true ? 1 : 0.5}>{user.userConfiguration?.userInfo?.name || 'Unnamed'}</Heading> */}
              <Heading size="$7" marginRight='auto'>{user.username}</Heading>
            </YStack>

            {user.permissions.includes(Permission.ADMIN) ? <Shield /> : undefined}
            {user.permissions.includes(Permission.RUN_BOTS) ? <Bot /> : undefined}

            {/* {isPreview ? <Button onPress={(e) => { e.stopPropagation(); infoLink.onPress(e); }} icon={<Info />} circular /> : undefined} */}
          </XStack>
        </Card.Header>
        <Card.Footer>
          <XStack width='100%'>
            <YStack mt='$2' mr='$3' f={1}>
              {(!isPreview && avatar && avatar != '') ?
                <Image
                  // pos="absolute"
                  // width={400}
                  // opacity={0.25}
                  // height={400}
                  // minWidth={300}
                  // minHeight={300}
                  // width='100%'
                  // height='100%'
                  mb='$3'
                  width={media.sm ? 300 : 400}
                  height={media.sm ? 300 : 400}
                  resizeMode="contain"
                  als="center"
                  src={avatar}
                  borderRadius={10}
                // borderBottomRightRadius={5}
                /> : undefined}
              <XStack>
                <Heading size='$1'>{user.id}</Heading>
                <XStack f={1} />
                {isCurrentUser ? <Camera /> : undefined}
              </XStack>
            </YStack>
          </XStack>
        </Card.Footer>
        <Card.Background>
          {/* <XStack>
            <YStack h='100%' w={5} backgroundColor={primaryColor} /> */}
          {(isPreview && avatar && avatar != '') ?
            <FadeInView>
              <Image
                pos="absolute"
                width={300}
                opacity={0.25}
                height={300}
                resizeMode="contain"
                als="flex-start"
                src={avatar}
                blurRadius={1.5}
                // borderRadius={5}
                borderBottomRightRadius={5}
              />
            </FadeInView> : undefined}
          {/* </XStack> */}
        </Card.Background>
      </Card>
    </Theme>
  );
};

export default UserCard;
