export interface FeatureFlags {
  enableTeleconsultation: boolean;
  enableBiometrics: boolean;
  enableDiscounts: boolean;
  enableLabAttachmentDownload: boolean;
  enableHindiLanguage: boolean;
}

const defaultFlags: FeatureFlags = {
  enableTeleconsultation: true,
  enableBiometrics: true,
  enableDiscounts: true,
  enableLabAttachmentDownload: true,
  enableHindiLanguage: true,
};

class FeatureFlagService {
  private flags: FeatureFlags = { ...defaultFlags };

  getFlag<K extends keyof FeatureFlags>(key: K): boolean {
    return this.flags[key];
  }

  setFlag<K extends keyof FeatureFlags>(key: K, value: boolean) {
    this.flags[key] = value;
  }

  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }
}

export const featureFlags = new FeatureFlagService();
