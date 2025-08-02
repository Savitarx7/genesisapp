import withAdMobAppId from '../plugins/with-admob-app-id';
import removeGoogleMobileAdsBuildPhase from '../plugins/with-remove-admob-build-phase';

jest.mock('@expo/config-plugins', () => {
  const ios = {};
  const android = { manifest: { application: [{}] } };
  return {
    withInfoPlist: (config, cb) => {
      cb({ modResults: ios });
      config.ios = ios;
      return config;
    },
    withAndroidManifest: (config, cb) => {
      cb({ modResults: android });
      config.android = android;
      return config;
    },
    AndroidConfig: {
      Manifest: {
        getMainApplicationOrThrow: () => android.manifest.application[0],
        addMetaDataItemToMainApplication: (app, _name, value) => {
          app['meta-data'] = [{ $: { 'android:name': _name, 'android:value': value } }];
        },
      },
    },
    withXcodeProject: (config, cb) => {
      const fake = {
        getFirstTarget: () => ({ uuid: 't', target: {} }),
        getBuildPhase: () => ['phase1'],
        hash: {
          project: {
            objects: {
              PBXShellScriptBuildPhase: {
                phase1: { shellScript: '[RNGoogleMobileAds] Configuration' },
              },
            },
          },
        },
      };
      config.modResults = fake;
      cb(config);
      return config;
    },
  };
});

describe('custom plugins', () => {
  it('sets AdMob IDs in plist and manifest', () => {
    const config = { extra: { reactNativeGoogleMobileAds: { ios_app_id: 'ios', android_app_id: 'android' } } };
    const result = withAdMobAppId(config);
    expect(result.ios.GADApplicationIdentifier).toBe('ios');
    expect(result.android.manifest.application[0]['meta-data'][0].$['android:value']).toBe('android');
  });

  it('removes build phase in Xcode project', () => {
    const config = {};
    const result = removeGoogleMobileAdsBuildPhase(config);
    expect(result.modResults.hash.project.objects.PBXShellScriptBuildPhase.phase1).toBeUndefined();
  });
});
