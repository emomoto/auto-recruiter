import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';

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

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
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

    const formHasErrors = Object.keys(errors).some(key => errors[key].length > 0);
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

  const debouncedSetConfig = useCallback(debounce(setConfig, 500), []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const error = validateField(name, value);

    if (error) {
      setErrors({ ...errors, [name]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);

      debouncedSetConfig((prevConfig: BotConfig) => ({
        ...prevConfig,
        [name]:
          name === 'jobTitles' || name === 'keywords'
            ? value.split(',').map((item) => item.trim()).filter((item) => item)
            : parseFloat(value),
      }));
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
      {/* Form fields and buttons remain the same */}
    </form>
  );
};

export default RecruitmentBotConfig;