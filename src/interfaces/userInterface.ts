export interface UserInterface {
    personal_info: {
        first_name: string;
        last_name: string;
        email: string;
        password?: string;
        phone_number?: string;
        gender?: 'male' | 'female' | 'other';
        date_of_birth?: Date;
        address: string;
    };
    oauth_info?: {
        user_id?: string;
        provider?: 'google' | 'facebook' | 'github';
        provider_id: string;
        access_token: string;
        refresh_token?: string;
        expires_at?: Date;
    }[];
    profile_pic?: string;
    preferences?: {
        notification_pref?: 'daily' | 'weekly' | 'monthly';
        language_pref?: string;
        theme_pref?: 'light' | 'dark';
    };
    habits_info?: {
        habit_id?: string;
        habit_name: string;
        habit_description: string;
    }[];
    last_login?: Date;
    behavior_tracking?: {
        last_activity?: Date;
        activity_log?: {
            action: string;
            timestamp?: Date;
            metadata?: any;
        }[];
        session_duration?: number;
        device_info?: string;
        location?: {
            type: 'Point';
            coordinates: number[];
        };
    };
    user_role?: 'user' | 'admin';
}
