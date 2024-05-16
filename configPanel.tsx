import React, { useState, ChangeEvent } from 'react';

interface BotConfig {
  jobTitles: string[];
  keywords: string[];
  autoResponseThreshold: number;
  autoRejectionThreshold: number;
}

interface RecruitmentBotConfigProps {
  onSave: (config: BotConfig) => void;
}

const RecruitmentBotConfig: React.FC<RecruitmentBotConfigProps> = ({ onSave }) => {
  const [config, setConfig] = useState<BotConfig>({
    jobTitles: [],
    keywords: [],
    autoResponseThreshold: 0,
    autoRejectionThreshold: 0,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'jobTitles' || name === 'keywords') {
      setConfig((prevConfig) => ({
        ...prevConfig,
        [name]: value.split(',').map((item) => item.trim()).filter((item) => item),
      }));
    } else {
      setConfig((prevConfig) => ({
        ...prevConfig,
        [name]: parseFloat(value),
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(config);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="jobTitles">Job Titles:</label>
        <input
          type="text"
          id="jobTitles"
          name="jobTitles"
          value={config.jobTitles.join(', ')}
          onChange={handleChange}
          placeholder="e.g., Developer, Designer"
        />
      </div>
      <div>
        <label htmlFor="keywords">Keywords:</label>
        <textarea
          id="keywords"
          name="keywords"
          value={config.keywords.join(', ')}
          onChange={handleChange}
          placeholder="e.g., JavaScript, UX"
        />
      </div>
      <div>
        <label htmlFor="autoResponseThreshold">Auto-Response Threshold:</label>
        <input
          type="number"
          id="autoResponseThreshold"
          name="autoResponseThreshold"
          value={config.autoResponseThreshold}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="autoRejectionThreshold">Auto-Rejection Threshold:</label>
        <input
          type="number"
          id="autoRejectionThreshold"
          name="autoRejectionThreshold"
          value={config.autoRejectionThreshold}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save Configuration</button>
    </form>
  );
}

export default RecruitmentBotConfig;