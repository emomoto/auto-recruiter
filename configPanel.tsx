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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: any) => {
    let error = '';
    if (name === 'autoResponseThreshold' || name === 'autoRejectionThreshold') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        error = 'Value must be a non-negative number.';
      } else if (name === 'autoResponseThreshold' && config.autoRejectionThreshold > numValue) {
        error = 'Auto-response threshold must be equal to or greater than auto-rejection threshold.';
      } else if (name === 'autoRejectionThreshold' && config.autoResponseThreshold < numValue) {
        error = 'Auto-rejection threshold cannot be greater than auto-response threshold.';
      }
    }
    return error;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const error = validateField(name, value);

    if (error) {
      setErrors({ ...errors, [name]: error });
    } else {
      // Remove error message if validation passes
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
      
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
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.keys(errors).length === 0) {
      onSave(config);
    } else {
      alert("Please correct the errors before saving.");
    }
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
        {errors.jobTitles && <p>{errors.jobTitles}</p>}
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
        {errors.keywords && <p>{errors.keywords}</p>}
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
        {errors.autoResponseThreshold && <p>{errors.autoResponseThreshold}</p>}
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
        {errors.autoRejectionThreshold && <p>{errors.autoRejectionThreshold}</p>}
      </div>
      <button type="submit">Save Configuration</button>
    </form>
  );
};

export default RecruitmentBotConfig;