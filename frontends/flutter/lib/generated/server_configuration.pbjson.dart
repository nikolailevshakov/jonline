//
//  Generated code. Do not modify.
//  source: server_configuration.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

@$core.Deprecated('Use authenticationFeatureDescriptor instead')
const AuthenticationFeature$json = {
  '1': 'AuthenticationFeature',
  '2': [
    {'1': 'AUTHENTICATION_FEATURE_UNKNOWN', '2': 0},
    {'1': 'CREATE_ACCOUNT', '2': 1},
    {'1': 'LOGIN', '2': 2},
  ],
};

/// Descriptor for `AuthenticationFeature`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List authenticationFeatureDescriptor = $convert.base64Decode(
    'ChVBdXRoZW50aWNhdGlvbkZlYXR1cmUSIgoeQVVUSEVOVElDQVRJT05fRkVBVFVSRV9VTktOT1'
    'dOEAASEgoOQ1JFQVRFX0FDQ09VTlQQARIJCgVMT0dJThAC');

@$core.Deprecated('Use privateUserStrategyDescriptor instead')
const PrivateUserStrategy$json = {
  '1': 'PrivateUserStrategy',
  '2': [
    {'1': 'ACCOUNT_IS_FROZEN', '2': 0},
    {'1': 'LIMITED_CREEPINESS', '2': 1},
    {'1': 'LET_ME_CREEP_ON_PPL', '2': 2},
  ],
};

/// Descriptor for `PrivateUserStrategy`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List privateUserStrategyDescriptor = $convert.base64Decode(
    'ChNQcml2YXRlVXNlclN0cmF0ZWd5EhUKEUFDQ09VTlRfSVNfRlJPWkVOEAASFgoSTElNSVRFRF'
    '9DUkVFUElORVNTEAESFwoTTEVUX01FX0NSRUVQX09OX1BQTBAC');

@$core.Deprecated('Use webUserInterfaceDescriptor instead')
const WebUserInterface$json = {
  '1': 'WebUserInterface',
  '2': [
    {'1': 'FLUTTER_WEB', '2': 0},
    {
      '1': 'HANDLEBARS_TEMPLATES',
      '2': 1,
      '3': {'1': true},
    },
    {'1': 'REACT_TAMAGUI', '2': 2},
  ],
};

/// Descriptor for `WebUserInterface`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List webUserInterfaceDescriptor = $convert.base64Decode(
    'ChBXZWJVc2VySW50ZXJmYWNlEg8KC0ZMVVRURVJfV0VCEAASHAoUSEFORExFQkFSU19URU1QTE'
    'FURVMQARoCCAESEQoNUkVBQ1RfVEFNQUdVSRAC');

@$core.Deprecated('Use serverConfigurationDescriptor instead')
const ServerConfiguration$json = {
  '1': 'ServerConfiguration',
  '2': [
    {'1': 'server_info', '3': 1, '4': 1, '5': 11, '6': '.jonline.ServerInfo', '9': 0, '10': 'serverInfo', '17': true},
    {'1': 'anonymous_user_permissions', '3': 10, '4': 3, '5': 14, '6': '.jonline.Permission', '10': 'anonymousUserPermissions'},
    {'1': 'default_user_permissions', '3': 11, '4': 3, '5': 14, '6': '.jonline.Permission', '10': 'defaultUserPermissions'},
    {'1': 'basic_user_permissions', '3': 12, '4': 3, '5': 14, '6': '.jonline.Permission', '10': 'basicUserPermissions'},
    {'1': 'people_settings', '3': 20, '4': 1, '5': 11, '6': '.jonline.FeatureSettings', '10': 'peopleSettings'},
    {'1': 'group_settings', '3': 21, '4': 1, '5': 11, '6': '.jonline.FeatureSettings', '10': 'groupSettings'},
    {'1': 'post_settings', '3': 22, '4': 1, '5': 11, '6': '.jonline.PostSettings', '10': 'postSettings'},
    {'1': 'event_settings', '3': 23, '4': 1, '5': 11, '6': '.jonline.FeatureSettings', '10': 'eventSettings'},
    {'1': 'media_settings', '3': 24, '4': 1, '5': 11, '6': '.jonline.FeatureSettings', '10': 'mediaSettings'},
    {'1': 'external_cdn_config', '3': 90, '4': 1, '5': 11, '6': '.jonline.ExternalCDNConfig', '9': 1, '10': 'externalCdnConfig', '17': true},
    {'1': 'private_user_strategy', '3': 100, '4': 1, '5': 14, '6': '.jonline.PrivateUserStrategy', '10': 'privateUserStrategy'},
    {'1': 'authentication_features', '3': 101, '4': 3, '5': 14, '6': '.jonline.AuthenticationFeature', '10': 'authenticationFeatures'},
  ],
  '8': [
    {'1': '_server_info'},
    {'1': '_external_cdn_config'},
  ],
};

/// Descriptor for `ServerConfiguration`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List serverConfigurationDescriptor = $convert.base64Decode(
    'ChNTZXJ2ZXJDb25maWd1cmF0aW9uEjkKC3NlcnZlcl9pbmZvGAEgASgLMhMuam9ubGluZS5TZX'
    'J2ZXJJbmZvSABSCnNlcnZlckluZm+IAQESUQoaYW5vbnltb3VzX3VzZXJfcGVybWlzc2lvbnMY'
    'CiADKA4yEy5qb25saW5lLlBlcm1pc3Npb25SGGFub255bW91c1VzZXJQZXJtaXNzaW9ucxJNCh'
    'hkZWZhdWx0X3VzZXJfcGVybWlzc2lvbnMYCyADKA4yEy5qb25saW5lLlBlcm1pc3Npb25SFmRl'
    'ZmF1bHRVc2VyUGVybWlzc2lvbnMSSQoWYmFzaWNfdXNlcl9wZXJtaXNzaW9ucxgMIAMoDjITLm'
    'pvbmxpbmUuUGVybWlzc2lvblIUYmFzaWNVc2VyUGVybWlzc2lvbnMSQQoPcGVvcGxlX3NldHRp'
    'bmdzGBQgASgLMhguam9ubGluZS5GZWF0dXJlU2V0dGluZ3NSDnBlb3BsZVNldHRpbmdzEj8KDm'
    'dyb3VwX3NldHRpbmdzGBUgASgLMhguam9ubGluZS5GZWF0dXJlU2V0dGluZ3NSDWdyb3VwU2V0'
    'dGluZ3MSOgoNcG9zdF9zZXR0aW5ncxgWIAEoCzIVLmpvbmxpbmUuUG9zdFNldHRpbmdzUgxwb3'
    'N0U2V0dGluZ3MSPwoOZXZlbnRfc2V0dGluZ3MYFyABKAsyGC5qb25saW5lLkZlYXR1cmVTZXR0'
    'aW5nc1INZXZlbnRTZXR0aW5ncxI/Cg5tZWRpYV9zZXR0aW5ncxgYIAEoCzIYLmpvbmxpbmUuRm'
    'VhdHVyZVNldHRpbmdzUg1tZWRpYVNldHRpbmdzEk8KE2V4dGVybmFsX2Nkbl9jb25maWcYWiAB'
    'KAsyGi5qb25saW5lLkV4dGVybmFsQ0ROQ29uZmlnSAFSEWV4dGVybmFsQ2RuQ29uZmlniAEBEl'
    'AKFXByaXZhdGVfdXNlcl9zdHJhdGVneRhkIAEoDjIcLmpvbmxpbmUuUHJpdmF0ZVVzZXJTdHJh'
    'dGVneVITcHJpdmF0ZVVzZXJTdHJhdGVneRJXChdhdXRoZW50aWNhdGlvbl9mZWF0dXJlcxhlIA'
    'MoDjIeLmpvbmxpbmUuQXV0aGVudGljYXRpb25GZWF0dXJlUhZhdXRoZW50aWNhdGlvbkZlYXR1'
    'cmVzQg4KDF9zZXJ2ZXJfaW5mb0IWChRfZXh0ZXJuYWxfY2RuX2NvbmZpZw==');

@$core.Deprecated('Use externalCDNConfigDescriptor instead')
const ExternalCDNConfig$json = {
  '1': 'ExternalCDNConfig',
  '2': [
    {'1': 'frontend_host', '3': 1, '4': 1, '5': 9, '10': 'frontendHost'},
    {'1': 'backend_host', '3': 2, '4': 1, '5': 9, '10': 'backendHost'},
    {'1': 'secure_media', '3': 3, '4': 1, '5': 8, '10': 'secureMedia'},
    {'1': 'media_ipv4_allowlist', '3': 4, '4': 1, '5': 9, '9': 0, '10': 'mediaIpv4Allowlist', '17': true},
    {'1': 'media_ipv6_allowlist', '3': 5, '4': 1, '5': 9, '9': 1, '10': 'mediaIpv6Allowlist', '17': true},
    {'1': 'cdn_grpc', '3': 6, '4': 1, '5': 8, '10': 'cdnGrpc'},
  ],
  '8': [
    {'1': '_media_ipv4_allowlist'},
    {'1': '_media_ipv6_allowlist'},
  ],
};

/// Descriptor for `ExternalCDNConfig`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List externalCDNConfigDescriptor = $convert.base64Decode(
    'ChFFeHRlcm5hbENETkNvbmZpZxIjCg1mcm9udGVuZF9ob3N0GAEgASgJUgxmcm9udGVuZEhvc3'
    'QSIQoMYmFja2VuZF9ob3N0GAIgASgJUgtiYWNrZW5kSG9zdBIhCgxzZWN1cmVfbWVkaWEYAyAB'
    'KAhSC3NlY3VyZU1lZGlhEjUKFG1lZGlhX2lwdjRfYWxsb3dsaXN0GAQgASgJSABSEm1lZGlhSX'
    'B2NEFsbG93bGlzdIgBARI1ChRtZWRpYV9pcHY2X2FsbG93bGlzdBgFIAEoCUgBUhJtZWRpYUlw'
    'djZBbGxvd2xpc3SIAQESGQoIY2RuX2dycGMYBiABKAhSB2NkbkdycGNCFwoVX21lZGlhX2lwdj'
    'RfYWxsb3dsaXN0QhcKFV9tZWRpYV9pcHY2X2FsbG93bGlzdA==');

@$core.Deprecated('Use featureSettingsDescriptor instead')
const FeatureSettings$json = {
  '1': 'FeatureSettings',
  '2': [
    {'1': 'visible', '3': 1, '4': 1, '5': 8, '10': 'visible'},
    {'1': 'default_moderation', '3': 2, '4': 1, '5': 14, '6': '.jonline.Moderation', '10': 'defaultModeration'},
    {'1': 'default_visibility', '3': 3, '4': 1, '5': 14, '6': '.jonline.Visibility', '10': 'defaultVisibility'},
    {'1': 'custom_title', '3': 4, '4': 1, '5': 9, '9': 0, '10': 'customTitle', '17': true},
  ],
  '8': [
    {'1': '_custom_title'},
  ],
};

/// Descriptor for `FeatureSettings`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List featureSettingsDescriptor = $convert.base64Decode(
    'Cg9GZWF0dXJlU2V0dGluZ3MSGAoHdmlzaWJsZRgBIAEoCFIHdmlzaWJsZRJCChJkZWZhdWx0X2'
    '1vZGVyYXRpb24YAiABKA4yEy5qb25saW5lLk1vZGVyYXRpb25SEWRlZmF1bHRNb2RlcmF0aW9u'
    'EkIKEmRlZmF1bHRfdmlzaWJpbGl0eRgDIAEoDjITLmpvbmxpbmUuVmlzaWJpbGl0eVIRZGVmYX'
    'VsdFZpc2liaWxpdHkSJgoMY3VzdG9tX3RpdGxlGAQgASgJSABSC2N1c3RvbVRpdGxliAEBQg8K'
    'DV9jdXN0b21fdGl0bGU=');

@$core.Deprecated('Use postSettingsDescriptor instead')
const PostSettings$json = {
  '1': 'PostSettings',
  '2': [
    {'1': 'visible', '3': 1, '4': 1, '5': 8, '10': 'visible'},
    {'1': 'default_moderation', '3': 2, '4': 1, '5': 14, '6': '.jonline.Moderation', '10': 'defaultModeration'},
    {'1': 'default_visibility', '3': 3, '4': 1, '5': 14, '6': '.jonline.Visibility', '10': 'defaultVisibility'},
    {'1': 'custom_title', '3': 4, '4': 1, '5': 9, '9': 0, '10': 'customTitle', '17': true},
    {'1': 'enable_replies', '3': 5, '4': 1, '5': 8, '10': 'enableReplies'},
  ],
  '8': [
    {'1': '_custom_title'},
  ],
};

/// Descriptor for `PostSettings`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List postSettingsDescriptor = $convert.base64Decode(
    'CgxQb3N0U2V0dGluZ3MSGAoHdmlzaWJsZRgBIAEoCFIHdmlzaWJsZRJCChJkZWZhdWx0X21vZG'
    'VyYXRpb24YAiABKA4yEy5qb25saW5lLk1vZGVyYXRpb25SEWRlZmF1bHRNb2RlcmF0aW9uEkIK'
    'EmRlZmF1bHRfdmlzaWJpbGl0eRgDIAEoDjITLmpvbmxpbmUuVmlzaWJpbGl0eVIRZGVmYXVsdF'
    'Zpc2liaWxpdHkSJgoMY3VzdG9tX3RpdGxlGAQgASgJSABSC2N1c3RvbVRpdGxliAEBEiUKDmVu'
    'YWJsZV9yZXBsaWVzGAUgASgIUg1lbmFibGVSZXBsaWVzQg8KDV9jdXN0b21fdGl0bGU=');

@$core.Deprecated('Use serverInfoDescriptor instead')
const ServerInfo$json = {
  '1': 'ServerInfo',
  '2': [
    {'1': 'name', '3': 1, '4': 1, '5': 9, '9': 0, '10': 'name', '17': true},
    {'1': 'short_name', '3': 2, '4': 1, '5': 9, '9': 1, '10': 'shortName', '17': true},
    {'1': 'description', '3': 3, '4': 1, '5': 9, '9': 2, '10': 'description', '17': true},
    {'1': 'privacy_policy', '3': 4, '4': 1, '5': 9, '9': 3, '10': 'privacyPolicy', '17': true},
    {'1': 'logo', '3': 5, '4': 1, '5': 11, '6': '.jonline.ServerLogo', '9': 4, '10': 'logo', '17': true},
    {'1': 'web_user_interface', '3': 6, '4': 1, '5': 14, '6': '.jonline.WebUserInterface', '9': 5, '10': 'webUserInterface', '17': true},
    {'1': 'colors', '3': 7, '4': 1, '5': 11, '6': '.jonline.ServerColors', '9': 6, '10': 'colors', '17': true},
  ],
  '8': [
    {'1': '_name'},
    {'1': '_short_name'},
    {'1': '_description'},
    {'1': '_privacy_policy'},
    {'1': '_logo'},
    {'1': '_web_user_interface'},
    {'1': '_colors'},
  ],
};

/// Descriptor for `ServerInfo`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List serverInfoDescriptor = $convert.base64Decode(
    'CgpTZXJ2ZXJJbmZvEhcKBG5hbWUYASABKAlIAFIEbmFtZYgBARIiCgpzaG9ydF9uYW1lGAIgAS'
    'gJSAFSCXNob3J0TmFtZYgBARIlCgtkZXNjcmlwdGlvbhgDIAEoCUgCUgtkZXNjcmlwdGlvbogB'
    'ARIqCg5wcml2YWN5X3BvbGljeRgEIAEoCUgDUg1wcml2YWN5UG9saWN5iAEBEiwKBGxvZ28YBS'
    'ABKAsyEy5qb25saW5lLlNlcnZlckxvZ29IBFIEbG9nb4gBARJMChJ3ZWJfdXNlcl9pbnRlcmZh'
    'Y2UYBiABKA4yGS5qb25saW5lLldlYlVzZXJJbnRlcmZhY2VIBVIQd2ViVXNlckludGVyZmFjZY'
    'gBARIyCgZjb2xvcnMYByABKAsyFS5qb25saW5lLlNlcnZlckNvbG9yc0gGUgZjb2xvcnOIAQFC'
    'BwoFX25hbWVCDQoLX3Nob3J0X25hbWVCDgoMX2Rlc2NyaXB0aW9uQhEKD19wcml2YWN5X3BvbG'
    'ljeUIHCgVfbG9nb0IVChNfd2ViX3VzZXJfaW50ZXJmYWNlQgkKB19jb2xvcnM=');

@$core.Deprecated('Use serverLogoDescriptor instead')
const ServerLogo$json = {
  '1': 'ServerLogo',
  '2': [
    {'1': 'squareMediaId', '3': 1, '4': 1, '5': 9, '9': 0, '10': 'squareMediaId', '17': true},
    {'1': 'squareMediaIdDark', '3': 2, '4': 1, '5': 9, '9': 1, '10': 'squareMediaIdDark', '17': true},
    {'1': 'wideMediaId', '3': 3, '4': 1, '5': 9, '9': 2, '10': 'wideMediaId', '17': true},
    {'1': 'wideMediaIdDark', '3': 4, '4': 1, '5': 9, '9': 3, '10': 'wideMediaIdDark', '17': true},
  ],
  '8': [
    {'1': '_squareMediaId'},
    {'1': '_squareMediaIdDark'},
    {'1': '_wideMediaId'},
    {'1': '_wideMediaIdDark'},
  ],
};

/// Descriptor for `ServerLogo`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List serverLogoDescriptor = $convert.base64Decode(
    'CgpTZXJ2ZXJMb2dvEikKDXNxdWFyZU1lZGlhSWQYASABKAlIAFINc3F1YXJlTWVkaWFJZIgBAR'
    'IxChFzcXVhcmVNZWRpYUlkRGFyaxgCIAEoCUgBUhFzcXVhcmVNZWRpYUlkRGFya4gBARIlCgt3'
    'aWRlTWVkaWFJZBgDIAEoCUgCUgt3aWRlTWVkaWFJZIgBARItCg93aWRlTWVkaWFJZERhcmsYBC'
    'ABKAlIA1IPd2lkZU1lZGlhSWREYXJriAEBQhAKDl9zcXVhcmVNZWRpYUlkQhQKEl9zcXVhcmVN'
    'ZWRpYUlkRGFya0IOCgxfd2lkZU1lZGlhSWRCEgoQX3dpZGVNZWRpYUlkRGFyaw==');

@$core.Deprecated('Use serverColorsDescriptor instead')
const ServerColors$json = {
  '1': 'ServerColors',
  '2': [
    {'1': 'primary', '3': 1, '4': 1, '5': 13, '9': 0, '10': 'primary', '17': true},
    {'1': 'navigation', '3': 2, '4': 1, '5': 13, '9': 1, '10': 'navigation', '17': true},
    {'1': 'author', '3': 3, '4': 1, '5': 13, '9': 2, '10': 'author', '17': true},
    {'1': 'admin', '3': 4, '4': 1, '5': 13, '9': 3, '10': 'admin', '17': true},
    {'1': 'moderator', '3': 5, '4': 1, '5': 13, '9': 4, '10': 'moderator', '17': true},
  ],
  '8': [
    {'1': '_primary'},
    {'1': '_navigation'},
    {'1': '_author'},
    {'1': '_admin'},
    {'1': '_moderator'},
  ],
};

/// Descriptor for `ServerColors`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List serverColorsDescriptor = $convert.base64Decode(
    'CgxTZXJ2ZXJDb2xvcnMSHQoHcHJpbWFyeRgBIAEoDUgAUgdwcmltYXJ5iAEBEiMKCm5hdmlnYX'
    'Rpb24YAiABKA1IAVIKbmF2aWdhdGlvbogBARIbCgZhdXRob3IYAyABKA1IAlIGYXV0aG9yiAEB'
    'EhkKBWFkbWluGAQgASgNSANSBWFkbWluiAEBEiEKCW1vZGVyYXRvchgFIAEoDUgEUgltb2Rlcm'
    'F0b3KIAQFCCgoIX3ByaW1hcnlCDQoLX25hdmlnYXRpb25CCQoHX2F1dGhvckIICgZfYWRtaW5C'
    'DAoKX21vZGVyYXRvcg==');

