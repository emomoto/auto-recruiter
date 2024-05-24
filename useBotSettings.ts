import { useState, useEffect } from "react";
import axios from "axios";

interface RecruitmentBotSettings {
    maximumCandidates: number;
    autoScreeningEnabled: boolean;
}

const useRecruitmentBotSettings = () => {
    const [settings, setSettings] = useState<RecruitmentBotSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/recruitment-bot/settings`);
            setSettings(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: RecruitmentBotSettings) => {
        try {
            setLoading(true);
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/recruitment-bot/settings`, newSettings);
            setSettings(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        settings,
        loading,
        error,
        updateSettings,
    };
};

export default useRecruitmentBotSettings;