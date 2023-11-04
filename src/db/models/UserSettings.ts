import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'user_settings' })
export class UserSettings {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({ name: 'application_theme', nullable: true })
  applicationTheme?: string | null;

  @Property({ name: 'application_language', nullable: true })
  applicationLanguage?: string | null;

  @Property({ name: 'default_subtitle_language', nullable: true })
  defaultSubtitleLanguage?: string | null;
}

export interface UserSettingsDTO {
  id: string;
  applicationTheme?: string | null;
  applicationLanguage?: string | null;
  defaultSubtitleLanguage?: string | null;
}

export function formatUserSettings(
  userSettings: UserSettings,
): UserSettingsDTO {
  return {
    id: userSettings.id,
    applicationTheme: userSettings.applicationTheme,
    applicationLanguage: userSettings.applicationLanguage,
    defaultSubtitleLanguage: userSettings.defaultSubtitleLanguage,
  };
}
