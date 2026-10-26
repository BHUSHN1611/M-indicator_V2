export interface INotificationService {
  requestPermissions(): Promise<boolean>;
  scheduleTrainAlert(trainNumber: string, message: string, triggerSeconds: number): Promise<string | null>;
  cancelAlert(id: string): Promise<void>;
}

class NotificationService implements INotificationService {
  async requestPermissions(): Promise<boolean> {
    // Stub for Expo Notifications when configured
    return true;
  }

  async scheduleTrainAlert(_trainNumber: string, _message: string, _triggerSeconds: number): Promise<string | null> {
    return null;
  }

  async cancelAlert(_id: string): Promise<void> {}
}

export const notificationService: INotificationService = new NotificationService();
