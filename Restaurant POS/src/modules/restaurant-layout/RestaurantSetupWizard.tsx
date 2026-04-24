import React, { useState } from 'react';
import StepperLayout from './components/StepperLayout';
import Step1AreaSelection from './steps/Step1AreaSelection';
import Step2SeatingConfig from './steps/Step2SeatingConfig';
import Step3LayoutBuilder from './steps/Step3LayoutBuilder';
import Step4Preview from './steps/Step4Preview';

const RestaurantSetupWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <Step1AreaSelection onNext={handleNext} />;
      case 1:
        return <Step2SeatingConfig onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <Step3LayoutBuilder onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step4Preview onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <StepperLayout activeStep={activeStep}>
      {renderStep()}
    </StepperLayout>
  );
};

export default RestaurantSetupWizard;
