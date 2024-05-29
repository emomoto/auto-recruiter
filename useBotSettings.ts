import { useState, useEffect } from "react";
import axios from "axios";

interface RecruitmentBotSettings {
    maximumCandidates: number;
    autoScreeningEnabled: boolean;
}

const useRecruitmentBotSettings = () => {
    const [settings, setSettings] = useState<RecruitmentBotSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const fetchRecruitmentBotSettings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/recruitment-bot/settings`);
            setSettings(response.data);
        } catch (error: any) {
            setFetchError(error.message || "Failed to fetch settings");
        } finally {
            setIsLoading(false);
        }
    };

    const saveUpdatedSettings = async (updatedSettings: RecruitmentBotSettings) => {
        try {
            setIsLoading(true);
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/recruitment-bot/settings`, updatedSettings);
            setSettings(response.data);
        } catch (error: any) {
            setFetchError(error.message || "Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecruitmentBotSettings();
    }, []);

    return {
        settings,
        isLoading,
        fetchError,
        updateSettings: saveUpdatedSettings,
    };
};

export default useRecruitmentBotSettings;