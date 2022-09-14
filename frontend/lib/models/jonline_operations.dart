import 'package:jonline/app_state.dart';
import 'package:jonline/generated/posts.pb.dart';
import 'package:jonline/models/jonline_account.dart';

import 'jonline_clients.dart';
import 'server_errors.dart';

// Extension/static class for methods that operate
// regardless of whether a JonlineAccount is selected,
// or the user is browsing anonymously on a server.
extension JonlineOperations on JonlineAccount {
  static Future<Posts?> getSelectedPosts(
      {GetPostsRequest? request,
      Function(String)? showMessage,
      bool forReplies = false}) async {
    final client = await JonlineClients.getSelectedOrDefaultClient(
        showMessage: showMessage);
    if (client == null) {
      showMessage?.call("Error: No client");
      return null;
    }
    // showMessage?.call("Loading posts...");
    final Posts posts;
    try {
      posts = await client.getPosts(GetPostsRequest(),
          options: JonlineAccount.selectedAccount?.authenticatedCallOptions);
    } catch (e) {
      showMessage?.call('Error loading ${forReplies ? "replies" : "posts"}.');
      if (showMessage != null) await communicationDelay;
      showMessage?.call(formatServerError(e));
      return null;
    }
    return posts;
  }
}
