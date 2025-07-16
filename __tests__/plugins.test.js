import withAdMobAppId from '../plugins/with-admob-app-id';
import withCustomPodfile from '../plugins/with-custom-podfile';
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
        getApplication: () => android.manifest.application[0],
        add: (app, _name, items) => {
          app.meta = items;
        },
      },
    },
    withDangerousMod: (config, [platform, action]) => {
      const fs = require('fs');
      const os = require('os');
      const path = require('path');
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'podfile-test'));
      const podfilePath = path.join(tmpDir, 'Podfile');
      fs.writeFileSync(podfilePath, config.podfile || '');
      config.modRequest = { platformProjectRoot: tmpDir };
      const result = action(config);
      const finalConfig = result || config;
      finalConfig.podfile = fs.readFileSync(podfilePath, 'utf8');
      fs.rmSync(tmpDir, { recursive: true, force: true });
      return finalConfig;
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
    expect(result.android.manifest.application[0].meta[0]['android:value']).toBe('android');
  });

  it('patches Podfile contents', () => {
    const config = { podfile: "use_expo_modules!()\npod 'FirebaseAuth'" };
    const result = withCustomPodfile(config);
    expect(result.podfile).toContain('use_frameworks! :linkage => :static');
    expect(result.podfile).toContain(":modular_headers => true");
  });

  it('removes build phase in Xcode project', () => {
    const config = {};
    const result = removeGoogleMobileAdsBuildPhase(config);
    expect(result.modResults.hash.project.objects.PBXShellScriptBuildPhase.phase1).toBeUndefined();
  });
});
