import { Injectable } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

@Injectable()
export class TracingService {
  private sdk: NodeSDK;

  init() {
    // Initialize OpenTelemetry with default configuration
    // Note: Resource class requires @opentelemetry/resources to be properly configured
    try {
      this.sdk = new NodeSDK({
        instrumentations: [getNodeAutoInstrumentations()],
      });
      this.sdk.start();
    } catch (error) {
      console.warn('Failed to initialize OpenTelemetry:', error);
    }
  }
}
