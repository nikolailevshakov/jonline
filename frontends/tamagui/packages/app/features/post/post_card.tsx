import { colorMeta, loadPostReplies, loadUser, RootState, selectUserById, useCredentialDispatch, useServerTheme, useTypedSelector } from "app/store";
import React, { useEffect, useState } from "react";
import { GestureResponderEvent, Platform, View } from "react-native";

import { Group, Post } from "@jonline/api";
import { Anchor, Button, Card, Heading, Image, TamaguiMediaState, ScrollView, Spinner, Theme, useMedia, useTheme, XStack, YStack } from '@jonline/ui';
import { ChevronRight } from "@tamagui/lucide-icons";
import { useIsVisible } from 'app/hooks/use_is_visible';
import { useMediaUrl } from "app/hooks/use_media_url";
import { FacebookEmbed, InstagramEmbed, LinkedInEmbed, PinterestEmbed, TikTokEmbed, TwitterEmbed, YouTubeEmbed } from 'react-social-media-embed';
import { useLink } from "solito/link";
import { AuthorInfo } from "./author_info";
import { TamaguiMarkdown } from "./tamagui_markdown";

import { MediaRenderer } from "../media/media_renderer";
import { FadeInView } from './fade_in_view';
import { GroupPostManager } from './group_post_manager';

interface Props {
  post: Post;
  isPreview?: boolean;
  groupContext?: Group;
  replyPostIdPath?: string[];
  collapseReplies?: boolean;
  toggleCollapseReplies?: () => void;
  onLoadReplies?: () => void;
  previewParent?: Post;
  onPress?: () => void;
  onPressParentPreview?: () => void;
  selectedPostId?: string;
}

export const postBackgroundSize = (media: TamaguiMediaState) =>
  media.gtLg ? 800 : media.gtMd ? 800 : media.gtSm ? 800 : media.gtXs ? 600 : 500;

export const PostCard: React.FC<Props> = ({ post, isPreview, groupContext, replyPostIdPath, toggleCollapseReplies, onLoadReplies, collapseReplies, previewParent, onPress, onPressParentPreview, selectedPostId }) => {
  const { dispatch, accountOrServer } = useCredentialDispatch();
  const media = useMedia();

  const theme = useTheme();
  const textColor: string = theme.color?.val ?? '#000000';
  const themeBgColor = theme.background?.val ?? '#ffffff';
  const { luma: themeBgLuma } = colorMeta(themeBgColor);
  const { server, primaryColor, navAnchorColor: navColor } = useServerTheme();
  const postsStatus = useTypedSelector((state: RootState) => state.posts.status);
  // const postsBaseStatus = useTypedSelector((state: RootState) => state.posts.baseStatus);

  const ref = React.useRef() as React.MutableRefObject<HTMLElement | View>;
  const isVisible = useIsVisible(ref);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible]);

  // Call the hook passing in ref and root margin
  // In this case it would only be considered isVisible if more ...
  // ... than 300px of element is visible.
  // const isVisible = useOnScreen(ref, "-1px");
// useEffect(() => {
  //   if (isVisible) {
  //     onOnScreen?.();
  //   }
  // }, [isVisible]);

  const authorId = post.author?.userId;
  const authorName = post.author?.username;

  const postLink = post.link && post.link.startsWith('http') ? useLink({
    href: post.link,
  }) : {};
  const detailsLink = useLink({
    href: groupContext
      ? `/g/${groupContext.shortname}/p/${post.id}`
      : `/post/${post.id}`,
  });
  const authorLink = useLink({
    href: authorName
      ? `/${authorName}`
      : `/user/${authorId}`
  });
  const authorLinkProps = post.author ? authorLink : undefined;
  const showDetailsShadow = isPreview && post.content && post.content.length > 700;
  const detailsMargins = showDetailsShadow ? 20 : 0;
  const footerProps = isPreview ? {
    // ml: -detailsMargins,
    mr: -detailsMargins,
  } : {};
  const contentProps = isPreview ? {
    // ml: detailsMargins,
    // mr: 2 * detailsMargins,
  } : {};
  const detailsProps = isPreview ? showDetailsShadow ? {
    ml: -detailsMargins,
    mr: -0.5 * detailsMargins,
    pr: 0,//1 * detailsMargins - 5,
    mb: -detailsMargins,
    pb: detailsMargins,
    shadowOpacity: 0.3,
    shadowOffset: { width: -5, height: -5 },
    shadowRadius: 10
  } : {
    mr: -10,
  } : {
    // mr: -2 * detailsMargins,
  };

  const author = useTypedSelector((state: RootState) => authorId ? selectUserById(state.users, authorId) : undefined);
  const authorLoadFailed = useTypedSelector((state: RootState) => authorId ? state.users.failedUserIds.includes(authorId) : false);

  const [loadingAuthor, setLoadingAuthor] = useState(false);
  useEffect(() => {
    if (hasBeenVisible && authorId) {
      if (!loadingAuthor && !author && !authorLoadFailed) {
        setLoadingAuthor(true);
        setTimeout(() => dispatch(loadUser({ id: authorId, ...accountOrServer })), 1);
      } else if (loadingAuthor && author) {
        setLoadingAuthor(false);
      }
    }
  }, [authorId, loadingAuthor, author, authorLoadFailed]);

  // const loadingReplies = postsStatus == 'loading';
  const [loadingReplies, setLoadingReplies] = useState(false);
  useEffect(() => {
    if (loadingReplies && (post.replyCount == 0 || post.replies.length > 0 || postsStatus != 'loading')) {
      setLoadingReplies(false);
    }
  });
  function toggleReplies(e: GestureResponderEvent) {
    e.stopPropagation();
    setTimeout(() => {
      if (!loadingReplies && post.replies.length == 0) {
        setLoadingReplies(true);
        if (onLoadReplies) {
          onLoadReplies();
        }
        dispatch(loadPostReplies({ ...accountOrServer, postIdPath: replyPostIdPath! }));
      } else if (toggleCollapseReplies) {
        toggleCollapseReplies();
      }
    }, 1);
  }
  const cannotToggleReplies = !replyPostIdPath || post.replyCount == 0
    || (post.replies.length > 0 && !toggleCollapseReplies);
  const collapsed = collapseReplies || post.replies?.length == 0;

  const embedSupported = post.embedLink && post.link && post.link.length;
  let embedComponent: React.ReactNode | undefined = undefined;
  if (embedSupported) {
    const url = new URL(post.link!);
    const hostname = url.hostname.split(':')[0]!;
    if (hostname.endsWith('twitter.com')) {
      embedComponent = <TwitterEmbed url={post.link!} />;
    } else if (hostname.endsWith('instagram.com')) {
      embedComponent = <InstagramEmbed url={post.link!} />;
    } else if (hostname.endsWith('facebook.com')) {
      embedComponent = <FacebookEmbed url={post.link!} />;
    } else if (hostname.endsWith('youtube.com')) {
      embedComponent = <YouTubeEmbed url={post.link!} />;
    } else if (hostname.endsWith('tiktok.com')) {
      embedComponent = <TikTokEmbed url={post.link!} />;
    } else if (hostname.endsWith('pinterest.com')) {
      embedComponent = <PinterestEmbed url={post.link!} />;
    } else if (hostname.endsWith('linkedin.com')) {
      embedComponent = <LinkedInEmbed url={post.link!} />;
    }
  }

  const generatedPreview = post?.media?.find(m => m.contentType.startsWith('image') && m.generated);
  const hasGeneratedPreview = generatedPreview && post?.media?.length == 1 && !embedComponent;

  const scrollableMediaMinCount = isPreview && hasGeneratedPreview ? 3 : 2;
  const showScrollableMediaPreviews = (post?.media?.length ?? 0) >= scrollableMediaMinCount;
  const singleMediaPreview = showScrollableMediaPreviews
    ? undefined
    : post?.media?.find(m => m.contentType.startsWith('image') && (!m.generated /*|| !isPreview*/));
  const previewUrl = useMediaUrl(hasGeneratedPreview ? generatedPreview?.id : undefined);

  const showBackgroundPreview = hasGeneratedPreview;// hasBeenVisible && isPreview && hasPrimaryImage && previewUrl;
  const backgroundSize = postBackgroundSize(media);
  const foregroundSize = backgroundSize * 0.7;

  return (
    <>
      <YStack w='100%' ref={ref!} key={`post-card-${post.id}-${isPreview ? '-preview' : ''}`}>
        {previewParent && post.replyToPostId
          ? <XStack w='100%'>
            {media.gtXs ? <Heading size='$5' ml='$3' mr='$0' marginVertical='auto' ta='center'>RE</Heading> : undefined}
            <XStack marginVertical='auto' marginHorizontal='$1'><ChevronRight /></XStack>

            <Theme inverse={selectedPostId == previewParent.id}>
              <Card f={1} theme="dark" elevate size="$1" bordered
                margin='$0'
                // marginBottom={replyPostIdPath ? '$0' : '$3'}
                // marginTop={replyPostIdPath ? '$0' : '$3'}
                // padding='$2'
                px='$2'
                py='$1'
                mb='$1'
                // f={isPreview ? undefined : 1}
                animation='standard'
                scale={0.92}
                opacity={1}
                y={0}
                // enterStyle={{ y: -50, opacity: 0, }}
                // exitStyle={{ opacity: 0, }}
                pressStyle={{ scale: 0.91 }}
                onPress={onPressParentPreview}
              >
                <Card.Footer>
                  <YStack w='100%'>
                    <XStack mah={200} w='100%'>
                      <TamaguiMarkdown text={previewParent.content} />
                    </XStack>

                    <XStack ml='$2'>
                      <AuthorInfo post={previewParent!} disableLink={false} isVisible={isVisible} />
                    </XStack>
                  </YStack>
                </Card.Footer>
              </Card>
            </Theme>
          </XStack>
          : undefined}
        <Theme inverse={selectedPostId == post.id}>
          <Card theme="dark" elevate size="$4" bordered
            margin='$0'
            marginBottom={replyPostIdPath ? '$0' : '$3'}
            marginTop={replyPostIdPath ? '$0' : '$3'}
            f={isPreview ? undefined : 1}
            animation='standard'
            pressStyle={previewUrl || post.replyToPostId ? { scale: 0.990 } : {}}
            scale={1}
            opacity={1}
            // w='100%'
            y={0}
          // enterStyle={{ y: -50, opacity: 0, }}
          // exitStyle={{ opacity: 0, }}
          // {...postLinkProps}
          >
            {!post.replyToPostId && (post.link != '' || post.title != '')
              ? <Card.Header>
                <Anchor textDecorationLine='none' {...{ ...(isPreview ? detailsLink : {}), ...postLink, }}>
                  <YStack w='100%'>
                    <Heading size="$7" marginRight='auto' color={post.link && post.link.startsWith('http') ? navColor : undefined}>{post.title && post.title != '' ? post.title : `Untitled Post ${post.id}`}</Heading>
                  </YStack>
                </Anchor>
              </Card.Header>
              : undefined}
            <Card.Footer p='$3' pr={media.gtXs ? '$3' : '$1'} >
              <YStack zi={1000} width='100%' {...footerProps}>
                {hasBeenVisible && embedComponent && false
                  ? <FadeInView><div>{embedComponent}</div></FadeInView>
                  : embedComponent
                    ? <Spinner color={primaryColor} />
                    : undefined}
                {showScrollableMediaPreviews ?
                  <XStack w='100%' maw={800}>
                    <ScrollView horizontal w={isPreview ? '260px' : '100%'}
                      h={media.gtXs ? '400px' : '260px'} >
                      <XStack space='$2'>
                        {post.media.map((mediaRef, i) => <YStack key={mediaRef.id} w={media.gtXs ? '400px' : '260px'} h='100%'>
                          <MediaRenderer media={mediaRef} />
                        </YStack>)}
                      </XStack>
                    </ScrollView>
                  </XStack> : undefined}

                <Anchor textDecorationLine='none' {...{ ...(isPreview ? detailsLink : {}) }}>
                  <YStack maxHeight={isPreview ? 300 : undefined} overflow='hidden' {...contentProps}>
                    {singleMediaPreview
                      // (!isPreview && previewUrl && previewUrl != '' && hasGeneratedPreview) 
                      ? <Image
                        mb='$3'
                        width={foregroundSize}
                        height={foregroundSize}
                        resizeMode="contain"
                        als="center"
                        source={{ uri: previewUrl, height: foregroundSize, width: foregroundSize }}
                        borderRadius={10}
                      /> : undefined}
                    {
                      post.content && post.content != '' ? Platform.select({
                        default: <TamaguiMarkdown text={post.content} disableLinks={isPreview} />,
                        // default: post.content ? <NativeMarkdownShim>{cleanedContent}</NativeMarkdownShim> : undefined
                        // default: <Heading size='$1'>Native Markdown support pending!</Heading>
                      }) : undefined
                    }
                  </YStack>
                </Anchor>
                {post?.replyToPostId
                  ? undefined
                  : <XStack pt={10} ml='auto' px='$2' maw='100%'>
                    <GroupPostManager post={post} isVisible={isVisible} />
                  </XStack>}

                <XStack pt={post?.replyToPostId
                  ? 10
                  : undefined} {...detailsProps}>
                  <AuthorInfo {...{ post, detailsMargins, isVisible }} />
                  <Anchor textDecorationLine='none' {...{ ...(isPreview ? detailsLink : {}) }}>
                    <YStack h='100%' mr='$3'>
                      <Button opacity={isPreview ? 1 : 0.9} transparent={isPreview || !post?.replyToPostId || post.replyCount == 0}
                        borderColor={isPreview || cannotToggleReplies ? 'transparent' : undefined}
                        disabled={cannotToggleReplies || loadingReplies}
                        marginVertical='auto'
                        mr={media.gtXs || isPreview ? 0 : -10}
                        onPress={toggleReplies} paddingRight={cannotToggleReplies || isPreview ? '$2' : '$0'} paddingLeft='$2'>
                        <XStack opacity={0.9}>
                          <YStack marginVertical='auto'>
                            {!post.replyToPostId ? <Heading size="$1" ta='right'>
                              {post.responseCount} comment{post.responseCount == 1 ? '' : 's'}
                            </Heading> : undefined}
                            {(post.replyToPostId) && (post.responseCount != post.replyCount) ? <Heading size="$1" ta='right'>
                              {post.responseCount} response{post.responseCount == 1 ? '' : 's'}
                            </Heading> : undefined}
                            {isPreview || post.replyCount == 0 ? undefined : <Heading size="$1" ta='right'>
                              {post.replyCount} repl{post.replyCount == 1 ? 'y' : 'ies'}
                            </Heading>}
                          </YStack>
                          {!cannotToggleReplies ? <XStack marginVertical='auto'
                            animation='quick'
                            rotate={collapsed ? '0deg' : '90deg'}
                          >
                            <ChevronRight opacity={loadingReplies ? 0.5 : 1} />
                          </XStack> : undefined}
                        </XStack>
                      </Button>
                    </YStack>
                  </Anchor>
                </XStack>
              </YStack>
            </Card.Footer>
            <Card.Background>
              {(showBackgroundPreview) ?
                <FadeInView>
                  <Image
                    pos="absolute"
                    width={backgroundSize}
                    opacity={0.15}
                    height={backgroundSize}
                    resizeMode="cover"
                    als="flex-start"
                    source={{ uri: previewUrl!, height: backgroundSize, width: backgroundSize }}
                    blurRadius={1.5}
                    // borderRadius={5}
                    borderBottomRightRadius={5}
                  />
                </FadeInView>
                : undefined}
            </Card.Background>
          </Card >
        </Theme>
      </YStack>
    </>
  );
};

export default PostCard;
