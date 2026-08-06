export class BiometricService {
  static async isSensorAvailable(): Promise<boolean> {
    return true; // Supported
  }

  static async authenticate(reason: string = 'Unlock Health Records'): Promise<boolean> {
    // Simulated biometric prompt response
    return true;
  }
}
