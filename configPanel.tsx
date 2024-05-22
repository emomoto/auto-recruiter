import React, { useState, ChangeEvent, useEffect } from 'react';

interface BotConfig {
  jobTitles: string[];
  keywords: string[];
  autoResponseThreshold: number;
  autoRejectionThreshold: number;
}

interface RecruitmentBotConfigProps {
  onSave: (config: BotConfig) => void;
}

const defaultBotConfig = {
  jobTitles: [],
  keywords: [],
  autoResponseThreshold: 0,
  autoRejectionThreshold: 0,
};

const RecruitmentBotConfig: React.FC<RecruitmentBotConfigProps> = ({ onSave }) => {
  const [config, setConfig] = useState<BotConfig>(() => {
    const savedConfig = localStorage.getItem('botConfig');
    return savedConfig ? JSON.parse(savedConfig) : defaultBotConfig;
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('botConfig', JSON.stringify(config));

    const formHasErrors = Object.keys(errors).some((key) => errors[key].length > 0);
    const configIsIncomplete = !config.jobTitles.length || !config.keywords.length || (!config.autoResponseThreshold && config.autoResponseThreshold !== 0) || (!config.autoRejectionThreshold && config.autoRejectionThreshold !== 0);
    setIsFormValid(!formHasErrors && !configIsIncomplete);
  }, [config, errors]);

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
    if (Object.keys(errors).length === 0 && isFormValid) {
      onSave(config);
    } else {
      alert("Please correct the errors before saving.");
    }
  };

  const handleReset = () => {
    setConfig(defaultBotConfig);
    setErrors({});
    localStorage.removeItem('botConfig');
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
          onBlur={() => setErrors({ ...errors, jobTitles: validateField('jobTitles', config.jobTitles.join(', ')) })}
          placeholder="e.g., Developer, Designer"
        />
        <p style={{ color: errors.jobTitles ? 'red' : 'green' }}>{errors.jobTitles || 'Valid'}</p>
      </div>
      <div>
        <label htmlFor="keywords">Keywords:</label>
        <textarea
          id="keywords"
          name="keywords"
          value={config.keywords.join(', ')}
          onChange={handleChange}
          onBlur={() => setErrors({ ...errors, keywords: validateField('keywords', config.keywords.join(', ')) })}
          placeholder="e.g., JavaScript, UX"
        />
        <p style={{ color: errors.keywords ? 'red' : 'green' }}>{errors.keywords || 'Valid'}</p>
      </div>
      <div>
        <label htmlFor="autoResponseThreshold">Auto-Response Threshold:</label>
        <input
          type="number"
          id="autoResponseThreshold"
          name="autoResponseThreshold"
          value={config.autoResponseThreshold}
          onChange={handleChange}
          onBlur={() => setErrors({ ...errors, autoResponseThreshold: validateField('autoResponseThreshold', config.autoResponseThreshold.toString()) })}
        />
        <p style={{ color: errors.autoResponseThreshold ? 'red' : 'green' }}>{errors.autoResponseThreshold || 'Valid'}</p>
      </div>
      <div>
        <label htmlFor="autoRejectionThreshold">Auto-Rejection Threshold:</label>
        <input
          type="number"
          id="autoRejectionThreshold"
          name="autoRejectionThreshold"
          value={config.autoRejectionThreshold}
          onChange={handleChange}
          onBlur={() => setErrors({ ...errors, autoRejectionThreshold: validateField('autoRejectionThreshold', config.autoRejectionThreshold.toString()) })}
        />
        <p style={{ color: errors.autoRejectionThreshold ? 'red' : 'green' }}>{errors.autoRejectionThreshold || 'Valid'}</p>
      </div>
      <button type="submit" disabled={!isFormValid}>Save Configuration</button>
      <button type="button" onClick={handleReset}>Reset Configuration</button>
    </form>
  );
};

export default RecruitmentBotConfig;